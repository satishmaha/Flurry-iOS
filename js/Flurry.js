// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/**
 * The global object and namespace for the Flurry application
 */
var Flurry = {};

/** @type {HTMLCanvasElement} */
Flurry.canvas = null;

/** @type {WebGLRenderingContext} */
Flurry.webgl = null;

/**
 * Entry point for Flurry
 * @param {string} canvasId
 */
Flurry.main = function(canvasId)
{
    'use strict';
    Flurry.canvas = document.getElementById(canvasId);

    console.log("Flurry - WebGL version", canvasId);

    if ( !Flurry.initGL() )
        throw new Error("Could not initialize WebGL");

    if ( !Flurry.initShaders() )
        throw new Error("Could not initialize shaders");

    console.log("[Main] Setting up...");
    Flurry.Texture.create();
    Flurry.GLSaver.setupOT();
    Flurry.GLSaver.setupShaders();
    Flurry.GLSaver.setupBuffers();
    Flurry.GLSaver.setup();

    // Begin!
    console.log("[Main] Beginning render loop...");
    Flurry.GLSaver.render();
};

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/WebGL/Getting_started_with_WebGL
 * @returns {boolean}
 * @static
 */
Flurry.initGL = function()
{
    'use strict';

    console.log("Getting a WebGL context from the given canvas...");
    try
    {
        // Try to grab the standard context. If it fails, fallback to experimental.
        Flurry.webgl = Flurry.canvas.getContext("webgl") || Flurry.canvas.getContext("experimental-webgl");
        return true;
    }
    catch(e)
    {
        console.log("WebGL FAILURE", e);
        return false;
    }
};

/** @type {WebGLProgram} */
Flurry.shader = null;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/WebGL/Getting_started_with_WebGL
 * @returns {boolean}
 * @static
 */
Flurry.initShaders = function()
{
    'use strict';

    console.log("Compiling shaders...");
    try
    {
        var fragmentShader = Flurry.getShader("shader-fs");
        var vertexShader   = Flurry.getShader("shader-vs");

        Flurry.shader = Flurry.webgl.createProgram();
        Flurry.webgl.attachShader(Flurry.shader, vertexShader);
        Flurry.webgl.attachShader(Flurry.shader, fragmentShader);
        Flurry.webgl.linkProgram(Flurry.shader);

        if ( !Flurry.webgl.getProgramParameter(Flurry.shader, WebGLRenderingContext.LINK_STATUS) )
            throw new Error( Flurry.webgl.getProgramInfoLog(Flurry.shader));

        return true;
    }
    catch (e)
    {
        console.log("Shader FAILURE", e);
        return false;
    }
};

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/WebGL/Getting_started_with_WebGL
 * @param {string} id
 * @returns {WebGLShader}
 * @static
 */
Flurry.getShader = function(id)
{
    'use strict';
    var shaderScript, theSource, currentChild, shader;

    shaderScript = document.getElementById(id);

    if (!shaderScript)
        return null;

    theSource = "";
    currentChild = shaderScript.firstChild;

    while(currentChild)
    {
        if (currentChild.nodeType == Node.TEXT_NODE)
            theSource += currentChild.textContent;

        currentChild = currentChild.nextSibling;
    }

    if (shaderScript.type == "x-shader/x-fragment")
        shader = Flurry.webgl.createShader(WebGLRenderingContext.FRAGMENT_SHADER);
    else if (shaderScript.type == "x-shader/x-vertex")
        shader = Flurry.webgl.createShader(WebGLRenderingContext.VERTEX_SHADER);
    else
        return null;

    Flurry.webgl.shaderSource(shader, theSource);
    Flurry.webgl.compileShader(shader);

    if ( !Flurry.webgl.getShaderParameter(shader, WebGLRenderingContext.COMPILE_STATUS) )
        throw new Error( Flurry.webgl.getShaderInfoLog(shader));

    return shader;
};