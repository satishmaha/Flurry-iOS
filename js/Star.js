// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

Flurry.Star = function()
{
    const BIG_MYSTERY = 1800;

    this.pos      = new Vector3();
    this.mystery  = 0.0;
    this.rotSpeed = 0.0;
    this.ate      = false;

    this.init = function()
    {
        this.pos.x = Math.randFlt(-10000, 10000);
        this.pos.y = Math.randFlt(-10000, 10000);
        this.pos.z = Math.randFlt(-10000, 10000);

        this.rotSpeed = Math.randFlt(0.4, 0.9);
        this.mystery  = Math.randFlt(0.0, 10.0);
    };

    this.update = function()
    {
        var state         = Flurry.GLSaver.state,
            rotsPerSecond = (2*Math.PI*12/MAX_ANGLES) * this.rotSpeed,
            thisAngle     = state.time * rotsPerSecond;

        this.ate = false;

        var cf = Math.cos(7 * thisAngle) + Math.cos(3 * thisAngle) + Math.cos(13 * thisAngle);

        cf /= 6;
        cf += 0.75;

        var thisPointInRads = 2.0 * Math.PI * this.mystery / BIG_MYSTERY;

        this.pos.x = 250 * cf * Math.cos(11 * (thisPointInRads + (3 * thisAngle)));
        this.pos.y = 250 * cf * Math.sin(12 * (thisPointInRads + (4 * thisAngle)));
        this.pos.z = 250 * Math.cos(23 * (thisPointInRads + (4 * thisAngle)));

        var rot = thisAngle * 0.501 + 5.01 * this.mystery / BIG_MYSTERY,
            cr  = Math.cos(rot),
            sr  = Math.sin(rot),

            tmpX1 = this.pos.x * cr - this.pos.y * sr,
            tmpY1 = this.pos.y * cr + this.pos.x * sr,
            tmpZ1 = this.pos.z,
            tmpX2 = tmpX1 * cr - tmpZ1 * sr,
            // tmpY2 = tmpY1,
            tmpZ2 = tmpZ1 * cr + tmpX1 * sr,
            // tmpX3 = tmpX2,
            tmpY3 = tmpY1 * cr - tmpZ2 * sr,
            tmpZ3 = tmpZ2 * cr + tmpY1 * sr + state.seraphDistance;

        rot = thisAngle * 2.501 + 85.01 * this.mystery / BIG_MYSTERY;
        cr  = Math.cos(rot);
        sr  = Math.sin(rot);

        this.pos.x = tmpX2 * cr - tmpY3 * sr;
        this.pos.y = tmpY3 * cr + tmpX2 * sr;
        this.pos.z = tmpZ3;
    };

    this.draw = function()
    {
        var gl      = Flurry.webgl,
            screenW = Flurry.canvas.clientWidth,
            screenH = Flurry.canvas.clientHeight,
            c       = 0.08;

        if (!this.ate)
            return;

        var width   = 50000 * screenW / 1024,
            z       = this.pos.z,
            w       = width * 4 / z,
            screenX = this.pos.x * screenW / z + screenW * 0.5,
            screenY = this.pos.y * screenW / z + screenH * 0.5;

        // TODO: Continue GL code here using shader uniform
    };
}