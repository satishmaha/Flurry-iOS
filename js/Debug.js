// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/** @constructor */
Flurry.Debug = function()
{
    'use strict';

    this.enabled = false;

    this.texGeo  = null;
    this.texMat  = null;
    this.texMesh = null;

    this.starMesh = null;

    this.smokeMesh = null;

    this.init = function()
    {
        'use strict';

        if (!this.enabled)
            return;

        // For generated texture debugging
        this.texGeo = new THREE.PlaneGeometry( 100, 100 );
        this.texMat = new THREE.MeshLambertMaterial({
            map: Flurry.Texture.ref, alphamap: Flurry.Texture.ref,
            color: 0x000000, ambient: 0xFFFFFF,
            shading: THREE.FlatShading, transparent: true, blending: THREE.AdditiveBlending
        });
        this.texMesh = new THREE.Mesh( this.texGeo, this.texMat );
        this.starMesh = new THREE.Mesh( new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial( { color: 0xff4422 } ) );
        this.smokeMesh = new THREE.Mesh( new THREE.PlaneGeometry(5, 30), new THREE.MeshBasicMaterial( { color: 0x44FF22 } ) );

        Flurry.scene.add(this.texMesh);
        Flurry.scene.add(this.starMesh);
        Flurry.scene.add(this.smokeMesh);
    };

    this.update = function()
    {
        'use strict';
        if (!this.enabled)
            return;

        var glSaver = Flurry.GLSaver,
            state   = glSaver.State;

        this.starMesh.position.x = state.star.pos[0];
        this.starMesh.position.y = state.star.pos[1];
        this.starMesh.rotation.z += (2*Math.PI*12/MAX_ANGLES) * state.star.rotSpeed;

        this.smokeMesh.position.x = state.smoke.oldPos[0];
        this.smokeMesh.position.y = state.smoke.oldPos[1];
    };
};