"use strict";

function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // setup GLSL program
    var program = webglUtils.createProgramFromScripts(gl, ["3d-vertex-shader", "3d-fragment-shader"]);
    gl.useProgram(program);

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var colorLocation = gl.getAttribLocation(program, "a_color");

    // lookup uniforms
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");

    // Create a buffer to put positions in
    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Put geometry data into buffer
    setGeometry(gl);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColors(gl);

    var translation = [120, 110, 0];
    var rotation = [0, 0, 0];
    var scale = [1, 1, 1];
    var color = [Math.random(), Math.random(), Math.random(), 1];

    var angles = [30, 340, 30];
    for (var i = 0; i < 3; i++) {
        rotation[i] = -angles[i] * Math.PI / 180;
    }

    var ortho = [0, gl.canvas.clientWidth, gl.canvas.clientHeight, 0, 400, -400];

    drawScene();

    // Setup a ui.
    webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width});
    webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#z", {value: translation[2], slide: updatePosition(2), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#angleX", {value: angles[0], slide: updateAngle(0), max: 360});
    webglLessonsUI.setupSlider("#angleY", {value: angles[1], slide: updateAngle(1), max: 360});
    webglLessonsUI.setupSlider("#angleZ", {value: angles[2], slide: updateAngle(2), max: 360});
    webglLessonsUI.setupSlider("#scaleX", {
        value: scale[0],
        slide: updateScale(0),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2
    });
    webglLessonsUI.setupSlider("#scaleY", {
        value: scale[1],
        slide: updateScale(1),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2
    });
    webglLessonsUI.setupSlider("#scaleZ", {
        value: scale[2],
        slide: updateScale(2),
        min: -5,
        max: 5,
        step: 0.01,
        precision: 2
    });

    webglLessonsUI.setupSlider("#left", {value: ortho[0], slide: updateOrtho(0), min: -500, max: 500});
    webglLessonsUI.setupSlider("#right", {value: ortho[1], slide: updateOrtho(1), min: -500, max: 500});
    webglLessonsUI.setupSlider("#top", {value: ortho[2], slide: updateOrtho(2), min: -500, max: 500});
    webglLessonsUI.setupSlider("#bottom", {value: ortho[3], slide: updateOrtho(3), min: -500, max: 500});
    webglLessonsUI.setupSlider("#near", {value: ortho[4], slide: updateOrtho(4), min: -500, max: 500});
    webglLessonsUI.setupSlider("#far", {value: ortho[5], slide: updateOrtho(5), min: -500, max: 500});

    function updateOrtho(index) {
        return function (event, ui) {
            ortho[index] = ui.value;
            drawScene();
        }
    }

    function updatePosition(index) {
        return function (event, ui) {
            translation[index] = ui.value;
            drawScene();
        };
    }

    function updateAngle(index) {
        return function (event, ui) {
            var angleInDegrees = -ui.value;
            var angleInRadians = angleInDegrees * Math.PI / 180;
            rotation[index] = angleInRadians;
            drawScene();
        };
    }

    function updateScale(index) {
        return function (event, ui) {
            scale[index] = ui.value;
            drawScene();
        };
    }

    // Draw the scene.
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        //gl.enable(gl.CULL_FACE);

        gl.enable(gl.DEPTH_TEST);

        // Clear the canvas.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Turn on the attribute
        gl.enableVertexAttribArray(positionLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 3;          // 3 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionLocation, size, type, normalize, stride, offset);

        // set the color
        gl.enableVertexAttribArray(colorLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

        var size = 3;
        var type = gl.UNSIGNED_BYTE;
        var normalize = true;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);


        // 计算投影矩阵
        var depth = 400;
        //var projectMatrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, depth);
        var projectMatrix = m4.ortho(ortho[0], ortho[1], ortho[2], ortho[3], ortho[4], ortho[5]);

        // 计算矩阵
        var translationMatrix = m4.translation(translation[0], translation[1], translation[2]);
        var xRotationMatrix = m4.xRotation(rotation[0]);
        var yRotationMatrix = m4.yRotation(rotation[1]);
        var zRotationMatrix = m4.zRotation(rotation[2]);
        var scaleMatrix = m4.scaling(scale[0], scale[1], scale[2]);

        // 矩阵相乘
        var matrix = m4.multiply(projectMatrix, translationMatrix);
        matrix = m4.multiply(matrix, zRotationMatrix);
        matrix = m4.multiply(matrix, yRotationMatrix);
        matrix = m4.multiply(matrix, xRotationMatrix);
        matrix = m4.multiply(matrix, scaleMatrix);

        // 设置矩阵
        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 16 * 6;
        gl.drawArrays(primitiveType, offset, count);
    }
}

