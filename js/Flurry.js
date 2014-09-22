// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

// Constants
var MAX_PARTICLES = 2500,
    MAX_SMOKE     = 3600,
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
    console.log("[Main] Flurry - WebGL version");

    console.log("[Main] Setting up a THREE.js scene and DOM...");
    Flurry.scene    = new THREE.Scene();
    Flurry.camera   = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    Flurry.renderer = new THREE.WebGLRenderer();
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
    Flurry.camera.aspect = window.innerWidth / window.innerHeight;
    Flurry.camera.updateProjectionMatrix();

    Flurry.renderer.setSize( window.innerWidth, window.innerHeight );
};