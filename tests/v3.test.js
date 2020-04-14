let {v3} = require('../common/v3.js');
let assert = require('assert');
const {describe, it} = require("mocha");

describe('v3', function () {
    describe('#ctor()', function () {
        it('v3()', function () {
            let v1 = new v3();
            assert.equal(v1.toString(), '(0, 0, 0)');
        });
        it('v3(1, 2, 3)', function () {
            let v1 = new v3(1, 2, 3);
            assert.equal(v1.toString(), '(1, 2, 3)');
        });
    });
    describe('copyFrom', function () {
        it('copyFrom', function () {
            let v1 = new v3(1, 2, 3);
            let v2 = new v3(3, 1, 2);
            v2.copyFrom(v1);
            assert.equal(v2.toString(), '(1, 2, 3)');
        })
    });
    describe('normalize', function () {
        it('normalize(3, 4, 0)', function () {
            let v = new v3(3, 4, 0);
            v.normalize();
            assert.equal(v.toString(), '(0.6, 0.8, 0)');
        });
        it('normalize(0, 0, 0', function () {
            let v = new v3();
            v.normalize();
            assert.equal(v.toString(), '(0, 0, 0)');
        });
    });
    describe('subtract', function () {
        it('subtract', function () {
            let v1 = new v3(4, 5, 6);
            let v2 = new v3(1, 2, 3);
            v2.subtract(v1);
            assert.equal(v2.toString(), '(-3, -3, -3)');
        });
    });
    describe('add', function () {
        it('add', function () {
            let v1 = new v3(-1, 1, 2);
            let v2 = new v3(-2, -4, 1);
            v2.add(v1);
            assert.equal(v2.toString(), '(-3, -3, 3)');
        });
    });
    describe('dot', function () {
        it('dot1', function () {
            let v1 = new v3(1, 0, 0);
            let v2 = new v3(1, 1, 0);
            let cos = v1.dot(v2);
            // cos 45 = 1
            assert.equal(cos, 1);
        });
        it('dot2', function () {
            let v1 = new v3(1, 0, 0);
            let v2 = new v3(1, -1, 0);
            let cos = v1.dot(v2);
            // cos -45 = 1
            assert.equal(cos, 1);
        });
        it('dot3', function () {
            let v1 = new v3(1, 0, 0);
            let v2 = new v3(-1, 1, 0);
            let cos = v1.dot(v2);
            // cos 135 = -1
            assert.equal(cos, -1);
        });
        it('dot4', function () {
            // 3D Math Primer for Graphics and Game Development $5.10.1
            let v1 = new v3(3, -2, 7);
            let v2 = new v3(0, 4, -1);
            let cos = v1.dot(v2);
            assert.equal(cos, -15);
        });
    });
    describe('cross', function () {
        it('cross1', function () {
            let xAxis = new v3(1, 0, 0);
            let yAxis = new v3(0, 1, 0);
            xAxis.cross(yAxis);
            assert.equal(xAxis.toString(), '(0, 0, 1)');
        });
        it('cross3', function () {
            // 3D Math Primer for Graphics and Game Development (2nd Edition) $2.12.1
            let v1 = new v3(1, 3, 4);
            let v2 = new v3(2, -5, 8);
            v1.cross(v2);
            assert.equal(v1.toString(), '(44, 0, -11)');
        });
    });
    describe('chain', function () {
        it('chain', function () {
            let v = new v3();
            v.add(new v3(3, 4, 5)).subtract(new v3(3, 1, 1)).normalize();
            assert.equal(v.toString(), '(0, 0.6, 0.8)');
        });
    })
});
