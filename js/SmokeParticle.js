// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/** @constructor */
Flurry.SmokeParticle = function()
{
    'use strict';

    /** @type {Float32Array[]} */
    this.color    = ArrayOf.AltiVecFloat(4);
    /** @type {Float32Array[]} */
    this.pos      = ArrayOf.AltiVecFloat(3);
    /** @type {Float32Array[]} */
    this.oldPos   = ArrayOf.AltiVecFloat(3);
    /** @type {Float32Array[]} */
    this.deltaPos = ArrayOf.AltiVecFloat(3);

    /** @type {Uint32Array} */
    this.dead  = AltiVec.int();
    /** @type {Uint32Array} */
    this.frame = AltiVec.int();
    /** @type {Float32Array} */
    this.time  = AltiVec.float();
};