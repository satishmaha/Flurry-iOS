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

    if ( !Flurry.initGL() )
        throw new Error("Could not initialize WebGL");

    Flurry.Texture.create();
    Flurry.GLSaver.resize();
    Flurry.GLSaver.setupGL();

    // Begin!
    Flurry.GLSaver.render();
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

