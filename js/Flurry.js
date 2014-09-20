// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/**
 * The global object and namespace for the Flurry application
 * @type {object}
 */
var Flurry = {};

/** @type {HTMLCanvasElement} */
Flurry.canvas = null;

/** @type {WebGLRenderingContext} */
Flurry.webgl = null;

/**
 * Entry point for Flurry
 * @param {HTMLCanvasElement} canvasElement
 */
Flurry.main = function(canvasElement)
{
    'use strict';
    Flurry.canvas = document.getElementById(canvasElement);

    if ( !Flurry.initGL() )
        throw new Error("Could not initialize WebGL");

    Flurry.render();
};

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/WebGL/Getting_started_with_WebGL
 * @returns {boolean}
 */
Flurry.initGL = function()
{
    'use strict';

    try
    {
        // Try to grab the standard context. If it fails, fallback to experimental.
        Flurry.webgl = Flurry.canvas.getContext("webgl") || Flurry.canvas.getContext("experimental-webgl");
        return true;
    }
    catch(e)
    {
        return false;
    }
};

/**
 * Render loop for Flurry
 */
Flurry.render = function()
{
    'use strict';

    var gl = Flurry.webgl;

    gl.clearColor(0.0, 0.2, 0.4, 1.0);
    gl.enable(WebGLRenderingContext.DEPTH_TEST);
    gl.depthFunc(WebGLRenderingContext.LEQUAL);
    // IDE: WebStorm incorrectly thinks .clear is being given the wrong type
    gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);

    window.requestAnimationFrame(Flurry.render, null);
};

