// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

Flurry.Particle = function()
{
    this.charge = 0.0;
    this.frame  = 0;

    this.pos      = new Vector3();
    this.oldPos   = new Vector3();
    this.deltaPos = new Vector3();
    this.color    = new Color();

    this.init = function()
    {
        var state   = Flurry.GLSaver.state,
            screenW = Flurry.canvas.clientWidth,
            screenH = Flurry.canvas.clientHeight,
            r1 = Math.random() * 35565,
            r2 = Math.random() * 35565;

        this.oldPos.z = Math.randFlt(2500, 22500);
        this.oldPos.x = ((r1 % screenW) - screenW * 0.5) / (screenW / this.oldPos.z);
        this.oldPos.y = (screenH * 0.5 - (r2 % screenH)) / (screenW / this.oldPos.z);

        this.deltaPos.x = 0;
        this.deltaPos.y = 0;
        this.deltaPos.z = -state.starSpeed;

        this.pos.x = this.oldPos.x + this.deltaPos.x;
        this.pos.y = this.oldPos.y + this.deltaPos.y;
        this.pos.z = this.oldPos.z + this.deltaPos.z;

        this.color.r = Math.randFlt(0.125, 1.0);
        this.color.g = Math.randFlt(0.125, 1.0);
        this.color.b = Math.randFlt(0.125, 1.0);
        this.frame   = 0;
    };

    this.update = function()
    {
        this.oldPos.x = this.pos.x;
        this.oldPos.y = this.pos.y;
        this.oldPos.z = this.pos.z;

        this.pos.x += this.deltaPos.x * Flurry.state.deltaTime;
        this.pos.y += this.deltaPos.y * Flurry.state.deltaTime;
        this.pos.z += this.deltaPos.z * Flurry.state.deltaTime;
    };

    /** @returns {*} */
    this.draw = function()
    {
        var state   = Flurry.GLSaver.state,
            screenW = Flurry.canvas.clientWidth,
            screenH = Flurry.canvas.clientHeight,
            screenX = (this.pos.x * screenW / this.pos.z) + screenW * 0.5,
            screenY = (this.pos.y * screenW / this.pos.z) + screenH * 0.5;

        var oldScreenX = (this.oldPos.x * screenW / this.oldPos.z) + screenW * 0.5,
            oldScreenY = (this.oldPos.y * screenW / this.oldPos.z) + screenH * 0.5;

        // Near clip
        if (this.pos.z < 100)
            return this.init();

        // Side clip
        if (screenX > screenW + 100 || screenX < -100)
            return this.init();

        // Vertical clip
        if (screenY > screenH + 100 || screenY < -100)
            return this.init();

        state.starfieldColor[state.starfieldColorIdx++] = this.color.r;
        state.starfieldColor[state.starfieldColorIdx++] = this.color.g;
        state.starfieldColor[state.starfieldColorIdx++] = this.color.b;
        state.starfieldColor[state.starfieldColorIdx++] = 1.0;
        state.starfieldColor[state.starfieldColorIdx++] = this.color.r;
        state.starfieldColor[state.starfieldColorIdx++] = this.color.g;
        state.starfieldColor[state.starfieldColorIdx++] = this.color.b;
        state.starfieldColor[state.starfieldColorIdx++] = 1.0;
        state.starfieldColor[state.starfieldColorIdx++] = this.color.r;
        state.starfieldColor[state.starfieldColorIdx++] = this.color.g;
        state.starfieldColor[state.starfieldColorIdx++] = this.color.b;
        state.starfieldColor[state.starfieldColorIdx++] = 1.0;
        state.starfieldColor[state.starfieldColorIdx++] = this.color.r;
        state.starfieldColor[state.starfieldColorIdx++] = this.color.g;
        state.starfieldColor[state.starfieldColorIdx++] = this.color.b;
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
            w    = Math.max(1.5, size / this.pos.z),
            ow   = Math.max(1.5, size / this.oldPos.z);

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
}