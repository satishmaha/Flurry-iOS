// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/** @constructor */
Flurry.Debug = function()
{
    'use strict';
    this.scene   = null;

    this.texGeo  = null;
    this.texMat  = null;
    this.texMesh = null;

    this.starMesh = null;

    this.smokeMesh = null;

    this.bufferMesh = null;

    this.init = function()
    {
        'use strict';

        this.scene = new THREE.Scene();
        this.scene.add( new THREE.AmbientLight(0xFFFFFF) );

        // For generated texture debugging
        this.texGeo = new THREE.PlaneGeometry( 256, 256 );
        this.texMat = new THREE.MeshLambertMaterial({
            map: Flurry.Texture.ref, color: 0x000000, ambient: 0xFFFFFF,
            shading: THREE.FlatShading, transparent: true
        });
        this.texMesh   = new THREE.Mesh( this.texGeo, this.texMat );
        this.starMesh  = new THREE.Mesh( new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial( { color: 0xff4422 } ) );
        this.smokeMesh = new THREE.Mesh( new THREE.PlaneGeometry(5, 30), new THREE.MeshBasicMaterial( { color: 0x44FF22 } ) );

        this.scene.add(this.texMesh);
        this.scene.add(this.starMesh);
        this.scene.add(this.smokeMesh);

        this.texMesh.position.x = 128;
        this.texMesh.position.y = 128;

        this.bufferMesh = new THREE.Mesh(
            new THREE.PlaneGeometry( 256, 256 ),
            new THREE.MeshLambertMaterial({
                map: Flurry.buffer.target,
                color: 0x000000, ambient: 0xFFFFFF,
                shading: THREE.FlatShading, transparent: false
        }));

        this.bufferMesh.position.x = 256 + 128;
        this.bufferMesh.position.y = 128;

        this.scene.add(this.bufferMesh);
    };

    this.update = function()
    {
        'use strict';

        var glSaver = Flurry.GLSaver,
            state   = glSaver.State;

        this.starMesh.position.x = state.star.pos[0];
        this.starMesh.position.y = state.star.pos[1];
        this.starMesh.rotation.z += (2*Math.PI*12/MAX_ANGLES) * state.star.rotSpeed;

        this.smokeMesh.position.x = state.smoke.oldPos[0];
        this.smokeMesh.position.y = state.smoke.oldPos[1];
    };

    this.render = function()
    {
        'use strict';

        Flurry.renderer.render(this.scene, Flurry.camera, null, false);
    }
};