// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

Flurry.Smoke = function()
{
    'use strict';

    /** @type {Flurry.SmokeParticle[]} */
    this.particles = ArrayOf(Flurry.SmokeParticle, MAX_SMOKE / 4); // p

    /** @type {number} */
    this.nextParticle     = 0;
    /** @type {number} */
    this.nextSubParticle  = 0;
    /** @type {number} */
    this.lastParticleTime = 0;

    /** @type {Vector3} */
    this.oldPos    = new Vector3();
    /** @type {boolean} */
    this.firstTime = false;
    /** @type {number} */
    this.frame     = 0;

    /** @type {Float32Array[]} */
    this.seraphimVertices = ArrayOf.AltiVecFloat(MAX_SMOKE * 2 + 1);
    /** @type {Float32Array[]} */
    this.seraphimColors   = ArrayOf.AltiVecFloat(MAX_SMOKE * 4 + 1);
    /** @type {Float32Array} */
    this.seraphimTextures = new Float32Array(MAX_SMOKE * 2 * 4);

    this.init = function()
    {
        'use strict';

        this.nextParticle    = 0;
        this.nextSubParticle = 0;

        this.lastParticleTime  = 0.25;
        this.firstTime = true;
        this.frame     = 0;

        this.oldPos.x = Math.randFlt(-100, 100);
        this.oldPos.y = Math.randFlt(-100, 100);
        this.oldPos.z = Math.randFlt(-100, 100);
    };

    this.update = function()
    {
        'use strict';

        // Big function; most of this code is a straight port
        const deadVec = AltiVec.float(25000000.0);
        const zeroVec = AltiVec.float();
        const biasVec = AltiVec.float(Flurry.GLSaver.Config.streamBias);

        var state   = Flurry.GLSaver.State,
            config  = Flurry.GLSaver.Config,
            screenW = Flurry.canvas.clientWidth,
            screenH = Flurry.canvas.clientHeight,
            pos     = state.star.pos.makeCopy(),

            frameRateModifier = AltiVec.float(),
            gravityVec        = AltiVec.float( AltiVec.int(config.gravity) ),// TODO: Safe to simplify?
            dragVec           = AltiVec.float( AltiVec.int(config.drag) ),
            deltaTimeVec      = AltiVec.float( AltiVec.int(config.deltaTime) );

        this.frame++;

        if (this.firstTime)
        {
            this.firstTime        = false;
            this.lastParticleTime = state.time;
        }
        else if (state.time - this.lastParticleTime >= 1 / 121)
        {
            var deltaPos = pos.delta(this.oldPos, 5);

            for (var i = 0; i < state.numStreams; i++)
            {
                this.particles[this.nextParticle].deltaPos[0][this.nextSubParticle] = deltaPos.x;
                this.particles[this.nextParticle].deltaPos[1][this.nextSubParticle] = deltaPos.y;
                this.particles[this.nextParticle].deltaPos[2][this.nextSubParticle] = deltaPos.z;
                this.particles[this.nextParticle].pos[0][this.nextSubParticle] = pos.x;
                this.particles[this.nextParticle].pos[1][this.nextSubParticle] = pos.y;
                this.particles[this.nextParticle].pos[2][this.nextSubParticle] = pos.z;
                this.particles[this.nextParticle].oldPos[0][this.nextSubParticle] = pos.x;
                this.particles[this.nextParticle].oldPos[1][this.nextSubParticle] = pos.y;
                this.particles[this.nextParticle].oldPos[2][this.nextSubParticle] = pos.z;

                var streamSpeedCoherenceFactor = Math.max( 0, 1 + Math.randBell(0.25*config.incohesion)),
                    dx  = this.particles[this.nextParticle].position[0][this.nextSubParticle] - state.spark[i].pos.x,
                    dy  = this.particles[this.nextParticle].position[1][this.nextSubParticle] - state.spark[i].pos.y,
                    dz  = this.particles[this.nextParticle].position[2][this.nextSubParticle] - state.spark[i].pos.z,
                    rsq = (dx*dx+dy*dy+dz*dz),
                    f   = config.streamSpeed * streamSpeedCoherenceFactor,
                    mag = Math.frsqrte(rsq);

                mag *= f;

                this.particles[this.nextParticle].deltaPos[0][this.nextSubParticle] -= (dx * mag);
                this.particles[this.nextParticle].deltaPos[1][this.nextSubParticle] -= (dy * mag);
                this.particles[this.nextParticle].deltaPos[2][this.nextSubParticle] -= (dz * mag);
                this.particles[this.nextParticle].color[0][this.nextSubParticle] = state.spark[i].color.r * (1 + Math.randBell(config.colorIncoherence));
                this.particles[this.nextParticle].color[1][this.nextSubParticle] = state.spark[i].color.g * (1 + Math.randBell(config.colorIncoherence));
                this.particles[this.nextParticle].color[2][this.nextSubParticle] = state.spark[i].color.b * (1 + Math.randBell(config.colorIncoherence));
                this.particles[this.nextParticle].color[3][this.nextSubParticle] = 0.85 * (1.0 + Math.randBell(0.5 * config.colorIncoherence));
                this.particles[this.nextParticle].time[this.nextSubParticle] = state.time;
                this.particles[this.nextParticle].dead[this.nextSubParticle] = 0;
                this.particles[this.nextParticle].frame[this.nextSubParticle] = (Math.random() * 35565) & 63;
                this.nextSubParticle++;

                if (this.nextSubParticle == 4)
                {
                    this.nextSubParticle = 0;
                    this.nextParticle++;
                }

                if (this.nextParticle >= MAX_SMOKE / 4)
                {
                    this.nextParticle    = 0;
                    this.nextSubParticle = 0;
                }
            }

            this.lastParticleTime = state.time;
        }

        this.oldPos = state.star.pos.makeCopy();

        var frameRate = state.frame / state.time;
        frameRateModifier = AltiVec.float( AltiVec.int(42.5 / frameRate) );
        frameRateModifier = AltiVec.madd(frameRateModifier, gravityVec, zeroVec);

        for (i = 0; i < MAX_SMOKE / 4; i++)
        {
            var intOne   = AltiVec.int(1);
            var floatOne = AltiVec.ctf(intOne, 0);
        }
    };

    this.draw = function() { /* TODO Stub */ };
};