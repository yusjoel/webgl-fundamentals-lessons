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



main();
