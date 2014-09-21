// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/** @constructor */
Flurry.SmokeParticle = function()
{
    'use strict';

    /** @type {Float32Array[]} */
    this.color    = ArrayOf.Vector4F(4);
    /** @type {Float32Array[]} */
    this.pos      = ArrayOf.Vector4F(3);
    /** @type {Float32Array[]} */
    this.oldPos   = ArrayOf.Vector4F(3);
    /** @type {Float32Array[]} */
    this.deltaPos = ArrayOf.Vector4F(3);

    /** @type {Uint32Array} */
    this.dead  = Vector4I();
    /** @type {Uint32Array} */
    this.frame = Vector4I();
    /** @type {Float32Array} */
    this.time  = Vector4F();
};