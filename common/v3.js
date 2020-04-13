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

v3.prototype.toString = function(){
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
 */
v3.prototype.normalize = function () {
    let squareRoot = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    if (squareRoot > 0.00001) {
        this.x = this.x / squareRoot;
        this.y = this.y / squareRoot;
        this.z = this.z / squareRoot;
    }
};

/**
 * 减法
 * @param other {v3}
 */
v3.prototype.substract = function (other) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
};

/**
 * 加法
 * @param other {v3}
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
 * @param other
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

module.exports = {v3};
