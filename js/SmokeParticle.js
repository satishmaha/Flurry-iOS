// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

Flurry.SmokeParticle = function()
{
    'use strict';

    this.color    = ArrayOf.AltiVecFloat(4);
    this.pos      = ArrayOf.AltiVecFloat(3);
    this.oldPos   = ArrayOf.AltiVecFloat(3);
    this.deltaPos = ArrayOf.AltiVecFloat(3);

    this.dead  = AltiVec.int();
    this.frame = AltiVec.int();
    this.time  = AltiVec.float();
}