function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column front
            0, 0, 0,
            0, 150, 0,
            30, 0, 0,
            0, 150, 0,
            30, 150, 0,
            30, 0, 0,

            // top rung front
            30, 0, 0,
            30, 30, 0,
            100, 0, 0,
            30, 30, 0,
            100, 30, 0,
            100, 0, 0,

            // middle rung front
            30, 60, 0,
            30, 90, 0,
            67, 60, 0,
            30, 90, 0,
            67, 90, 0,
            67, 60, 0,

            // left column back
            0, 0, 30,
            30, 0, 30,
            0, 150, 30,
            0, 150, 30,
            30, 0, 30,
            30, 150, 30,

            // top rung back
            30, 0, 30,
            100, 0, 30,
            30, 30, 30,
            30, 30, 30,
            100, 0, 30,
            100, 30, 30,

            // middle rung back
            30, 60, 30,
            67, 60, 30,
            30, 90, 30,
            30, 90, 30,
            67, 60, 30,
            67, 90, 30,

            // top
            0, 0, 0,
            100, 0, 0,
            100, 0, 30,
            0, 0, 0,
            100, 0, 30,
            0, 0, 30,

            // top rung right
            100, 0, 0,
            100, 30, 0,
            100, 30, 30,
            100, 0, 0,
            100, 30, 30,
            100, 0, 30,

            // under top rung
            30, 30, 0,
            30, 30, 30,
            100, 30, 30,
            30, 30, 0,
            100, 30, 30,
            100, 30, 0,

            // between top rung and middle
            30, 30, 0,
            30, 60, 30,
            30, 30, 30,
            30, 30, 0,
            30, 60, 0,
            30, 60, 30,

            // top of middle rung
            30, 60, 0,
            67, 60, 30,
            30, 60, 30,
            30, 60, 0,
            67, 60, 0,
            67, 60, 30,

            // right of middle rung
            67, 60, 0,
            67, 90, 30,
            67, 60, 30,
            67, 60, 0,
            67, 90, 0,
            67, 90, 30,

            // bottom of middle rung.
            30, 90, 0,
            30, 90, 30,
            67, 90, 30,
            30, 90, 0,
            67, 90, 30,
            67, 90, 0,

            // right of bottom
            30, 90, 0,
            30, 150, 30,
            30, 90, 30,
            30, 90, 0,
            30, 150, 0,
            30, 150, 30,

            // bottom
            0, 150, 0,
            0, 150, 30,
            30, 150, 30,
            0, 150, 0,
            30, 150, 30,
            30, 150, 0,

            // left side
            0, 0, 0,
            0, 0, 30,
            0, 150, 30,
            0, 0, 0,
            0, 150, 30,
            0, 150, 0]),
        gl.STATIC_DRAW);
}

// Fill the buffer with colors for the 'F'.
function setColors(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Uint8Array([
            // left column front
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,

            // top rung front
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,

            // middle rung front
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,

            // left column back
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,

            // top rung back
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,

            // middle rung back
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,

            // top
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,

            // top rung right
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,

            // under top rung
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,

            // between top rung and middle
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,

            // top of middle rung
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,

            // right of middle rung
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,

            // bottom of middle rung.
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,

            // right of bottom
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,

            // bottom
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,

            // left side
            160, 160, 220,
            160, 160, 220,
            160, 160, 220,
            160, 160, 220,
            160, 160, 220,
            160, 160, 220]),
        gl.STATIC_DRAW);
}

var m4 = {
    ortho: function (left, right, top, bottom, near, far) {
        // x轴对应左右, y轴对应上下, z轴对应前(近)后(远)

        var width = right - left;
        var height = top - bottom;
        var depth = near - far;
        return this.transpose([
            2 / width, 0, 0, -(right + left) / width,
            0, 2 / height, 0, -(top + bottom) / height,
            0, 0, 2 / depth, -(near + far) / depth,
            0, 0, 0, 1
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
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        return this.transpose([
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        ]);
    },

    yRotation: function (angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        return this.transpose([
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ]);
    },

    zRotation: function (angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        return this.transpose([
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
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
        var dst = [];
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];
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