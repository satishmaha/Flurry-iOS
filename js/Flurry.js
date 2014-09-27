// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

// Constants
var MAX_SMOKE   = 1800, // Originally 3600
    MAX_ANGLES  = 16384,
    BIG_MYSTERY = 1800;

/**
 * The global object and namespace for the Flurry application
 */
var Flurry = {};

/** @type {Flurry.Renderer} */
Flurry.renderer = null;
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
    console.log("[Main] Setting up renderer...");
    Flurry.renderer = new Flurry.Renderer('renderer');
    Flurry.renderer.useShader('vertexShader');
    Flurry.renderer.useShader('fragShader');
    Flurry.renderer.setup();
    window.addEventListener('resize', function() { Flurry.renderer.resize(); }, false);

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
        .onChange(function(v)  { Flurry.renderer.setFadeColor( ColorC(v) ); });
    f0.add(config, 'blendMode', BlendModes)
        .onChange(function(v)  { Flurry.renderer.setBlendMode( Number(v) ); });
    f0.add(config, 'brightness', 0, 5);
    f0.add(config, 'colorIncoherence', 0, 3);
    f0.add(config, 'colorMode', ColorModes)
        .onChange(function(v) { Flurry.Config.colorMode = Number(v); });
    f0.add(config, 'fade', 0, 0.5)
        .onChange(function(v)  { Flurry.renderer.setFade(v); });

    var f1 = gui.addFolder('Field');
    f1.add(config, 'fieldCoherence', 0, 10);
    f1.add(config, 'fieldSpeed', 0, 100);
    f1.add(config, 'fieldRange', 0, 500);

    var f2 = gui.addFolder('Streams');
    f2.add(config, 'numStreams', 1, 32).step(1);
    f2.add(config, 'streamBias', 0, 50);
    f2.add(config, 'streamExpansion', 1, 250);
    f2.add(config, 'streamSize', 0, 100);
    f2.add(config, 'streamSpeed', 0, 100);

    var f3 = gui.addFolder('Debug');
    f3.add(config, 'debugFps').onChange( function(v)
    {
        if (v)
            Flurry.stats.begin();
        else
            Flurry.stats.end();

        Flurry.stats.domElement.style.display = v ? "block" : "none";
    });
};