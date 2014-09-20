// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

Flurry.Smoke = function()
{
    'use strict';

    /** @type {Flurry.SmokeParticle[]} */
    this.particles = ArrayOf(Flurry.SmokeParticle, MAX_SMOKE / 4);

    this.nextParticle    = 0;
    this.nextSubParticle = 0;

    this.firstTime = 0;
    this.lastTime  = 0;
    this.frame     = 0;

    this.old = new Vector3();

    this.seraphimVertices = ArrayOf.AltiVecFloat(MAX_SMOKE * 2 + 1);
    this.seraphimColors   = ArrayOf.AltiVecFloat(MAX_SMOKE * 4 + 1);
    this.seraphimTextures = new Float32Array(MAX_SMOKE * 2 * 4);

    this.init   = function()
    {
        'use strict';

        this.nextParticle    = 0;
        this.nextSubParticle = 0;

        this.lastTime  = 0.25;
        this.firstTime = 1;
        this.frame     = 0;

        this.old.x = Math.randFlt(-100, 100);
        this.old.y = Math.randFlt(-100, 100);
        this.old.z = Math.randFlt(-100, 100);
    };

    this.update = function()
    {
        'use strict';

        // Big function; most of this code is a straight port
        const deadVec = new AltiVec.float(25000000.0);
        const zeroVec = new AltiVec.float();
        const biasVec = new AltiVec.float(Flurry.GLSaver.Config.streamBias);

        var state   = Flurry.GLSaver.State,
            config  = Flurry.GLSaver.Config,
            screenW = Flurry.canvas.clientWidth,
            screenH = Flurry.canvas.clientHeight;

        var sX = state.star.pos.x,
            sY = state.star.pos.y,
            sZ = state.star.pos.z,

            frameRateModifier = AltiVec.float(),
            gravityVec        = AltiVec.float(),
            dragVec           = AltiVec.float(),
            deltaTimeVec      = AltiVec.float();

        gravityVec[0] = config.gravity;
    };

    this.draw   = function() { /* TODO Stub */ };
}