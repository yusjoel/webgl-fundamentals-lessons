let m4 = {
    perspective: function (near, far, fieldOfView, aspect) {
        let tan = Math.tan(fieldOfView / 2);
        return this.transpose([
            1 / (aspect * tan), 0, 0, 0,
            0, 1 / tan, 0, 0,
            0, 0, (near + far) / (near - far), -2 * near * far / (near - far),
            0, 0, -1, 0
        ]);
    },

    projection: function (width, height, depth) {
        // 回顾一下2D世界中是如何计算投影矩阵的
        // 从像素坐标转换到 0.0 到 1.0
        // vec2 zeroToOne = position / u_resolution;
        // 再把 0->1 转换 0->2
        // vec2 zeroToTwo = zeroToOne * 2.0;
        // 把 0->2 转换到 -1->+1 (裁剪空间)
        // vec2 clipSpace = zeroToTwo - 1.0;
        // gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

        // 在2D世界中x默认取值是(0, width), y的默认取值是(0, height)
        // 所以才有第一步转化到(0, 1)的说法
        // 在3D世界中增加了z轴, 默认取值是(-depth/2, depth/2)
        // 所以第3步, 不需要-1, 可以用纸笔计算一下转换矩阵
        return this.transpose([
            2 / width, 0, 0, -1,
            0, -2 / height, 0, 1,
            0, 0, 2 / depth, 0,
            0, 0, 0, 1
        ]);
    },

    translation: function (tx, ty, tz) {
        return this.transpose([
            1, 0, 0, tx,
            0, 1, 0, ty,
            0, 0, 1, tz,
            0, 0, 0, 1
        ]);
    },

    scaling: function (sx, sy, sz) {
        return this.transpose([
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ]);
    },

    xRotation: function (angleInRadians) {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        return this.transpose([
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        ]);
    },

    yRotation: function (angleInRadians) {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        return this.transpose([
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ]);
    },

    zRotation: function (angleInRadians) {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        return this.transpose([
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    },

    /**
     * 计算3x3矩阵的行列式
     * @param m
     */
    determinant: function (m) {
        let m11 = m[0];
        let m21 = m[1];
        let m31 = m[2];
        let m12 = m[3];
        let m22 = m[4];
        let m32 = m[5];
        let m13 = m[6];
        let m23 = m[7];
        let m33 = m[8];
        return m11 * (m22 * m33 - m23 * m32) - m12 * (m21 * m33 - m23 * m31) + m13 * (m21 * m32 - m22 * m31);
    },

    /**
     * 获取余子式
     * @param m 4x4矩阵
     * @param i 行
     * @param j 列
     * @returns {[]} 余子式
     */
    minor: function (m, i, j) {
        let mm = [];
        for (let jj = 0; jj < 4; jj++) {
            if (jj == j) continue;
            for (let ii = 0; ii < 4; ii++) {
                if (ii == i) continue;

                mm.push(m[jj * 4 + ii]);
            }
        }
        return mm;
    },

    /**
     * 代数余子式
     * @param m 4x4矩阵
     * @param i 行
     * @param j 列
     * @returns {number|*} 值
     */
    cofactor: function (m, i, j) {
        let c = this.determinant(this.minor(m, i, j));
        if(c == 0) return 0;
        if ((i + j) % 2 == 0)
            return c;
        else
            return -c;
    },

    /**
     * 求逆矩阵
     * @param m 4x4的矩阵
     */
    inverse: function (m) {
        let mm = [];
        // 先求伴随矩阵, 伴随矩阵是代数余子式组成矩阵的转置
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                mm.push(this.cofactor(m, i, j))

        // 求原矩阵的行列式
        let d = m[0] * mm[0] + m[4] * mm[1] + m[8] * mm[2] + m[12] * mm[3];

        // 用伴随矩阵法求逆矩阵
        for (let i in mm) {
            mm[i] = mm[i] / d;
        }
        return mm;
    },

    /**
     * 计算摄像机的LookAt矩阵
     * @param cameraPosition {v3}
     * @param targetPosition {v3}
     * @param up {v3}
     * @return {[]}
     */
    lookAt: function(cameraPosition, targetPosition, up) {
        // 镜头方向是-z
        let zAxis = v3.subtract(cameraPosition, targetPosition).normalize();
        let xAxis = v3.cross(up, zAxis).normalize();
        let yAxis = v3.cross(zAxis, xAxis).normalize();

        return [
            xAxis.x, xAxis.y, xAxis.z, 0,
            yAxis.x, yAxis.y, yAxis.z, 0,
            zAxis.x, zAxis.y, zAxis.z, 0,
            cameraPosition.x, cameraPosition.y, cameraPosition.z, 1
        ];
    },

    transpose: function (m) {
        return [
            m[0], m[4], m[8], m[12],
            m[1], m[5], m[9], m[13],
            m[2], m[6], m[10], m[14],
            m[3], m[7], m[11], m[15]
        ];
    },

    multiply: function (a, b) {
        let dst = [];
        let b00 = b[0 * 4 + 0];
        let b01 = b[0 * 4 + 1];
        let b02 = b[0 * 4 + 2];
        let b03 = b[0 * 4 + 3];
        let b10 = b[1 * 4 + 0];
        let b11 = b[1 * 4 + 1];
        let b12 = b[1 * 4 + 2];
        let b13 = b[1 * 4 + 3];
        let b20 = b[2 * 4 + 0];
        let b21 = b[2 * 4 + 1];
        let b22 = b[2 * 4 + 2];
        let b23 = b[2 * 4 + 3];
        let b30 = b[3 * 4 + 0];
        let b31 = b[3 * 4 + 1];
        let b32 = b[3 * 4 + 2];
        let b33 = b[3 * 4 + 3];
        let a00 = a[0 * 4 + 0];
        let a01 = a[0 * 4 + 1];
        let a02 = a[0 * 4 + 2];
        let a03 = a[0 * 4 + 3];
        let a10 = a[1 * 4 + 0];
        let a11 = a[1 * 4 + 1];
        let a12 = a[1 * 4 + 2];
        let a13 = a[1 * 4 + 3];
        let a20 = a[2 * 4 + 0];
        let a21 = a[2 * 4 + 1];
        let a22 = a[2 * 4 + 2];
        let a23 = a[2 * 4 + 3];
        let a30 = a[3 * 4 + 0];
        let a31 = a[3 * 4 + 1];
        let a32 = a[3 * 4 + 2];
        let a33 = a[3 * 4 + 3];
        dst[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        dst[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        dst[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        dst[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        dst[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        dst[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        dst[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        dst[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        dst[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        dst[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        dst[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        dst[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        dst[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        dst[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        dst[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        dst[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
        return dst;
    }
};
