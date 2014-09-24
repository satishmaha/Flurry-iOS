// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/**
 * A group of particles, represented by four THREE.js quads
 * @constructor
 * */
Flurry.SmokeParticle = function()
{
    'use strict';

    /**
     * Holds the RGBA for four quads (first index component, second index quad)
     * e.g. [0][2] gets the red component of the third quad
     * @type {Float32Array[]}
     */
    this.color = ArrayOf.Vector4F(4);
    /**
     * Holds the XYZ positions of each quad (first index component, second index quad)
     * e.g. [0][2] gets the X float of the third quad
     * @type {Float32Array[]}
     */
    this.pos      = ArrayOf.Vector4F(3);
    /** @type {Float32Array[]} */
    this.oldPos   = ArrayOf.Vector4F(3);
    /** @type {Float32Array[]} */
    this.deltaPos = ArrayOf.Vector4F(3);

    /**
     * This keeps track of the alive state of each quad
     * @type {Uint32Array}
     */
    this.dead  = Vector4I();
    /** @type {Uint32Array} */
    this.frame = Vector4I();
    /** @type {Float32Array} */
    this.time  = Vector4F();
    /** @type {THREE.Mesh[]} */
    this.quads = new Array(4);

    this.init = function()
    {
        for (var i = 0; i < 4; i++)
        {
            var material = new THREE.MeshLambertMaterial({
                map: Flurry.Texture.ref, vertexColors: THREE.FaceColors,
                shading: THREE.FlatShading, transparent: true, blending: THREE.AdditiveBlending
            });

            material.depthTest   = false;
            material.depthWrite  = false;
            material.needsUpdate = true;
            material.opacity     = 0.0;
            material.alphaTest   = 0;

            var mesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), material);
            this.quads[i] = mesh;
            Flurry.scene.add(mesh);
        }
    };

    this.blendMode = function(mode)
    {
        for (var i = 0; i < 4; i++)
            this.quads[i].material.blending = Number(mode);
    };

};