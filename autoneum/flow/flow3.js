"use strict";

let vertexShader = `
attribute vec3 position;
attribute vec3 previous;
attribute vec3 next;
attribute vec2 uv;
attribute vec2 uv2;
attribute float side;
attribute float width;
attribute float lineIndex;

uniform vec2 resolution;
uniform mat4 u_matrix;

vec2 when_eq(vec2 x, vec2 y) {
    return 1.0 - abs(sign(x - y));
}

vec2 fix(vec4 i, float aspect) {
    vec2 res = i.xy / i.w;
    res.x *= aspect;
    return res;
}

void main() {
    float aspect = resolution.x / resolution.y;
    
    vec3 pos = position;
    vec3 prevPos = previous;
    vec3 nextPos = next;

    vec4 finalPosition = u_matrix * vec4(pos, 1.0);
    vec4 pPos = u_matrix * vec4(prevPos, 1.0);
    vec4 nPos = u_matrix * vec4(nextPos, 1.0);
    
    vec2 currentP = fix(finalPosition, aspect);
    vec2 prevP = fix(pPos, aspect);
    vec2 nextP = fix(nPos, aspect);
    
    vec2 dirNC = normalize(currentP - prevP);
    vec2 dirPC = normalize(nextP - currentP);
    vec2 dir1 = normalize(currentP - prevP);
    vec2 dir2 = normalize(nextP - currentP);
    vec2 dirF = normalize(dir1 + dir2);
    vec2 dirM = mix(dirPC, dirNC, when_eq(nextP, currentP));
    vec2 dir = mix(dirF, dirM, clamp(when_eq(nextP, currentP) + when_eq(prevP, currentP), 0.0, 1.0));
    vec2 normal = vec2(-dir.y, dir.x);
    normal.x /= aspect;
    
    normal *= 0.5 * width;
    finalPosition.xy += normal * side;
    gl_Position = finalPosition;
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

/**
 * Shader Program Attribute
 * @param attributeName {string}
 * @param attributeLocation {number}
 * @param buffer {WebGLBuffer}
 * @param elements {[]}
 * @param size {number}
 * @constructor
 */
function Attribute(attributeName, attributeLocation, buffer, elements, size) {
    this.attributeName = attributeName;
    this.attributeLocation = attributeLocation;
    this.buffer = buffer;
    this.data = new Float32Array(elements);
    this.size = size;

    /**
     *
     * @param gl {WebGLRenderingContext}
     */
    this.fillBuffer = function (gl) {
        // Turn on the attribute
        gl.enableVertexAttribArray(this.attributeLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.STATIC_DRAW);

        // Tell the attribute how to get data out of buffer (ARRAY_BUFFER)
        let normalize = false; // don't normalize the data
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(this.attributeLocation, this.size, gl.FLOAT, normalize, stride, offset);
    };

    this.toString = function () {
        return this.attributeName;
    }
}

/**
 * Curve
 * @param shader {Shader}
 * @param lineIndex {number}
 * @param points {number[]} point position array
 * @constructor
 */
function Curve(shader, lineIndex, points) {
    /**
     * Shader program attributes
     * @type {Attribute[]}
     * @private
     */
    this.attributes = [];

    /**
     * 流线索引, 在着色器中根据索引号不同表现不同
     * @type {number}
     */
    this.lineIndex = lineIndex;

    /**
     * 曲线各个点的位置信息, 按照x, y, z的顺序排列
     * @type {number[]}
     */
    this.points = points;

    /**
     * 曲线中的点的数量
     * @type {number}
     */
    this.count = points.length / 3;

    /**
     * 使用的着色器程序
     * @type {Shader}
     */
    this.shader = shader;

    /**
     *
     * @type {Uint16Array}
     */
    this.indices = null;

    /**
     * 网格模式
     * @type {Uint16Array}
     */
    this.meshIndices = null;

    this.getPosition = function (index) {
        let i = index * 3;
        return new v3(this.points[i], this.points[i + 1], this.points[i + 2]);
    };

    /**
     * Add an attribute
     * @param attributeElements
     * @param attributeName {string}
     * @param size {number}
     */
    this.addAttribute = function (attributeElements, attributeName, size) {
        /**
         * @type {ShaderProgramAttribute}
         */
        let attribute = this.shader.attributes[attributeName];
        let elements = attributeElements[attributeName];
        this.attributes.push(new Attribute(attributeName, attribute.location, attribute.buffer, elements, size));
    };

    this.initialize = function () {
        let attributeElements = {};
        for (let attributeName in this.shader.attributes) {
            attributeElements[attributeName] = [];
        }

        /**
         * @param attributeName {string}
         * @param vector {v3}
         */
        function addVector(attributeName, vector) {
            attributeElements[attributeName].push(vector.x);
            attributeElements[attributeName].push(vector.y);
            attributeElements[attributeName].push(vector.z);
        }

        /**
         * @param attributeName {string}
         * @param x {number}
         * @param y {number}
         */
        function addXY(attributeName, x, y) {
            attributeElements[attributeName].push(x);
            attributeElements[attributeName].push(y);
        }

        let curveLength = 0;
        for (let i = 0; i < this.count; i++) {
            let currentPosition = this.getPosition(i);
            let previousPosition = this.getPosition(Math.max(0, i - 1));
            let nextPosition = this.getPosition(Math.min(this.count - 1, i + 1));
            if (i === 0)
                previousPosition.subtract(v3.subtract(nextPosition, previousPosition));
            if (i === this.count - 1)
                nextPosition.add(v3.subtract(nextPosition, previousPosition));

            addVector('position', currentPosition);
            addVector('position', currentPosition);

            addVector('previous', previousPosition);
            addVector('previous', previousPosition);

            addVector('next', nextPosition);
            addVector('next', nextPosition);

            curveLength += v3.distance(currentPosition, previousPosition);
        }

        let currentLength = 0;
        for (let i = 0; i < this.count; i++) {
            let currentPosition = this.getPosition(i);
            let previousPosition = this.getPosition(Math.max(0, i - 1));
            let nextPosition = this.getPosition(Math.min(this.count - 1, i + 1));
            if (i === 0)
                previousPosition.subtract(v3.subtract(nextPosition, previousPosition));
            currentLength += v3.distance(currentPosition, previousPosition);

            addXY('uv', i / this.count, 0);
            addXY('uv', i / this.count, 1);

            addXY('uv2', currentLength, curveLength);
            addXY('uv2', currentLength, curveLength);

            addXY('width', 0.2, 0.2);
            addXY('side', 1, -1);
            addXY('lineIndex', this.lineIndex, this.lineIndex);
        }


        this.addAttribute(attributeElements, 'position', 3);
        this.addAttribute(attributeElements, 'previous', 3);
        this.addAttribute(attributeElements, 'next', 3);

        this.addAttribute(attributeElements, 'uv', 2);
        this.addAttribute(attributeElements, 'uv2', 2);

        this.addAttribute(attributeElements, 'side', 1);
        this.addAttribute(attributeElements, 'lineIndex', 1);
        this.addAttribute(attributeElements, 'width', 1);

        {
            let indexElements = [];
            for (let i = 0; i < this.count - 1; i++) {
                indexElements.push(i * 2);
                indexElements.push(i * 2 + 1);
                indexElements.push(i * 2 + 2);
                indexElements.push(i * 2 + 2);
                indexElements.push(i * 2 + 1);
                indexElements.push(i * 2 + 3);
            }

            this.indices = new Uint16Array(indexElements);
        }

        {
            let indexElements = [];
            for (let i = 0; i < this.count - 1; i++) {
                indexElements.push(i * 2);
                indexElements.push(i * 2 + 1);
                indexElements.push(i * 2 + 1);
                indexElements.push(i * 2 + 2);
                indexElements.push(i * 2 + 2);
                indexElements.push(i * 2);

                indexElements.push(i * 2 + 2);
                indexElements.push(i * 2 + 1);
                indexElements.push(i * 2 + 1);
                indexElements.push(i * 2 + 3);
                indexElements.push(i * 2 + 3);
                indexElements.push(i * 2 + 2);
            }

            this.meshIndices = new Uint16Array(indexElements);
        }
    };

    /**
     * @param gl {WebGLRenderingContext}
     */
    this.prepareDraw = function (gl) {
        gl.useProgram(this.shader.program);
    };

    /**
     * 正常描绘
     * @param gl {WebGLRenderingContext}
     */
    this.draw = function (gl) {
        // Attributes
        let attributeLength = this.attributes.length;
        for (let i = 0; i < attributeLength; i++) {
            let attribute = this.attributes[i];
            attribute.fillBuffer(gl);
        }

        // Index
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.shader.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        // 描绘线段
        let primitiveType = gl.TRIANGLES;
        let offset = 0;
        let count = (this.count - 1) * 6;
        let indexType = gl.UNSIGNED_SHORT;
        gl.drawElements(primitiveType, count, indexType, offset);
    };

    /**
     * 描绘网格
     * @param gl {WebGLRenderingContext}
     */
    this.drawMesh = function (gl) {
        // Attributes
        let attributeLength = this.attributes.length;
        for (let i = 0; i < attributeLength; i++) {
            let attribute = this.attributes[i];
            attribute.fillBuffer(gl);
        }

        // Index
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.shader.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.meshIndices, gl.STATIC_DRAW);

        // 描绘网格
        let primitiveType = gl.LINES;
        let offset = 0;
        let count = (this.count - 1) * 12;
        let indexType = gl.UNSIGNED_SHORT;
        gl.drawElements(primitiveType, count, indexType, offset);
    };

    this.initialize();
}

/**
 * Shader Program Attribute
 * @param attributeName {string}
 * @param location {number}
 * @param buffer {WebGLBuffer}
 * @constructor
 */
function ShaderProgramAttribute(attributeName, location, buffer) {
    this.attributeName = attributeName;
    this.location = location;
    this.buffer = buffer;
}

/**
 * Shader Program Uniform
 * @param uniformName {string}
 * @param location {WebGLUniformLocation }
 * @constructor
 */
function ShaderProgramUniform(uniformName, location) {
    this.uniformName = uniformName;
    this.location = location;
}

/**
 * Shader
 * @param gl {WebGLRenderingContext}
 * @param shaders {string[]}
 * @param attributeNames {string[]}
 * @param uniformNames {string[]}
 * @constructor
 */
function Shader(gl, shaders, attributeNames, uniformNames) {
    this.program = webglUtils.createProgramFromSources(gl, shaders);
    this.attributes = {};
    this.uniforms = {};

    // create the buffer
    this.indexBuffer = gl.createBuffer();

    let length = attributeNames.length;
    for (let i = 0; i < length; i++) {
        let attributeName = attributeNames[i];
        let location = gl.getAttribLocation(this.program, attributeName);
        let buffer = gl.createBuffer();
        this.attributes[attributeName] = new ShaderProgramAttribute(attributeName, location, buffer);
    }

    length = uniformNames.length;
    for (let i = 0; i < length; i++) {
        let uniformName = uniformNames[i];
        let location = gl.getUniformLocation(this.program, uniformName);
        this.uniforms[uniformName] = new ShaderProgramUniform(uniformName, location);
    }
}

function main() {
    // Get A WebGL context
    let canvas = document.getElementById("canvas");
    canvas.style.width = '1600px';
    canvas.style.height = '900px';
    let gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // setup GLSL program
    let shaders = [vertexShader, fragmentShader];
    let attributeNames = [
        'position',
        'previous',
        'next',
        'side',
        'lineIndex',
        'width',
        'uv',
        'uv2'
    ];
    let uniformNames = ['u_matrix', 'resolution'];
    let shader = new Shader(gl, shaders, attributeNames, uniformNames);

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
    let drawShade = true;

    // create curves
    let curves = [];
    let curveCount = curveData.length;
    for (let i = 0; i < curveCount; i++) {
        let curve = new Curve(shader, i, curveData[i]);
        curves.push(curve);
    }

    drawScene();

    // Setup a ui.
    webglLessonsUI.setupSlider("#targetX", {value: targetX, slide: updatePivotX, min: -10, max: 10});
    webglLessonsUI.setupSlider("#targetZ", {value: targetZ, slide: updatePivotY, min: -10, max: 10});
    webglLessonsUI.setupSlider("#cameraDistance", {
        value: cameraDistance,
        slide: updateCameraDistance,
        min: 1,
        max: 15
    });
    webglLessonsUI.setupSlider("#cameraYawAngle", {value: cameraYawAngle, slide: updateCameraYawAngle, max: 360});
    webglLessonsUI.setupSlider("#cameraPitchAngle", {value: cameraPitchAngle, slide: updateCameraPitchAngle, max: 89});

    const uiElem = document.querySelector("#ui");
    let checkbox = webglLessonsUI.makeCheckbox({name: "Shade/Mesh", value: drawShade, change: updateDrawMode});
    uiElem.appendChild(checkbox.elem);

    function updateDrawMode(e, ui) {
        drawShade = ui.value;
        drawScene();
    }

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

        for (let i in curves) {
            let curve = curves[i];

            curve.prepareDraw(gl);

            // 设置矩阵
            let projectMatrix = m4.perspective(near, far, fieldOfViewInRadians, aspect);
            let matrix = m4.multiply(projectMatrix, viewMatrix);
            let uniform = curve.shader.uniforms['u_matrix'];
            gl.uniformMatrix4fv(uniform.location, false, matrix);

            // 设置分辨率
            uniform = curve.shader.uniforms['resolution'];
            gl.uniform2f(uniform.location, canvas.clientWidth, canvas.clientHeight);

            if(drawShade)
                curve.draw(gl);
            else
                curve.drawMesh(gl);
        }
    }
}

main();
