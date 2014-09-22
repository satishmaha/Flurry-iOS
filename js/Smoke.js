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

    /** @type {Float32Array} */
    this.oldPos    = new Vector3F();
    /** @type {boolean} */
    this.firstTime = false;
    /** @type {number} */
    this.frame     = 0;

    /** @type {Float32Array[]} */
    this.seraphimVertices = ArrayOf.Vector4F(MAX_SMOKE * 2 + 1);
    /** @type {Float32Array[]} */
    this.seraphimColors   = ArrayOf.Vector4F(MAX_SMOKE * 4 + 1);
    /** @type {Float32Array} */
    this.seraphimTextures = new Float32Array(MAX_SMOKE * 2 * 4);

    this.update = function()
    {
        'use strict';

        var state   = Flurry.GLSaver.State,
            config  = Flurry.GLSaver.Config,
            starPos = Vector3F(state.star.pos);

        this.frame++;

        if (this.firstTime)
        {
            this.firstTime        = false;
            this.lastParticleTime = state.time;
        }
        else if (state.time - this.lastParticleTime >= 1 / 121)
        {
            var dx = this.oldPos[0] - starPos[0],
                dy = this.oldPos[1] - starPos[1],
                dz = this.oldPos[2] - starPos[2],
                deltaPos = new Float32Array([dx * 5, dy * 5, dz * 5]);

            for (var i = 0; i < state.numStreams; i++)
            {
                this.particles[this.nextParticle].deltaPos[0][this.nextSubParticle] = deltaPos[0];
                this.particles[this.nextParticle].deltaPos[1][this.nextSubParticle] = deltaPos[1];
                this.particles[this.nextParticle].deltaPos[2][this.nextSubParticle] = deltaPos[2];
                this.particles[this.nextParticle].pos[0][this.nextSubParticle]      = starPos[0];
                this.particles[this.nextParticle].pos[1][this.nextSubParticle]      = starPos[1];
                this.particles[this.nextParticle].pos[2][this.nextSubParticle]      = starPos[2];
                this.particles[this.nextParticle].oldPos[0][this.nextSubParticle]   = starPos[0];
                this.particles[this.nextParticle].oldPos[1][this.nextSubParticle]   = starPos[1];
                this.particles[this.nextParticle].oldPos[2][this.nextSubParticle]   = starPos[2];

                var streamSpeedCoherenceFactor = Math.max( 0, 1 + Math.randBell(0.25*config.incohesion) ),
                    dX  = this.particles[this.nextParticle].pos[0][this.nextSubParticle] - state.spark[i].pos[0],
                    dY  = this.particles[this.nextParticle].pos[1][this.nextSubParticle] - state.spark[i].pos[1],
                    dZ  = this.particles[this.nextParticle].pos[2][this.nextSubParticle] - state.spark[i].pos[2],
                    rsq = (dX*dX+dY*dY+dZ*dZ),
                    f   = config.streamSpeed * streamSpeedCoherenceFactor,
                    mag = f / Math.sqrt(rsq);

                this.particles[this.nextParticle].deltaPos[0][this.nextSubParticle] -= (dX * mag);
                this.particles[this.nextParticle].deltaPos[1][this.nextSubParticle] -= (dY * mag);
                this.particles[this.nextParticle].deltaPos[2][this.nextSubParticle] -= (dZ * mag);
                this.particles[this.nextParticle].color[0][this.nextSubParticle] = state.spark[i].color[0] * (1 + Math.randBell(config.colorIncoherence));
                this.particles[this.nextParticle].color[1][this.nextSubParticle] = state.spark[i].color[1] * (1 + Math.randBell(config.colorIncoherence));
                this.particles[this.nextParticle].color[2][this.nextSubParticle] = state.spark[i].color[2] * (1 + Math.randBell(config.colorIncoherence));
                this.particles[this.nextParticle].color[3][this.nextSubParticle] = 0.85 * (1.0 + Math.randBell(0.5 * config.colorIncoherence));
                this.particles[this.nextParticle].time[this.nextSubParticle]  = state.time;
                this.particles[this.nextParticle].dead[this.nextSubParticle]  = 0;
                this.particles[this.nextParticle].frame[this.nextSubParticle] = (Math.randClib()) & 63;
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

        this.oldPos = Vector3F(state.star.pos);

        var frameRate         = state.frame / state.time,
            frameRateModifier = 42.5 / frameRate;

        for (i = 0; i < MAX_SMOKE / 4; i++)
        for (var k = 0; k < 4; k++)
        {
            if (this.particles[i].dead[k] == 1)
                continue;

            var deltaX = this.particles[i].deltaPos[0][k],
                deltaY = this.particles[i].deltaPos[1][k],
                deltaZ = this.particles[i].deltaPos[2][k];

            for (var j = 0; j < state.numStreams; j++)
            {
                dX  = this.particles[i].pos[0][k] - state.spark[j].pos[0];
                dY  = this.particles[i].pos[1][k] - state.spark[j].pos[1];
                dZ  = this.particles[i].pos[2][k] - state.spark[j].pos[2];
                rsq = (dX*dX+dY*dY+dZ*dZ);
                f   = (config.gravity / rsq) * frameRateModifier;

                if ( (((i*4)+k) % state.numStreams) == j )
                    f *= 1 + config.streamBias;

                mag = f / Math.sqrt(rsq);

                deltaX -= (dX * mag);
                deltaY -= (dY * mag);
                deltaZ -= (dZ * mag);
            }

            deltaX *= state.drag;
            deltaY *= state.drag;
            deltaZ *= state.drag;

            if( (deltaX*deltaX+deltaY*deltaY+deltaZ*deltaZ) >= 25000000 )
            {
                this.particles[i].dead[k] = 1;
                continue;
            }

            this.particles[i].deltaPos[0][k] = deltaX;
            this.particles[i].deltaPos[1][k] = deltaY;
            this.particles[i].deltaPos[2][k] = deltaZ;

            for (j = 0; j < 3; j++)
            {
                this.particles[i].oldPos[j][k] = this.particles[i].pos[j][k];
                this.particles[i].pos[j][k] += (this.particles[i].deltaPos[j][k]) * state.deltaTime;
            }
        }
    };

    this.draw = function()
    {
        'use strict';

        var svi = 0,
            sci = 0,
            sti = 0,
            si  = 0,

            state   = Flurry.GLSaver.State,
            config  = Flurry.GLSaver.Config,
            screenW = Flurry.canvas.clientWidth,
            screenH = Flurry.canvas.clientHeight,

            screenRatio = screenW / 1024,
            wslash2     = screenW * 0.5,
            hslash2     = screenH * 0.5,
            width       = (state.streamSize + 2.5 * state.streamExpansion) * screenRatio;

        for (var i = 0; i < MAX_SMOKE / 4; i++)
        for (var k = 0; k < 4; k++)
        {
            if (this.particles[i].dead[k] == 1)
                continue;

            var thisWidth = (config.streamSize + (state.time - this.particles[i].time[k]) * state.streamExpansion) * screenRatio;

            if (thisWidth >= width)
            {
                this.particles[i].dead[k] = 1;
                continue;
            }

            var z    = this.particles[i].pos[2][k],
                sx   = this.particles[i].pos[0][k] * screenW / z + wslash2,
                sy   = this.particles[i].pos[1][k] * screenW / z + hslash2,
                oldz = this.particles[i].oldPos[2][k];

            if (sx > screenW + 50 || sx < -50 || sy > screenH + 50 || sy < -50 || z < 25 || oldz < 25.)
                continue;

            var w    = Math.max(1, thisWidth / z),
                oldx = this.particles[i].oldPos[0][k],
                oldy = this.particles[i].oldPos[1][k],

                oldscreenx = (oldx * screenW / oldz) + wslash2,
                oldscreeny = (oldy * screenW / oldz) + hslash2,
                dx = (sx - oldscreenx),
                dy = (sy - oldscreeny),
                d  = Math.fastDist2D(dx, dy),
                sm = d ? w / d : 0.0,
                ow = Math.max(1, thisWidth/oldz),
                os = d ? ow / d : 0.0;

            var cmv = Vector4F(),
                m    = 1 + sm,
                dxs  = dx * sm,
                dys  = dy * sm,
                dxos = dx * os,
                dyos = dy * os,
                dxm  = dx * m,
                dym  = dy * m;

            this.particles[i].frame[k]++;

            if (this.particles[i].frame[k] >= 64)
                this.particles[i].frame[k] = 0;

            var u0 = (this.particles[i].frame[k] && 7) * 0.125,
                v0 = (this.particles[i].frame[k] >> 3) * 0.125,
                u1 = u0 + 0.25,
                v1 = v0 + 0.25,
                cm = (1.375 - thisWidth / width);

            if (this.particles[i].dead[k] == 3)
            {
                cm *= 0.125;
                this.particles[i].dead[k] = 1;
            }

            si++;
            cmv[0] = this.particles[i].color[0][k] * cm;
            cmv[1] = this.particles[i].color[1][k] * cm;
            cmv[2] = this.particles[i].color[2][k] * cm;
            cmv[3] = this.particles[i].color[3][k] * cm;

            this.seraphimColors[sci++] = cmv;
            this.seraphimColors[sci++] = cmv;
            this.seraphimColors[sci++] = cmv;
            this.seraphimColors[sci++] = cmv;

            this.seraphimTextures[sti++] = u0;
            this.seraphimTextures[sti++] = v0;
            this.seraphimTextures[sti++] = u0;
            this.seraphimTextures[sti++] = v1;

            this.seraphimTextures[sti++] = u1;
            this.seraphimTextures[sti++] = v1;
            this.seraphimTextures[sti++] = u1;
            this.seraphimTextures[sti++] = v0;

            this.seraphimVertices[svi][0] = sx + dxm - dys;
            this.seraphimVertices[svi][1] = sy + dym + dxs;
            this.seraphimVertices[svi][2] = sx + dxm + dys;
            this.seraphimVertices[svi][3] = sy + dym - dxs;
            svi++;

            this.seraphimVertices[svi][0] = oldscreenx - dxm + dyos;
            this.seraphimVertices[svi][1] = oldscreeny - dym - dxos;
            this.seraphimVertices[svi][2] = oldscreenx - dxm - dyos;
            this.seraphimVertices[svi][3] = oldscreeny - dym + dxos;
            svi++;
        }

        // TODO: Figure out GL code

        Flurry.webgl.drawArrays(WebGLRenderingContext.TRIANGLE_STRIP, 0, si * 4);
    };
};