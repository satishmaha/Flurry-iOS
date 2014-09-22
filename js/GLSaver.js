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
Flurry.GLSaver.timeSinceStart = function()
{
    'use strict';
    return (Date.now() - Flurry.GLSaver.timeCounter) / 1000;
};

/**
 * @static
 * @function
 */
Flurry.GLSaver.setup = function()
{
    'use strict';
    var glSaver = Flurry.GLSaver,
        state   = glSaver.State;

    if (Flurry.GLSaver.timeCounter == 0)
        Flurry.GLSaver.timeCounter = Date.now();

    console.log("[GLSaver] Creating Flurry texture...");
    Flurry.Texture.create();

    console.log("[GLSaver] Creating objects...");
    state.smoke.init();
    state.star.init();
    state.star.rotSpeed = 1;

    for (var i = 0; i < 64; i++)
        state.spark[i].init();

    for (i = 0; i < 12; i++)
        state.spark[i].mystery = (1800 * (i+1)) / 13;

    for (i = 0; i < MAX_SMOKE / 4; i++)
        for (var k = 0; k < 4; k++)
            state.smoke.particles[i].dead[k] = 1;

    for (i = 0; i < 12; i++)
        state.spark[i].update();

    console.log("[GLSaver] Setting up scene...");
    Flurry.scene.add( new THREE.AmbientLight( 0xFFFFFF ) );
    Flurry.scene.add( cube );
    Flurry.renderer.setClearColor(0x003366, 1);
    Flurry.renderer.clear(true);
    Flurry.camera.position.z = 5;
    state.oldTimer = glSaver.timeSinceStart() + state.randSeed;
};

var geometry = new THREE.BoxGeometry(0.2,0.2,0.2);
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube     = new THREE.Mesh( geometry, material );

/**
 * @static
 * @function
 */
Flurry.GLSaver.render = function()
{
    'use strict';
    window.requestAnimationFrame(Flurry.GLSaver.render, null);

    var state = Flurry.GLSaver.State;

    state.frame++;
    state.oldTime   = state.time;
    state.time      = Flurry.GLSaver.timeSinceStart() + state.randSeed;
    state.deltaTime = state.time - state.oldTime;

    state.drag = Math.pow(0.9965, state.deltaTime * 85);

    state.star.update();

    for (var i = 0; i < state.numStreams; i++)
        state.spark[i].update();

    state.smoke.update();
    state.smoke.draw();

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.1;
    cube.rotation.z -= 0.001;

    Flurry.renderer.render(Flurry.scene, Flurry.camera);
};