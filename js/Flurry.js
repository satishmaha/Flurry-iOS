// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

// Constants
var MAX_SMOKE     = 3600, // Originally 3600
    MAX_ANGLES    = 16384,
    BIG_MYSTERY   = 1800;

/**
 * The global object and namespace for the Flurry application
 */
var Flurry = {};

/** @type {THREE.Scene} */
Flurry.scene = null;
/** @type {THREE.Camera} */
Flurry.camera = null;
/** @type {THREE.WebGLRenderer} */
Flurry.renderer = null;
/** @type {Flurry.Buffer} */
Flurry.buffer = null;
/** @type {Stats} */
Flurry.stats = null;
/** @type {dat.GUI} */
Flurry.gui = null;

/**
 * Entry point for Flurry
 */
Flurry.main = function()
{
    'use strict';
    console.log("[Main] Setting up a THREE.js scene and DOM...");
    Flurry.scene    = new THREE.Scene();
    Flurry.camera   = new THREE.OrthographicCamera();
    Flurry.renderer = new THREE.WebGLRenderer({ antialias: false });
    Flurry.buffer   = new Flurry.Buffer();
    Flurry.renderer.setFaceCulling(THREE.CullFaceNone);
    Flurry.renderer.setDepthTest(false);
    Flurry.renderer.setDepthWrite(false);
    Flurry.renderer.autoClear = false;
    Flurry.onResize();
    window.addEventListener('resize', Flurry.onResize, false);
    document.body.appendChild(Flurry.renderer.domElement);

    console.log("[Main] Setting up UI...");
    Flurry.setupGui();

    console.log("[Main] Setting up GLSaver...");
    Flurry.GLSaver.setup();

    console.log("[Main] Done! Beginning render loop...");
    Flurry.GLSaver.render();
};

Flurry.setupGui = function()
{
    'use strict';
    Flurry.gui   = new dat.GUI();
    Flurry.stats = new Stats();
    Flurry.stats.domElement.style.position = 'absolute';
    Flurry.stats.domElement.style.top      = '0px';
    document.body.appendChild( Flurry.stats.domElement );

    var gui    = Flurry.gui,
        config = Flurry.GLSaver.Config;

    gui.add(config, 'brightness', 0, 5);
    gui.add(config, 'colorIncoherence', 0, 3);
    gui.add(config, 'colorMode', ColorModes);
    var cfgFade = gui.add(config, 'fade', 0, 1);
    gui.add(config, 'gravity', 0, 6000000).step(1500);
    gui.add(config, 'incohesion', 0, 1);
    gui.add(config, 'seraphDistance', 0, 5000);

    var f1 = gui.addFolder('Field');
    f1.add(config, 'fieldCoherence', 0, 10);
    f1.add(config, 'fieldSpeed', 0, 100);
    f1.add(config, 'fieldRange', 0, 5000);

    var f2 = gui.addFolder('Streams');
    f2.add(config, 'numStreams', 1, 64).step(1);
    f2.add(config, 'streamBias', 0, 50);
    f2.add(config, 'streamExpansion', 1, 250);
    f2.add(config, 'streamSize', 0, 50000);
    f2.add(config, 'streamSpeed', 0, 1000);

    cfgFade.onChange(function(v){
        Flurry.buffer.dimMesh.material.opacity = v;
    });
};

Flurry.onResize = function()
{
    'use strict';
    console.log("[Main] Resizing renderer...");

    Flurry.camera.left   = 0;
    Flurry.camera.right  = window.innerWidth;
    Flurry.camera.bottom = 0;
    Flurry.camera.top    = window.innerHeight;
    Flurry.camera.near   = -1;
    Flurry.camera.far    = 1;
    Flurry.camera.aspect = window.innerWidth / window.innerHeight;

    Flurry.renderer.setSize(window.innerWidth, window.innerHeight);
    Flurry.camera.updateProjectionMatrix();
    Flurry.renderer.clearTarget(Flurry.buffer.target, true, true, true);

    Flurry.buffer.needsUpdate = true;
};