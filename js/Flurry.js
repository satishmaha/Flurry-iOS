// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

// Constants
var MAX_SMOKE     = 800,
    MAX_ANGLES    = 16384,
    BIG_MYSTERY   = 1800;

/**
 * The global object and namespace for the Flurry application
 */
var Flurry = {};

/** @type {Scene} */
Flurry.scene = null;
/** @type {Camera} */
Flurry.camera = null;
/** @type {WebGLRenderer} */
Flurry.renderer = null;

/**
 * Entry point for Flurry
 */
Flurry.main = function()
{
    'use strict';
    console.log("[Main] Setting up a THREE.js scene and DOM...");
    Flurry.scene    = new THREE.Scene();
    Flurry.camera   = new THREE.OrthographicCamera();
    Flurry.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    Flurry.renderer.setFaceCulling(THREE.CullFaceNone);
    Flurry.renderer.setDepthTest(false);
    Flurry.renderer.setDepthWrite(false);
    Flurry.onResize();
    window.addEventListener('resize', Flurry.onResize, false);
    document.body.appendChild(Flurry.renderer.domElement);

    console.log("[Main] Setting up GLSaver...");
    Flurry.GLSaver.setup();

    console.log("[Main] Done! Beginning render loop...");
    Flurry.GLSaver.render();
};

Flurry.onResize = function()
{
    "use strict";
    console.log("[Main] Resizing renderer...");
    var width  = window.innerWidth,
        height = window.innerHeight,
        zoom   = 1;

    Flurry.camera.left   = 0  / -zoom;
    Flurry.camera.right  = width  /  zoom;
    Flurry.camera.bottom = 0 / -zoom;
    Flurry.camera.top    = height /  zoom;
    Flurry.camera.near   = -1;
    Flurry.camera.far    = 1;
    Flurry.camera.aspect = width / height;

    Flurry.camera.updateProjectionMatrix();
    Flurry.renderer.setSize(width, height);
};