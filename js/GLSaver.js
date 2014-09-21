// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry


/**
 * Namespace for the main screensaver/GL logic
 */
Flurry.GLSaver = {};

/**
 * @private
 * @static
 * @type {number}
 */
Flurry.GLSaver.timeCounter = 0;

/** @namespace */
Flurry.GLSaver.Config = {
    colorIncoherence : 0.15,
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
/** @type {ColorModes} */
Flurry.GLSaver.State.colorMode = ColorModes.cyclic;
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
Flurry.GLSaver.State.drag      = 0;
/** @type {number} */
Flurry.GLSaver.State.streamExpansion = 0.0;
/** @type {number} */
Flurry.GLSaver.State.numStreams      = 0;


Flurry.GLSaver.setupOT = function()
{
    'use strict';

    if (Flurry.GLSaver.timeCounter == 0)
        Flurry.GLSaver.timeCounter = Date.now();
};

Flurry.GLSaver.timeSinceStart = function()
{
    'use strict';

    return (Date.now() - Flurry.GLSaver.timeCounter) / 1000;
};

/**
 * @static
 * @function
 */
Flurry.GLSaver.setupGL = function()
{
    'use strict';

    var state = Flurry.GLSaver.State,
        glx   = WebGLRenderingContext,
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
            state.particles[i].dead[k] = 1;

    for (i = 0; i < 12; i++)
        state.spark[i].update();

    Flurry.GLSaver.resize();

    gl.disable(glx.DEPTH_TEST);
    gl.disable(glx.CULL_FACE);
    gl.enable(glx.BLEND);
    // FIXME alphaFunc is missing from webGL; fragment shader?
    // See http://stackoverflow.com/questions/7277047/alphafunctions-in-webgl
    // Investigate flat shading via vertex duplication

    gl.clearColor(0, 0, 0, 1);
    gl.clear(glx.COLOR_BUFFER_BIT);

    state.oldTime = Flurry.GLSaver.timeSinceStart() + state.randSeed;
};

/**
 * @static
 * @function
 */
Flurry.GLSaver.render = function()
{
    'use strict';
    Flurry.GLSaver.resize();

    var state  = Flurry.GLSaver.State,
        config = Flurry.GLSaver.Config,
        glx    = WebGLRenderingContext,
        gl     = Flurry.webgl;

    state.frame++;
    state.oldTime   = state.time;
    state.time      = Flurry.GLSaver.timeSinceStart() + state.randSeed;
    state.deltaTime = state.time - state.oldTime;

    state.drag = Math.pow(0.9965, state.deltaTime * 85);

    for (var i = 0; i < config.numParticles; i++)
        state.particles[i].update();

    state.star.update();

    for (i = 0; i < state.numStreams; i++)
        state.spark[i].update();

    state.smoke.update();

    gl.blendFunc(glx.SRC_ALPHA, glx.ONE);
    gl.enable(glx.TEXTURE_2D);
    state.smoke.draw();
    gl.disable(glx.TEXTURE_2D);

    window.requestAnimationFrame(Flurry.GLSaver.render, null);
};

/**
 * @seealso http://games.greggman.com/game/webgl-anti-patterns/
 * @static
 * @function
 */
Flurry.GLSaver.resize = function()
{
    'use strict';
    var gl     = Flurry.webgl,
        width  = gl.canvas.clientWidth,
        height = gl.canvas.clientHeight;

    if (gl.canvas.width != width || gl.canvas.height != height)
    {
        gl.canvas.width  = width;
        gl.canvas.height = height;
        gl.viewport(0, 0, width, height);
    }
};
