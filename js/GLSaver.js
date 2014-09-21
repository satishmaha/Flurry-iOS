// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry


/**
 * Namespace for the main screensaver/GL logic
 * @type {object}
 */
Flurry.GLSaver = {};


/**
 * @private
 * @static
 * @type {number}
 */
Flurry.GLSaver.timeCounter = 0;


/**
 * @enum {number}
 * @readonly
 */
Flurry.GLSaver.ColorModes = {
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

/** @namespace */
Flurry.GLSaver.Config = {
    colorIncoherence : 0.15,
    drag             : 0.0,
    gravity          : 1500000.0,
    incohesion       : 0.07,
    fieldCoherence   : 0,
    fieldSpeed       : 12.0,
    fieldRange       : 1000.0,
    numParticles     : 250,
    seraphDistance   : 2000.0,
    starSpeed        : 50,
    streamBias       : 7.0,
    streamSpeed      : 450.0,
    streamSize       : 25000.0
};


/** @namespace */
Flurry.GLSaver.State = {};
/** @type {Flurry.Particle[]} */
Flurry.GLSaver.State.particles = ArrayOf(Flurry.Particle, MAX_PARTICLES);
/** @type {Flurry.Spark[]} */
Flurry.GLSaver.State.spark     = ArrayOf(Flurry.Spark, 64);
/** @type {Flurry.Smoke} */
Flurry.GLSaver.State.smoke     = new Flurry.Smoke();
/** @type {Flurry.Star} */
Flurry.GLSaver.State.star      = new Flurry.Star();
/** @type {Flurry.GLSaver.ColorModes} */
Flurry.GLSaver.State.colorMode = Flurry.GLSaver.ColorModes.cyclic;
/** @type {Float32Array} */
Flurry.GLSaver.State.starfieldColor    = new Float32Array(MAX_PARTICLES * 4 * 4);
/** @type {Float32Array} */
Flurry.GLSaver.State.starfieldVertices = new Float32Array(MAX_PARTICLES * 2 * 4);
/** @type {Float32Array} */
Flurry.GLSaver.State.starfieldTextures = new Float32Array(MAX_PARTICLES * 2 * 4);
/** @type {number} */
Flurry.GLSaver.State.starfieldColorIdx    = 0;
/** @type {number} */
Flurry.GLSaver.State.starfieldVerticesIdx = 0;
/** @type {number} */
Flurry.GLSaver.State.starfieldTexturesIdx = 0;
/** @type {number} */
Flurry.GLSaver.State.time      = 0; // fTime
/** @type {number} */
Flurry.GLSaver.State.randSeed  = 0;
/** @type {number} */
Flurry.GLSaver.State.oldTime   = 0; // fOldTime
/** @type {number} */
Flurry.GLSaver.State.deltaTime = 0; // fDeltaTime
/** @type {number} */
Flurry.GLSaver.State.frame     = 0; // dframe
/** @type {number} */
Flurry.GLSaver.State.streamExpansion = 0.0;
/** @type {number} */
Flurry.GLSaver.State.numStreams      = 0;


Flurry.GLSaver.setupOT = function()
{
    'use strict';

    if (timeCounter == 0)
        timeCounter = Date.now();
};

Flurry.GLSaver.timeSinceStart = function()
{
    'use strict';

    return (Date.now() - timeCounter) / 1000;
};

Flurry.GLSaver.setupGL = function()
{
    'use strict';

    var state = GLSaver.State,
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
            GLSaver.State.particles[i].dead[k] = 1; // TRUE (FIXME ?)

    for (i = 0; i < 12; i++)
        GLSaver.State.spark[i].update();

    gl.disable(WebGLRenderingContext.DEPTH_TEST);
    gl.disable(WebGLRenderingContext.CULL_FACE);
    gl.enable(WebGLRenderingContext.BLEND);
    // FIXME alphaFunc is missing from webGL; fragment shader?
    // See http://stackoverflow.com/questions/7277047/alphafunctions-in-webgl
    // Investigate flat shading via vertex duplication

    gl.viewport(0, 0, Flurry.canvas.clientWidth, Flurry.canvas.clientHeight);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);

    state.oldTime = GLSaver.timeSinceStart() + state.randSeed;
};

Flurry.GLSaver.render = function() { /* TODO Stub */ };
Flurry.GLSaver.resize = function() { /* TODO Stub */ };
