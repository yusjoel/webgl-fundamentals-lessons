/**
 *
 * @constructor
 * @param x {number}
 * @param y {number}
 * @param z {number}
 */
let v3 = function (x = 0, y = 0, z = 0) {
    /**
     * X
     * @type {number}
     */
    this.x = x;

    /**
     * Y
     * @type {number}
     */
    this.y = y;

    /**
     * Z
     * @type {number}
     */
    this.z = z;
};

v3.prototype.toString = function () {
    return '(' + this.x + ', ' + this.y + ', ' + this.z + ")";
};

/**
 * 从其他向量复制值
 * @param other {v3}
 */
v3.prototype.copyFrom = function (other) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
};

/**
 * 归一化
 * @return {v3}
 */
v3.prototype.normalize = function () {
    let squareRoot = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    if (squareRoot > 0.00001) {
        this.x = this.x / squareRoot;
        this.y = this.y / squareRoot;
        this.z = this.z / squareRoot;
    }
    return this;
};

/**
 * 减法
 * @param other {v3}
 * @return {v3}
 */
v3.prototype.subtract = function (other) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
};

/**
 * 加法
 * @param other {v3}
 * @return {v3}
 */
v3.prototype.add = function (other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
};

/**
 * 点乘
 * @param other {v3}
 */
v3.prototype.dot = function (other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
};

/**
 * 叉乘
 * @param other {v3}
 * @return {v3}
 */
v3.prototype.cross = function (other) {
    let x = this.y * other.z - this.z * other.y;
    let y = -this.x * other.z + this.z * other.x;
    let z = this.x * other.y - this.y * other.x;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
};

// static

/**
 * 归一化
 * @static
 * @param v {v3}
 * @return {v3}
 */
v3.normalize = function (v) {
    let squareRoot = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    let x = 0;
    let y = 0;
    let z = 0;
    if (squareRoot > 0.00001) {
        x = v.x / squareRoot;
        y = v.y / squareRoot;
        z = v.z / squareRoot;
    }
    return new v3(x, y, z);
}

/**
 * 加法
 * @param a {v3}
 * @param b {v3}
 * @return {v3}
 */
v3.add = function (a, b) {
    return new v3(a.x + b.x, a.y + b.y, a.z + b.z);
}

/**
 * 减法
 * @param a {v3}
 * @param b {v3}
 * @return {v3}
 */
v3.subtract = function (a, b) {
    return new v3(a.x - b.x, a.y - b.y, a.z - b.z);
}

/**
 * 点乘
 * @param a {v3}
 * @param b {v3}
 * @return {number}
 */
v3.dot = function (a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

/**
 * 叉乘
 * @param a {v3}
 * @param b {v3}
 * @return {v3}
 */
v3.cross = function (a, b) {
    let x = a.y * b.z - a.z * b.y;
    let y = -a.x * b.z + a.z * b.x;
    let z = a.x * b.y - a.y * b.x;
    return new v3(x, y, z);
}

if(module)
    module.exports = {v3};
