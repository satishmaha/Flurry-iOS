// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

Flurry = {};

Flurry.canvas = null;

/**
 * @public
 * @type {null|WebGLRenderingContext}
 */
Flurry.webgl = null;

Flurry.main = function(canvasElement)
{
    Flurry.canvas = document.getElementById(canvasElement);

    if ( !Flurry.initWebGL() )
    {
        alert("Could not initialize WebGL");
        throw new Error("Could not initialize WebGL");
    }

    Flurry.render();
};
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/WebGL/Getting_started_with_WebGL
 * @returns {null|*}
 */
Flurry.initWebGL = function()
{
    try
    {
        // Try to grab the standard context. If it fails, fallback to experimental.
        Flurry.webgl = Flurry.canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        return true;
    }
    catch(e)
    {
        return false;
    }
};

Flurry.render = function()
{
    var gl = Flurry.webgl;

    gl.clearColor(0.0, 0.2, 0.4, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    window.requestAnimationFrame(Flurry.render, null);
};

