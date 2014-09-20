// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

Flurry.GLSaver = {};

function _scope()
{
    var GLSaver = Flurry.GLSaver;

    var timeCounter = 0;

    /**
     * @enum
     */
    GLSaver.ColorModes = {
        red        : 0,
        magenta    : 1,
        blue       : 2,
        cyan       : 3,
        green      : 4,
        yellow     : 5,
        slowCyclic : 6,
        cyclic     : 7,
        tiedye     : 8,
        rainbow    : 9,
        white      : 10,
        multi      : 11,
        dark       : 12
    };

    GLSaver.state = {
        /** @type {Flurry.Particle[]} */
        particles : ArrayOf(Flurry.Particle, MAX_PARTICLES),
        /** @type {Flurry.Spark[]} */
        spark     : ArrayOf(Flurry.Spark, 64),
        smoke     : null,
        star      : null,

        flurryRandomSeed : 0,
        currentColorMode : GLSaver.ColorModes.cyclic,
        colorIncoherence : 0.15,

        time      : 0,
        oldTime   : 0,
        deltaTime : 0,
        frame     : 0,

        streamExpansion : 0.0,
        numStreams      : 0,

        gravity        : 1500000.0,
        drag           : 0.0,
        incohesion     : 0.07,
        streamSpeed    : 450.0,
        fieldCoherence : 0,
        fieldSpeed     : 12.0,
        fieldRange     : 1000.0,
        numParticles   : 250,
        starSpeed      : 50,
        seraphDistance : 2000.0,
        streamSize     : 25000.0,
        streamBias     : 7.0,

        starfieldColor       : new Float32Array(MAX_PARTICLES * 4 * 4),
        starfieldColorIdx    : 0,
        starfieldVertices    : new Float32Array(MAX_PARTICLES * 2 * 4),
        starfieldVerticesIdx : 0,
        starfieldTextures    : new Float32Array(MAX_PARTICLES * 2 * 4),
        starfieldTexturesIdx : 0
    };

    GLSaver.setupOT = function()
    {
        if (timeCounter == 0)
            timeCounter = Date.now();
    };

    GLSaver.timeSinceStart = function()
    {
        return (Date.now() - timeCounter) / 1000;
    };

    GLSaver.setupGL = function()
    {
        var state = GLSaver.state,
            gl    = Flurry.webgl;

        state.spark[0].mystery  = 1800 / 13;
        state.spark[1].mystery  = (1800 * 2)  / 13;
        state.spark[2].mystery  = (1800 * 3)  / 13;
        state.spark[3].mystery  = (1800 * 4)  / 13;
        state.spark[4].mystery  = (1800 * 5)  / 13;
        state.spark[5].mystery  = (1800 * 6)  / 13;
        state.spark[6].mystery  = (1800 * 7)  / 13;
        state.spark[7].mystery  = (1800 * 8)  / 13;
        state.spark[8].mystery  = (1800 * 9)  / 13;
        state.spark[9].mystery  = (1800 * 10) / 13;
        state.spark[10].mystery = (1800 * 11) / 13;
        state.spark[11].mystery = (1800 * 12) / 13;

        for (var i = 0; i < MAX_SMOKE/4; i++)
            for (var k = 0; k < 4; k++)
                GLSaver.state.particles[i].dead[k] = 1; // TRUE (FIXME ?)

        for (var i = 0; i < 12; i++)
            GLSaver.state.spark[i].update();

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        // FIXME alphaFunc is missing from webGL; fragment shader?
        // See http://stackoverflow.com/questions/7277047/alphafunctions-in-webgl
        // Investigate flat shading via vert. duplication

        gl.viewport(0, 0, Flurry.canvas.clientWidth, Flurry.canvas.clientHeight);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        state.oldTime = GLSaver.timeSinceStart() + state.flurryRandomSeed;
    };

    GLSaver.render = function() { /* TODO Stub */ };
    GLSaver.resize = function() { /* TODO Stub */ };
}

_scope();
_scope = null;