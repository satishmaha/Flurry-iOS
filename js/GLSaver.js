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
Flurry.GLSaver.State.colorMode = ColorModes.tiedye;
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
Flurry.GLSaver.State.randSeed  = Math.randFlt(0, 300);
/** @type {number} */
Flurry.GLSaver.State.oldTime   = 0; // fOldTime
/** @type {number} */
Flurry.GLSaver.State.deltaTime = 0; // fDeltaTime
/** @type {number} */
Flurry.GLSaver.State.frame     = 0; // dframe
/** @type {number} */
Flurry.GLSaver.State.drag      = 0;
/** @type {number} */
Flurry.GLSaver.State.streamExpansion = 100;
/** @type {number} */
Flurry.GLSaver.State.numStreams      = 5;

Flurry.GLSaver.prMatrix = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
Flurry.GLSaver.prStack  = [];
Flurry.GLSaver.mvMatrix = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
Flurry.GLSaver.mvStack  = [];

Flurry.GLSaver.activeMatrix = Flurry.GLSaver.prMatrix;
Flurry.GLSaver.activeStack  = Flurry.GLSaver.prStack;

/**
 * @static
 * @function
 */
Flurry.GLSaver.matrixMode = function(mode)
{
    'use strict';
    if (mode == 1)
    {
        Flurry.GLSaver.activeMatrix = Flurry.GLSaver.prMatrix;
        Flurry.GLSaver.activeStack  = Flurry.GLSaver.prStack;
    }
    else if (mode == 2)
    {
        Flurry.GLSaver.activeMatrix = Flurry.GLSaver.mvMatrix;
        Flurry.GLSaver.activeStack  = Flurry.GLSaver.mvStack;
    }
};

/**
 * @static
 * @function
 */
Flurry.GLSaver.loadIdentity = function()
{
    'use strict';
    Flurry.GLSaver.activeMatrix[0]  = 1;
    Flurry.GLSaver.activeMatrix[1]  = 0;
    Flurry.GLSaver.activeMatrix[2]  = 0;
    Flurry.GLSaver.activeMatrix[3]  = 0;
    Flurry.GLSaver.activeMatrix[4]  = 0;
    Flurry.GLSaver.activeMatrix[5]  = 1;
    Flurry.GLSaver.activeMatrix[6]  = 0;
    Flurry.GLSaver.activeMatrix[7]  = 0;
    Flurry.GLSaver.activeMatrix[8]  = 0;
    Flurry.GLSaver.activeMatrix[9]  = 0;
    Flurry.GLSaver.activeMatrix[10] = 1;
    Flurry.GLSaver.activeMatrix[11] = 0;
    Flurry.GLSaver.activeMatrix[12] = 0;
    Flurry.GLSaver.activeMatrix[13] = 0;
    Flurry.GLSaver.activeMatrix[14] = 0;
    Flurry.GLSaver.activeMatrix[15] = 1;
};

/**
 * @static
 * @function
 */
Flurry.GLSaver.setupOT = function()
{
    'use strict';

    if (Flurry.GLSaver.timeCounter == 0)
        Flurry.GLSaver.timeCounter = Date.now();
};

/**
 * @static
 * @function
 */
Flurry.GLSaver.timeSinceStart = function()
{
    'use strict';

    return (Date.now() - Flurry.GLSaver.timeCounter) / 1000;
};

var ShaderAttr = {};
ShaderAttr.vertPos  = null;
ShaderAttr.vertCol  = null;
ShaderAttr.texCoord = null;

/**
 * @static
 * @function
 */
Flurry.GLSaver.setupShaders = function()
{
    'use strict';
    var glSaver = Flurry.GLSaver,
        state   = glSaver.State,
        glx     = WebGLRenderingContext,
        gl      = Flurry.webgl,
        width   = gl.canvas.clientWidth,
        height  = gl.canvas.clientHeight;

    gl.useProgram(Flurry.shader);

    ShaderAttr.vertPos = gl.getAttribLocation(Flurry.shader, "aVertexPosition");
    gl.enableVertexAttribArray(ShaderAttr.vertPos);

    ShaderAttr.vertCol = gl.getAttribLocation(Flurry.shader, "aVertexColor");
    gl.enableVertexAttribArray(ShaderAttr.vertCol);

    ShaderAttr.texCoord = gl.getAttribLocation(Flurry.shader, "aTextureCoord");
    gl.enableVertexAttribArray(ShaderAttr.texCoord);
};

/**
 * @static
 * @function
 */
Flurry.GLSaver.setup = function()
{
    'use strict';
    var glSaver = Flurry.GLSaver,
        state   = glSaver.State,
        glx     = WebGLRenderingContext,
        gl      = Flurry.webgl,
        width   = gl.canvas.clientWidth,
        height  = gl.canvas.clientHeight;

    state.smoke.init();
    state.star.init();
    state.star.rotSpeed = 1;

    for (var i = 0; i < 64; i++)
        state.spark[i].init();

    for (i = 0; i < 12; i++)
        state.spark[i].mystery = (1800 * (i+1)) / 13;

    for (i = 0; i < MAX_SMOKE/4; i++)
        for (var k = 0; k < 4; k++)
            state.smoke.particles[i].dead[k] = 1;

    for (i = 0; i < 12; i++)
        state.spark[i].update();

    glSaver.resize();

    gl.disable(glx.DEPTH_TEST);
    gl.disable(glx.CULL_FACE);
    gl.enable(glx.BLEND);

    glSaver.matrixMode(1);
    glSaver.loadIdentity();
    mat4.ortho(glSaver.activeMatrix, 0, width, 0, height, -1, 1);
    glSaver.matrixMode(0);
    glSaver.loadIdentity();

    gl.clearColor(0, 0, 0, 1);
    gl.clear(glx.COLOR_BUFFER_BIT);
    state.oldTime = glSaver.timeSinceStart() + state.randSeed;
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
    state.smoke.draw();

    gl.flush();
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
