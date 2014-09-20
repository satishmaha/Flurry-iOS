// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

Flurry.Smoke = function()
{
    /** @type {Flurry.SmokeParticle[]} */
    this.particles = ArrayOf(Flurry.SmokeParticle, MAX_SMOKE / 4);

    this.nextParticle    = 0;
    this.nextSubParticle = 0;

    this.firstTime = 0;
    this.lastTime  = 0;
    this.frame     = 0;

    this.old = new Float32Array(3);

    this.seraphimVertices = ArrayOf.AltiVecFloat(MAX_SMOKE * 2 + 1);
    this.seraphimColors   = ArrayOf.AltiVecFloat(MAX_SMOKE * 4 + 1);
    this.seraphimTextures = new Float32Array(MAX_SMOKE * 2 * 4);

    this.init   = function() { /* TODO Stub */ };
    this.update = function() { /* TODO Stub */ };
    this.draw   = function() { /* TODO Stub */ };
}