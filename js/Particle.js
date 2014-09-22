// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/** @constructor */
Flurry.Particle = function()
{
    'use strict';

    /** @type {number} */
    this.frame    = 0;
    /** @type {Float32Array} */
    this.pos      = Vector3F();
    /** @type {Float32Array} */
    this.oldPos   = Vector3F();
    /** @type {Float32Array} */
    this.deltaPos = Vector3F();
    /** @type {Float32Array} */
    this.color    = Vector4C();

    this.init = function()
    {
        'use strict';

        var state   = Flurry.GLSaver.State,
            screenW = Flurry.canvas.clientWidth,
            screenH = Flurry.canvas.clientHeight,
            r1 = Math.randClib(),
            r2 = Math.randClib();

        this.oldPos[2] = Math.randFlt(2500, 22500);
        this.oldPos[0] = ((r1 % screenW) - screenW * 0.5) / (screenW / this.oldPos[2]);
        this.oldPos[1] = (screenH * 0.5 - (r2 % screenH)) / (screenW / this.oldPos[2]);

        this.deltaPos[0] = 0;
        this.deltaPos[1] = 0;
        this.deltaPos[2] = -state.starSpeed;

        this.pos[0] = this.oldPos[0] + this.deltaPos[0];
        this.pos[1] = this.oldPos[1] + this.deltaPos[1];
        this.pos[2] = this.oldPos[2] + this.deltaPos[2];

        for (var i = 0; i < 3; i++)
            this.color[i] = Math.randFlt(0.125, 1.0);

        this.frame = 0;
    };

    this.update = function()
    {
        'use strict';

        for (var i = 0; i < 3; i++)
        {
            this.oldPos[i]  = this.pos[i];
            this.pos[i]    += this.deltaPos[i] * Flurry.GLSaver.State.deltaTime;
        }
    };

    this.draw = function()
    {
        'use strict';

        var state   = Flurry.GLSaver.State,
            screenW = Flurry.canvas.clientWidth,
            screenH = Flurry.canvas.clientHeight,
            screenX = (this.pos[0] * screenW / this.pos[2]) + screenW * 0.5,
            screenY = (this.pos[1] * screenW / this.pos[2]) + screenH * 0.5;

        var oldScreenX = (this.oldPos[0] * screenW / this.oldPos[2]) + screenW * 0.5,
            oldScreenY = (this.oldPos[1] * screenW / this.oldPos[2]) + screenH * 0.5;

        // Near clip
        if (this.pos[2] < 100)
            return this.init();

        // Side clip
        if (screenX > screenW + 100 || screenX < -100)
            return this.init();

        // Vertical clip
        if (screenY > screenH + 100 || screenY < -100)
            return this.init();

        state.starfieldColor[state.starfieldColorIdx++] = this.color[0];
        state.starfieldColor[state.starfieldColorIdx++] = this.color[1];
        state.starfieldColor[state.starfieldColorIdx++] = this.color[2];
        state.starfieldColor[state.starfieldColorIdx++] = 1.0;
        state.starfieldColor[state.starfieldColorIdx++] = this.color[0];
        state.starfieldColor[state.starfieldColorIdx++] = this.color[1];
        state.starfieldColor[state.starfieldColorIdx++] = this.color[2];
        state.starfieldColor[state.starfieldColorIdx++] = 1.0;
        state.starfieldColor[state.starfieldColorIdx++] = this.color[0];
        state.starfieldColor[state.starfieldColorIdx++] = this.color[1];
        state.starfieldColor[state.starfieldColorIdx++] = this.color[2];
        state.starfieldColor[state.starfieldColorIdx++] = 1.0;
        state.starfieldColor[state.starfieldColorIdx++] = this.color[0];
        state.starfieldColor[state.starfieldColorIdx++] = this.color[1];
        state.starfieldColor[state.starfieldColorIdx++] = this.color[2];
        state.starfieldColor[state.starfieldColorIdx++] = 1.0;

        this.frame++;
        if (this.frame == 64)
            this.frame = 0;

        var dX   = screenX - oldScreenX,
            dY   = screenY - oldScreenY,
            d    = Math.fastDist2D(dX, dY),
            u0   = (this.frame && 7) * 0.125,
            v0   = (this.frame >> 3) * 0.125,
            u1   = u0 + 0.125,
            v1   = v0 + 0.125,
            size = (3500 * (screenW / 1024)),
            w    = Math.max(1.5, size / this.pos[2]),
            ow   = Math.max(1.5, size / this.oldPos[2]);

        var s  = d ? w  / d : 0.0,
            os = d ? ow / d : 0.0;

        d  = 2.0 + s;

        var dXs  = dX * s,
            dYs  = dY * s,
            dXos = dX * os,
            dYos = dY * os,
            dXm  = dX * d,
            dYm  = dY * d;

        state.starfieldTextures[state.starfieldTexturesIdx++] = u0;
        state.starfieldTextures[state.starfieldTexturesIdx++] = v0;
        state.starfieldVertices[state.starfieldVerticesIdx++] = screenX + dXm - dYs;
        state.starfieldVertices[state.starfieldVerticesIdx++] = screenY + dYm + dXs;

        state.starfieldTextures[state.starfieldTexturesIdx++] = u0;
        state.starfieldTextures[state.starfieldTexturesIdx++] = v1;
        state.starfieldVertices[state.starfieldVerticesIdx++] = screenX + dXm + dYs;
        state.starfieldVertices[state.starfieldVerticesIdx++] = screenY + dYm - dXs;

        state.starfieldTextures[state.starfieldTexturesIdx++] = u1;
        state.starfieldTextures[state.starfieldTexturesIdx++] = v1;
        state.starfieldVertices[state.starfieldVerticesIdx++] = oldScreenX - dXm + dYos;
        state.starfieldVertices[state.starfieldVerticesIdx++] = oldScreenY - dYm - dXos;

        state.starfieldTextures[state.starfieldTexturesIdx++] = u1;
        state.starfieldTextures[state.starfieldTexturesIdx++] = v0;
        state.starfieldVertices[state.starfieldVerticesIdx++] = oldScreenX - dXm - dYos;
        state.starfieldVertices[state.starfieldVerticesIdx++] = oldScreenY - dYm + dXos;
    }
};