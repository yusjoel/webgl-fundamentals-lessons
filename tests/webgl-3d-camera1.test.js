//import {m4} from '3d/webgl-3d-camera/webgl-3d-camera1'
let { m4 } = require('../3d/webgl-3d-camera/webgl-3d-camera1.js');

var assert = require('assert');
describe('m4', function() {
    describe('#minor()', function() {
        var m = m4.transpose([
            1, 2, 3, 4,
            5, 6, 7, 8,
            9, 10, 11, 12,
            13, 14, 15, 16
        ]);

        it('minor(m, 0, 0)', function() {
            assert.deepStrictEqual(
                m4.minor(m, 0, 0),
                [
                    6, 10, 14,
                    7, 11, 15,
                    8, 12, 16
                ]
            );
        });
        it('minor(m, 3, 0)', function() {
            assert.deepStrictEqual(
                m4.minor(m, 3, 0),
                [
                    2, 6, 10,
                    3, 7, 11,
                    4, 8, 12
                ]
            );
        });
        it('minor(m, 0, 3)', function() {
            assert.deepStrictEqual(
                m4.minor(m, 0, 3),
                [
                    5, 9, 13,
                    6, 10, 14,
                    7, 11, 15
                ]
            );
        });
        it('minor(m, 2, 2)', function() {
            assert.deepStrictEqual(
                m4.minor(m, 2, 2),
                [
                    1, 5, 13,
                    2, 6, 14,
                    4, 8, 16
                ]
            );
        });
    });

    describe('#determinant', function () {
        it('test', function () {
            let m3x3 = [
                3, 1, -1,
                -2, 4, 0,
                0, -3, 2
            ];
            assert.equal(m4.determinant(m3x3), 22);
        });
    });

    describe('#inverse', function () {
        it('identity', function () {
            let m = m4.transpose([
               1, 0, 0, 0,
               0, 1, 0, 0,
               0, 0, 1, 0,
               0, 0, 0, 1
            ]);
            assert.deepStrictEqual(m4.inverse(m), m);
        });
    });
});
