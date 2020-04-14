"use strict";

let vertexShader = `
attribute vec4 a_position;
uniform mat4 u_matrix;

void main() {
  gl_Position = u_matrix * a_position;
}
`;

let fragmentShader = `
precision mediump float;

void main() {
   gl_FragColor = vec4(1, 0, 0, 1);
}
`;

let curveData = [
    [0.0106, 0.7272, 4.3539, 0.0107, 0.7272, 3.7771, 0.0107, 0.7272, 3.2003, 0.0107, 0.734, 2.5964, 0.0108, 0.796, 2.0664, 0.0109, 0.9404, 1.5238, 0.0108, 1.0424, 0.958, 0.0108, 1.3533, 0.335, 0.0107, 1.4536, -0.3435, 0.0106, 1.4169, -0.9825, 0.0105, 1.3575, -1.6568, 0.0106, 1.3358, -2.2246, 0.0107, 1.3334, -2.9659, 0.0107, 1.3334, -3.794, 0.0107, 1.3334, -4.5629],
    [0.2149, 0.7272, 4.3539, 0.2149, 0.7272, 3.7771, 0.215, 0.7272, 3.2003, 0.2179, 0.7291, 2.6114, 0.235, 0.7793, 2.1382, 0.2591, 0.9517, 1.5865, 0.2642, 1.0639, 0.9699, 0.2641, 1.36, 0.335, 0.264, 1.4608, -0.3435, 0.264, 1.4361, -0.9825, 0.2639, 1.3796, -1.6568, 0.264, 1.3542, -2.2246, 0.2641, 1.3371, -2.9659, 0.2641, 1.3334, -3.794, 0.2641, 1.3334, -4.5629],
    [0.4132, 0.7272, 4.3539, 0.4132, 0.7272, 3.7771, 0.4133, 0.7272, 3.2003, 0.4155, 0.734, 2.5964, 0.4433, 0.796, 2.0664, 0.5316, 0.9404, 1.5238, 0.5954, 1.0331, 0.9641, 0.6355, 1.3046, 0.3597, 0.6415, 1.3871, -0.3373, 0.6411, 1.3482, -0.9825, 0.641, 1.2888, -1.6568, 0.641, 1.2671, -2.2246, 0.6412, 1.2647, -2.9659, 0.6412, 1.2647, -3.794, 0.6412, 1.2647, -4.5629],
    [0.6671, 0.5597, 4.3539, 0.6671, 0.5597, 3.7771, 0.6605, 0.5597, 3.1922, 0.6533, 0.5665, 2.5439, 0.759, 0.6199, 1.9873, 0.9069, 0.7442, 1.5396, 0.9026, 0.8328, 0.9669, 0.8754, 0.9055, 0.335, 0.8531, 0.9443, -0.3435, 0.827, 0.9753, -0.9825, 0.7934, 1.0173, -1.6568, 0.7757, 1.0634, -2.2246, 0.7731, 1.1075, -2.9659, 0.7731, 1.1167, -3.794, 0.7731, 1.1167, -4.5629],
    [-0.2149, 0.7272, 4.3539, -0.2149, 0.7272, 3.7771, -0.215, 0.7272, 3.2003, -0.2179, 0.7291, 2.6114, -0.235, 0.7793, 2.1382, -0.2591, 0.9517, 1.5865, -0.2642, 1.0639, 0.9699, -0.2641, 1.36, 0.335, -0.264, 1.4608, -0.3435, -0.264, 1.4361, -0.9825, -0.2639, 1.3796, -1.6568, -0.264, 1.3542, -2.2246, -0.2641, 1.3371, -2.9659, -0.2641, 1.3334, -3.794, -0.2641, 1.3334, -4.5629],
    [-0.4132, 0.7272, 4.3539, -0.4132, 0.7272, 3.7771, -0.4133, 0.7272, 3.2003, -0.4155, 0.734, 2.5964, -0.4433, 0.796, 2.0664, -0.5316, 0.9404, 1.5238, -0.5954, 1.0331, 0.9641, -0.6355, 1.3046, 0.3597, -0.6415, 1.3871, -0.3373, -0.6411, 1.3482, -0.9825, -0.641, 1.2888, -1.6568, -0.641, 1.2671, -2.2246, -0.6412, 1.2647, -2.9659, -0.6412, 1.2647, -3.794, -0.6412, 1.2647, -4.5629],
    [-0.6671, 0.5597, 4.3539, -0.6671, 0.5597, 3.7771, -0.6605, 0.5597, 3.1922, -0.6533, 0.5665, 2.5439, -0.759, 0.6199, 1.9873, -0.9069, 0.7442, 1.5396, -0.9026, 0.8328, 0.9669, -0.8754, 0.9055, 0.335, -0.8531, 0.9443, -0.3435, -0.827, 0.9753, -0.9825, -0.7934, 1.0173, -1.6568, -0.7757, 1.0634, -2.2246, -0.7731, 1.1075, -2.9659, -0.7731, 1.1167, -3.794, -0.7731, 1.1167, -4.5629]
];

