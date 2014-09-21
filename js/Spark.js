// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/** @constructor */
Flurry.Spark = function()
{
    'use strict';

    /** @type {Float32Array} */
    this.pos      = Vector3F();
    /** @type {Float32Array} */
    this.deltaPos = Vector3F();
    /** @type {Float32Array} */
    this.color    = Vector4F();
    /** @type {number} */
    this.mystery  = 0;

    this.init = function()
    {
        'use strict';

    };

    this.update = function() { /* TODO stub */ };
    this.updateColor = function() { /* TODO stub */ };
    this.draw = function() { /* TODO stub */ }
};
