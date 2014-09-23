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

    this.init = function()
    {
        'use strict';

        this.nextParticle     = 0;
        this.nextSubParticle  = 0;
        this.lastParticleTime = 0.25;

        this.firstTime = true;
        this.frame     = 0;

        for (var i = 0; i < 3; i++)
            this.oldPos[i] = Math.randFlt(-100, 100);

        for (i = 0; i < MAX_SMOKE / 4; i++)
            this.particles[i].init();
    };

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

            for (var i = 0; i < config.numStreams; i++)
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

            for (var j = 0; j < config.numStreams; j++)
            {
                dX  = this.particles[i].pos[0][k] - state.spark[j].pos[0];
                dY  = this.particles[i].pos[1][k] - state.spark[j].pos[1];
                dZ  = this.particles[i].pos[2][k] - state.spark[j].pos[2];
                rsq = (dX*dX+dY*dY+dZ*dZ);
                f   = (config.gravity / rsq) * frameRateModifier;

                if ( (((i*4)+k) % config.numStreams) == j )
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

        var particle, quad,
            si      = 0,
            state   = Flurry.GLSaver.State,
            config  = Flurry.GLSaver.Config,
            screenW = Flurry.renderer.domElement.clientWidth,
            screenH = Flurry.renderer.domElement.clientHeight,

            screenRatio = screenW / 1024,
            wslash2     = screenW * 0.5,
            hslash2     = screenH * 0.5,
            width       = (config.streamSize + 2.5 * config.streamExpansion) * screenRatio;

        for (var i = 0; i < MAX_SMOKE / 4; i++) // Per... group of four quads?
        {
            particle = this.particles[i];

            for (var k = 0; k < 4; k++)             // Per quad
            {
                quad = particle.quads[k];
                quad.visible = false;

                if (this.particles[i].dead[k] == 1)
                    continue;

                var thisWidth = (config.streamSize + (state.time - this.particles[i].time[k]) * config.streamExpansion) * screenRatio;

                if (thisWidth >= width)
                {
                    this.particles[i].dead[k] = 1;
                    continue;
                }

                // Each particle is keeping positions of four quads ?
                var z = this.particles[i].pos[2][k],
                    sx = this.particles[i].pos[0][k] * screenW / z + wslash2,
                    sy = this.particles[i].pos[1][k] * screenW / z + hslash2,
                    oldz = this.particles[i].oldPos[2][k];

                if (sx > screenW + 50 || sx < -50 || sy > screenH + 50 || sy < -50 || z < 25 || oldz < 25.)
                    continue;

                var w = Math.max(1, thisWidth / z),
                    oldx = this.particles[i].oldPos[0][k],
                    oldy = this.particles[i].oldPos[1][k],

                    oldscreenx = (oldx * screenW / oldz) + wslash2,
                    oldscreeny = (oldy * screenW / oldz) + hslash2,
                    dx = (sx - oldscreenx),
                    dy = (sy - oldscreeny),
                    d = Math.fastDist2D(dx, dy),
                    sm = d ? w / d : 0.0,
                    ow = Math.max(1, thisWidth / oldz),
                    os = d ? ow / d : 0.0;

                var cmv = Vector4F(),
                    m = 1 + sm,
                    dxs = dx * sm,
                    dys = dy * sm,
                    dxos = dx * os,
                    dyos = dy * os,
                    dxm = dx * m,
                    dym = dy * m;

                this.particles[i].frame[k]++;

                if (this.particles[i].frame[k] >= 64)
                    this.particles[i].frame[k] = 0;

                var u0 = (this.particles[i].frame[k] && 7) * 0.125,
                    v0 = (this.particles[i].frame[k] >> 3) * 0.125,
                    u1 = u0 + 0.125,
                    v1 = v0 + 0.125,
                    cm = (1.375 - thisWidth / width) * config.brightness;

                quad.visible = true;
                cmv[0] = this.particles[i].color[0][k] * cm;
                cmv[1] = this.particles[i].color[1][k] * cm;
                cmv[2] = this.particles[i].color[2][k] * cm;
                cmv[3] = this.particles[i].color[3][k] * cm;

                quad.geometry.faces[0].color.setRGB(cmv[0], cmv[1], cmv[2]);
                quad.geometry.faces[1].color.setRGB(cmv[0], cmv[1], cmv[2]);
                quad.material.opacity = cmv[3];
                quad.geometry.colorsNeedUpdate = true;

                // First index: layer (always 0)
                // Second index: face (0 or 1)
                // Third index: vertex (0, 1 or 2)
                quad.geometry.faceVertexUvs[0][0][0].set(u0, v0);
                quad.geometry.faceVertexUvs[0][0][1].set(u0, v1);
                quad.geometry.faceVertexUvs[0][0][2].set(u1, v0);
                quad.geometry.faceVertexUvs[0][1][0].set(u0, v1);
                quad.geometry.faceVertexUvs[0][1][1].set(u1, v1);
                quad.geometry.faceVertexUvs[0][1][2].set(u1, v0);
                quad.geometry.uvsNeedUpdate = true;

                // Each seraphimVertices vector held the XY of two points in a quad
                quad.geometry.vertices[0].x = sx + dxm - dys;
                quad.geometry.vertices[0].y = sy + dym + dxs;
                quad.geometry.vertices[1].x = sx + dxm + dys;
                quad.geometry.vertices[1].y = sy + dym - dxs;
                quad.geometry.vertices[2].x = oldscreenx - dxm - dyos;
                quad.geometry.vertices[2].y = oldscreeny - dym + dxos;
                quad.geometry.vertices[3].x = oldscreenx - dxm + dyos;
                quad.geometry.vertices[3].y = oldscreeny - dym - dxos;
                quad.geometry.verticesNeedUpdate = true;
                si++;
            }
        }
    };
};