function main() {
    // Get A WebGL context
    let canvas = document.getElementById("canvas");
    let gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // setup GLSL program
    let program = webglUtils.createProgramFromSources(gl, [vertexShader, fragmentShader]);
    gl.useProgram(program);

    // look up where the vertex data needs to go.
    let positionLocation = gl.getAttribLocation(program, "a_position");
    let colorLocation = gl.getAttribLocation(program, "a_color");

    // lookup uniforms
    let matrixLocation = gl.getUniformLocation(program, "u_matrix");

    // Create a buffer to put positions in
    let positionBuffer = gl.createBuffer();
    // create the buffer
    let indexBuffer = gl.createBuffer();

    let near = -1;
    let far = -1000;
    let fieldOfViewInDegrees = 45;
    let fieldOfViewInRadians = fieldOfViewInDegrees * Math.PI / 180;
    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    let targetX = 0;
    let targetZ = 0;
    let cameraYawAngle = 0;
    let cameraPitchAngle = 50;
    let cameraDistance = 10;

    drawScene();

    // Setup a ui.
    webglLessonsUI.setupSlider("#targetX", {value: targetX, slide: updatePivotX, min: -10, max: 10});
    webglLessonsUI.setupSlider("#targetZ", {value: targetZ, slide: updatePivotY, min: -10, max: 10});
    webglLessonsUI.setupSlider("#cameraDistance", {value: cameraDistance, slide: updateCameraDistance, min: 1, max: 15});
    webglLessonsUI.setupSlider("#cameraYawAngle", {value: cameraYawAngle, slide: updateCameraYawAngle, max: 360});
    webglLessonsUI.setupSlider("#cameraPitchAngle", {value: cameraPitchAngle, slide: updateCameraPitchAngle, max: 89});

    function updatePivotX(e, ui) {
        targetX = ui.value;
        drawScene();
    }

    function updatePivotY(e, ui) {
        targetZ = ui.value;
        drawScene();
    }

    function updateCameraDistance(e, ui) {
        cameraDistance = ui.value;
        drawScene();
    }

    function updateCameraYawAngle(e, ui) {
        cameraYawAngle = ui.value;
        drawScene();
    }

    function updateCameraPitchAngle(e, ui) {
        cameraPitchAngle = ui.value;
        drawScene();
    }

    // Draw the scene.
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.enable(gl.CULL_FACE);

        gl.enable(gl.DEPTH_TEST);

        // Clear the canvas.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // 计算摄像机的变换矩阵
        let cameraYawAngleInRadian = cameraYawAngle * Math.PI / 180;
        let cameraPitchAngleInRadian = cameraPitchAngle * Math.PI / 180;
        let cosineYaw = Math.cos(cameraYawAngleInRadian);
        let sineYaw = Math.sin(cameraYawAngleInRadian);
        let cosinePitch = Math.cos(cameraPitchAngleInRadian);
        let sinePitch = Math.sin(cameraPitchAngleInRadian);
        let y = sinePitch * cameraDistance;
        let xz = cosinePitch * cameraDistance;
        let cameraPosition = new v3(xz * cosineYaw, y, xz * sineYaw);
        let targetPosition = new v3(targetX, 0, targetZ);
        let up = new v3(0, 1, 0);
        let cameraMatrix = m4.lookAt(cameraPosition, targetPosition, up);

        // 计算视口变换矩阵
        let viewMatrix = m4.inverse(cameraMatrix);

        for (let i in curveData) {
            let points = curveData[i];

            {
                // Turn on the attribute
                gl.enableVertexAttribArray(positionLocation);

                // Bind the position buffer.
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(curve.vertices), gl.STATIC_DRAW);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

                // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
                let size = 3;          // 3 components per iteration
                let type = gl.FLOAT;   // the data is 32bit floats
                let normalize = false; // don't normalize the data
                let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
                let offset = 0;        // start at the beginning of the buffer
                gl.vertexAttribPointer(
                    positionLocation, size, type, normalize, stride, offset);
            }

            // 设置矩阵
            let projectMatrix = m4.perspective(near, far, fieldOfViewInRadians, aspect);
            let matrix = m4.multiply(projectMatrix, viewMatrix);
            gl.uniformMatrix4fv(matrixLocation, false, matrix);

            // 描绘线段
            let primitiveType = gl.LINE_STRIP;
            let offset = 0;
            let count = points.length / 3;
            gl.drawArrays(primitiveType, offset, count);
        }
    }
}

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

main();
