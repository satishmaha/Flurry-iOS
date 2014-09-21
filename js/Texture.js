// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/**
 * Namespace for the texture creation logic
 * @type {object}
 * @namespace
 */
Flurry.Texture = {};

/**
 * The WebGL texture used by Flurry
 * @type {WebGLTexture}
 */
Flurry.Texture.ref = null;

/** @type {Uint8Array[]} */
Flurry.Texture.smallTex = ArrayOf.ByteMatrix2(32, 32);

/** @type {Uint8Array[][]} */
Flurry.Texture.bigTex = ArrayOf.ByteMatrix3(256, 256, 2);

Flurry.Texture.firstTime = true;

Flurry.Texture.smooth = function()
{
    'use strict';
    var i, j, t,
        filter = ArrayOf.ByteMatrix2(32, 32);

    for (i=1;i<31;i++)
    for (j=1;j<31;j++)
    {
        t  = Flurry.Texture.smallTex[i][j]*4;
        t += Flurry.Texture.smallTex[i-1][j];
        t += Flurry.Texture.smallTex[i+1][j];
        t += Flurry.Texture.smallTex[i][j-1];
        t += Flurry.Texture.smallTex[i][j+1];
        t /= 8;
        filter[i][j] = t;
    }

    for (i=1;i<31;i++)
    for (j=1;j<31;j++)
    {
        Flurry.Texture.smallTex[i][j] = filter[i][j];
    }
};

Flurry.Texture.speckle = function()
{
    'use strict';
    var i, j, speck;

    for (i=2;i<30;i++)
    for (j=2;j<30;j++)
    {
        speck = 1;
        while (speck <= 32 && Math.randClib() % 2)
        {
            Flurry.Texture.smallTex[i][j] = Math.min(255, Flurry.Texture.smallTex[i][j] + speck);
            speck += speck;
        }

        speck = 1;
        while (speck <= 32 && Math.randClib() % 2)
        {
            Flurry.Texture.smallTex[i][j] = Math.max(0, Flurry.Texture.smallTex[i][j] - speck);
            speck += speck;
        }
    }
};

Flurry.Texture.makeSmallTexture = function()
{
    'use strict';
    var i, j, t, r;

    if (Flurry.Texture.firstTime)
    {
        Flurry.Texture.firstTime = false;
        for (i=0;i<32;i++)
        for (j=0;j<32;j++)
        {
            r = Math.sqrt((i-15.5)*(i-15.5)+(j-15.5)*(j-15.5));
            if (r > 15)
                Flurry.Texture.smallTex[i][j] = 0;
            else
                Flurry.Texture.smallTex[i][j] = 255.0 * Math.cos(r*Math.PI/31.0);
        }

    }
    else
    {
        for (i=0;i<32;i++)
        for (j=0;j<32;j++)
        {
            r = Math.sqrt((i-15.5)*(i-15.5)+(j-15.5)*(j-15.5));
            if (r > 15.0)
                t = 0;
            else
                t = 255 * Math.cos(r*Math.PI/31.0);

            Flurry.Texture.smallTex[i][j] = Math.min(255, (t + Flurry.Texture.smallTex[i][j] + Flurry.Texture.smallTex[i][j]) / 3);
        }
    }

    Flurry.Texture.speckle();
    Flurry.Texture.smooth();
    Flurry.Texture.smooth();
};

/**
 * @static
 * @function
 */
Flurry.Texture.copySmallToBig = function(k, l)
{
    'use strict';

    for (var i=0;i<32;i++)
    for (var j=0;j<32;j++)
    {
        Flurry.Texture.bigTex[i+k][j+l][0] = Flurry.Texture.smallTex[i][j];
        Flurry.Texture.bigTex[i+k][j+l][1] = Flurry.Texture.smallTex[i][j];
    }
};

/**
 * @static
 * @function
 */
Flurry.Texture.averageLastAndFirst = function()
{
    'use strict';

    for (var i=0;i<32;i++)
    for (var j=0;j<32;j++)
    {
        var t = (Flurry.Texture.smallTex[i][j] + Flurry.Texture.bigTex[i][j][0]) / 2;
        Flurry.Texture.smallTex[i][j] = Math.min(255,t);
    }
};

/**
 * Creates textures for Flurry to use, referencing it in {Flurry.Texture.ref}
 * @static
 * @function
 */
Flurry.Texture.create = function()
{
    'use strict';

    var gl  = Flurry.webgl,
        glx = WebGLRenderingContext;

    for (var i = 0; i < 8; i++)
    for (var j = 0; j < 8; j++)
    {
        if (i == 7 && j == 7)
            Flurry.Texture.averageLastAndFirst();
        else
            Flurry.Texture.makeSmallTexture();

        Flurry.Texture.copySmallToBig(i * 32, j * 32);
    }

    gl.pixelStorei(glx.UNPACK_ALIGNMENT, 1);
    Flurry.Texture.ref = gl.createTexture();
    gl.bindTexture(glx.TEXTURE_2D, Flurry.Texture.ref);

    gl.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_WRAP_S, glx.REPEAT);
    gl.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_WRAP_T, glx.REPEAT);
    gl.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_MAG_FILTER, glx.LINEAR);
    gl.texParameteri(glx.TEXTURE_2D, glx.TEXTURE_MIN_FILTER, glx.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(glx.TEXTURE_2D);
    // TODO: WebGL (TexEnvF shader?)
    // See https://code.google.com/p/gles2-bc/source/browse/trunk/Sources/OpenGLES/OpenGLES20/shaders/texture0.frag#114
};