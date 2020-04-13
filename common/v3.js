/**
 *
 * @constructor
 * @param x {number}
 * @param y {number}
 * @param z {number}
 */
let v3 = function (x, y, z) {
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

