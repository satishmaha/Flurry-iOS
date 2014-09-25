// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

// Constants
var MAX_SMOKE   = 3600, // Originally 3600
    MAX_ANGLES  = 16384,
    BIG_MYSTERY = 1800;

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
    Flurry.gui   = new dat.GUI({load: Flurry.Presets});
    Flurry.stats = new Stats();
    Flurry.stats.begin();
    Flurry.stats.domElement.style.display  = 'none';
    Flurry.stats.domElement.style.position = 'absolute';
    Flurry.stats.domElement.style.top      = '0px';
    document.body.appendChild(Flurry.stats.domElement);

    var gui    = Flurry.gui,
        config = Flurry.Config;

    gui.remember(config);
    gui.add(config, 'focus', 0, 200);
    gui.add(config, 'gravity', 0, 600);
    gui.add(config, 'incohesion', 0, 1);
    gui.add(config, 'seraphDistance', 0, 500);

    var f0 = gui.addFolder('Color');
    f0.addColor(config, 'backColor')
        .onChange(function(v)  { Flurry.buffer.dimMesh.material.color.setStyle(v); });
    var cfgBlend = f0.add(config, 'blendMode', BlendModes);
    f0.add(config, 'colorMode', ColorModes)
        .onChange(function(v) { Flurry.Config.colorMode = Number(v); });
    f0.add(config, 'fade', 0, 0.5)
        .onChange(function(v)  { Flurry.buffer.dimMesh.material.opacity = v; });
    f0.add(config, 'brightness', 0, 5);
    f0.add(config, 'colorIncoherence', 0, 3);

    var f1 = gui.addFolder('Field');
    f1.add(config, 'fieldCoherence', 0, 10);
    f1.add(config, 'fieldSpeed', 0, 100);
    f1.add(config, 'fieldRange', 0, 500);

    var f2 = gui.addFolder('Streams');
    f2.add(config, 'numStreams', 1, 64).step(1);
    f2.add(config, 'streamBias', 0, 50);
    f2.add(config, 'streamExpansion', 1, 250);
    f2.add(config, 'streamSize', 0, 100);
    f2.add(config, 'streamSpeed', 0, 100);

    var f3 = gui.addFolder('Debug');
    f3.add(config, 'debug');
    f3.add(config, 'debugFps').onChange( function(v)
    {
        if (v)
            Flurry.stats.begin();
        else
            Flurry.stats.end();

        Flurry.stats.domElement.style.display = v ? "block" : "none";
    });

    cfgBlend.onChange(function(v)
    {
        Flurry.GLSaver.State.smoke.particles.forEach(function(p)
        {
            p.blendMode(v);
        });
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