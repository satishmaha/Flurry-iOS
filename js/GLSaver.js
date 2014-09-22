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

Flurry.GLSaver.Config = {
    colorIncoherence : 0.15,
    gravity          : 1500000.0,
    incohesion       : 0.07,
    fieldCoherence   : 0,
    fieldSpeed       : 12.0,
    fieldRange       : 1000.0,
    seraphDistance   : 2000.0,
    starSpeed        : 50,
    streamBias       : 7.0,
    streamSpeed      : 450.0,
    streamSize       : 25000.0
};

Flurry.GLSaver.State = {};
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

var Attributes = {};
Attributes.vertPos  = null;
Attributes.vertCol  = null;
Attributes.texCoord = null;

var Uniforms = {};
Uniforms.pMatrix = null;
Uniforms.mvMatrix = null;

var Matrices = {};
Matrices.projection = mat4.create();
Matrices.modelView  = mat4.create();

/**
 * @static
 * @function
 */
Flurry.GLSaver.setupShaders = function()
{
    'use strict';
    var gl = Flurry.webgl;

    gl.useProgram(Flurry.shader);

    Attributes.vertPos = gl.getAttribLocation(Flurry.shader, "aVertexPosition");
    gl.enableVertexAttribArray(Attributes.vertPos);

    Attributes.vertCol = gl.getAttribLocation(Flurry.shader, "aVertexColor");
    gl.enableVertexAttribArray(Attributes.vertCol);

    Attributes.texCoord = gl.getAttribLocation(Flurry.shader, "aTextureCoord");
    gl.enableVertexAttribArray(Attributes.texCoord);

    Uniforms.pMatrix  = gl.getUniformLocation(Flurry.shader, "uPMatrix");
    Uniforms.mvMatrix = gl.getUniformLocation(Flurry.shader, "uMVMatrix");
};

var Buffers = {};
Buffers.vertPos  = null;
Buffers.vertCol  = null;
Buffers.texCoord = null;

/**
 * @static
 * @function
 */
Flurry.GLSaver.setupBuffers = function()
{
    'use strict';
    var gl = Flurry.webgl;

    Buffers.vertPos  = gl.createBuffer();
    Buffers.vertCol  = gl.createBuffer();
    Buffers.texCoord = gl.createBuffer();
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
        gl      = Flurry.webgl;

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
    gl.clearColor(0, 0, 0, 1);
    gl.clear(glx.COLOR_BUFFER_BIT);

    state.oldTime = glSaver.timeSinceStart() + state.randSeed;
};
    gl.uniformMatrix4fv(Uniforms.pMatrix, false, Matrices.projection);
    gl.uniformMatrix4fv(Uniforms.modelView, false, Matrices.modelView);

    state.oldTime = glSaver.timeSinceStart() + state.randSeed;
};

/**
 * @static
 * @function
 */
Flurry.GLSaver.render = function()
{
    'use strict';
    window.requestAnimationFrame(Flurry.GLSaver.render, null);
    Flurry.GLSaver.resize();

    var state = Flurry.GLSaver.State,
        glx   = WebGLRenderingContext,
        gl    = Flurry.webgl;

    state.frame++;
    state.oldTime   = state.time;
    state.time      = Flurry.GLSaver.timeSinceStart() + state.randSeed;
    state.deltaTime = state.time - state.oldTime;

    state.drag = Math.pow(0.9965, state.deltaTime * 85);

    state.star.update();

    for (var i = 0; i < state.numStreams; i++)
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
    var glx    = WebGLRenderingContext,
        gl     = Flurry.webgl,
        width  = gl.canvas.clientWidth,
        height = gl.canvas.clientHeight;

    if (gl.canvas.width != width || gl.canvas.height != height)
    {
        gl.canvas.width  = width;
        gl.canvas.height = height;
        gl.viewport(0, 0, width, height);
        gl.clear(glx.COLOR_BUFFER_BIT | glx.DEPTH_BUFFER_BIT);

        //mat4.ortho(Matrices.projection, 0, width, 0, height, -1, 1);
        mat4.perspective(Matrices.projection, 45, width / height, 0.1, 100.0);
        mat4.identity(Matrices.modelView);
        mat4.translate(Matrices.modelView, [0, 0, -7]);
        gl.uniformMatrix4fv(Uniforms.pMatrix, false, Matrices.projection);
        gl.uniformMatrix4fv(Uniforms.modelView, false, Matrices.modelView);
    }
};
