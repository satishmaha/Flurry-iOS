This is a WebGL/Javascript port of Flurry from the original code by @calumr ( [website](https://web.archive.org/web/20100612005656/http://web.mac.com/calumr/iWeb/Calum%20Robinson/Flurry.html) ).

This was my first excercise in OpenGL, WebGL, Three.JS, reading Obj-/C/++ code, reading AltiVec code and porting a legacy app, all at once. As such, this port is unoptimal, buggy and may not be a 1:1 perfect implementation of flurry. But it works!

## Demo
 
Demo can be found on [this page](http://roycurtis.github.io/flurry/). Press H to hide the settings GUI and press F11 for full-screen.

## Structure

This is run through a single HTML page that links to many javascript files, using some external libs from a CDN. The file structure matches similarly to the original C code:

* **Flurry.js** - Entry point and holds the main namespace (Flurry) and objects (THREE scene/camera/renderer, etc)
* **GLSaver.js** - Holds Flurry state, config, 3D setup and render loop
* **Buffer.js** - Holds a scene and render target, to allow Flurry to be drawn without clearing prior colors (I believe this is what is referred to as triple buffering ..?)
* **Star.js** - Represents the physical core of a "flurry", where all "streams" attach to
* **Spark.js** - Represents a single physical "stream" attached to a flurry's star.
* **Smoke.js** - Represents the particle emitter that gives physics to and draws the particle meshes, making use of the flurry's star and sparks
* **SmokeParticle.js** - Represents a group of four particle quads (unsure why particles are grouped in fours)
* **Texture.js** - Generates and holds the texture that the smoke particles use (actually an 8x8 grid of spots, each one with added speckle)
* **util/ArrayOf.js** - Helper methods for creating an Array of something (with each element already initialized)
* **util/ColorModes.js** - Color modes enum
* **util/Math.js** - Extension to Javascript standard `Math` to provide some Clib-like functions
* **util/Vectors.js** - Helper methods for creating "vectors" using typed arrays

## Dev notes

See `docs/DevNotes.md` for rough notes jotted down during the porting process.

## TODO

* Optimize - Original Flurry just uses large arrays for vertex information. The same could be done with WebGL, but it was easier to just use THREE.js panels. Would need to adapt the code to generate vertex arrays for triangles, not quads.
* Restructure and clean up the code
* Presets
* Multiple/per-monitor flurry?
* Perfect the visuals - Something is off with how the particles are drawn (premultiplied alpha? gamma correction? color depth?). The Apple version is also much more colorful/bloomy.