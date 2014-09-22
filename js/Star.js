// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/** @constructor */
Flurry.Star = function()
{
    'use strict';

    /** @type {Float32Array} */
    this.pos      = Vector3F();
    /** @type {number} */
    this.mystery  = 0.0;
    /** @type {number} */
    this.rotSpeed = 0.0;
    /** @type {boolean} */
    this.ate      = false;

    this.update = function()
    {
        'use strict';

        var state         = Flurry.GLSaver.State,
            rotsPerSecond = (2*Math.PI*12/MAX_ANGLES) * this.rotSpeed,
            thisAngle     = state.time * rotsPerSecond;

        this.ate = false;

        var cf = Math.cos(7 * thisAngle) + Math.cos(3 * thisAngle) + Math.cos(13 * thisAngle);

        cf /= 6;
        cf += 0.75;

        var thisPointInRads = 2.0 * Math.PI * this.mystery / BIG_MYSTERY;

        this.pos[0] = 250 * cf * Math.cos(11 * (thisPointInRads + (3 * thisAngle)));
        this.pos[1] = 250 * cf * Math.sin(12 * (thisPointInRads + (4 * thisAngle)));
        this.pos[2] = 250 * Math.cos(23 * (thisPointInRads + (4 * thisAngle)));

        var rot = thisAngle * 0.501 + 5.01 * this.mystery / BIG_MYSTERY,
            cr  = Math.cos(rot),
            sr  = Math.sin(rot),

            tmpX1 = this.pos[0] * cr - this.pos[1] * sr,
            tmpY1 = this.pos[1] * cr + this.pos[0] * sr,
            tmpZ1 = this.pos[2],
            tmpX2 = tmpX1 * cr - tmpZ1 * sr,
            // tmpY2 = tmpY1,
            tmpZ2 = tmpZ1 * cr + tmpX1 * sr,
            // tmpX3 = tmpX2,
            tmpY3 = tmpY1 * cr - tmpZ2 * sr,
            tmpZ3 = tmpZ2 * cr + tmpY1 * sr + state.seraphDistance;

        rot = thisAngle * 2.501 + 85.01 * this.mystery / BIG_MYSTERY;
        cr  = Math.cos(rot);
        sr  = Math.sin(rot);

        this.pos[0] = tmpX2 * cr - tmpY3 * sr;
        this.pos[1] = tmpY3 * cr + tmpX2 * sr;
        this.pos[2] = tmpZ3;
    };
};