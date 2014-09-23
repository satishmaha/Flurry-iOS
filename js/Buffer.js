// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/** @constructor */
Flurry.Buffer = function()
{
    'use strict';
    // Nessecary due to issues trying to update WebGLRenderTarget...
    this.needsUpdate = true;

    this.scene  = new THREE.Scene();
    this.target = null;

    this.mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(window.innerWidth, window.innerHeight),
        new THREE.MeshLambertMaterial({
            color: 0xFFFFFF, ambient: 0xFFFFFF,
            shading: THREE.FlatShading, transparent: true, blending: THREE.AdditiveBlending
    }));

    this.scene.add(this.mesh);
    this.scene.add(new THREE.AmbientLight(0xFFFFFF));

    this.dimScene = new THREE.Scene();
    this.dimMesh  = new THREE.Mesh(
        new THREE.PlaneGeometry(window.innerWidth, window.innerHeight),
        new THREE.MeshBasicMaterial({ color: 0x000000, shading: THREE.FlatShading, transparent: true })
    );

    this.dimMesh.material.opacity = 0.1;
    this.dimScene.add(this.dimMesh);

    this.update = function()
    {
        if (!this.needsUpdate)
            return;

        var hWWidth  = window.innerWidth;
        var hWHeight = window.innerHeight;

        this.target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight,
            { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, depthBuffer: false }
        );

        this.mesh.material.map = this.target;

        // 0-+, 1++, 2--, 3+-
        this.mesh.geometry.vertices[0].set(0,  hWHeight, 0);
        this.mesh.geometry.vertices[1].set(hWWidth, hWHeight, 0);
        this.mesh.geometry.vertices[2].set(0, 0, 0);
        this.mesh.geometry.vertices[3].set(hWWidth, 0, 0);
        this.mesh.geometry.verticesNeedUpdate = true;

        this.dimMesh.geometry.vertices[0].set(0,  hWHeight, 0);
        this.dimMesh.geometry.vertices[1].set(hWWidth, hWHeight, 0);
        this.dimMesh.geometry.vertices[2].set(0, 0, 0);
        this.dimMesh.geometry.vertices[3].set(hWWidth, 0, 0);
        this.dimMesh.geometry.verticesNeedUpdate = true;

        this.needsUpdate = false;
    };
};