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
    })
});
