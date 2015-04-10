## Note 9

**This note is late; 7 months prior to this commit, I completed Flurry-WebGL and made major changes since.**

I was very proud to reach my goal of making Flurry work on WebGL. It is the first time
I had successfully ported a C code base and understood WebGL on the inside. Since then,
I worked towards polishing Flurry-WebGL to make the most of its new web environment.

---

I added a GUI with dat-gui that allowed me to expose all internal state variables.
This allowed the Flurry to be dynamically changed, and it dramatically helped me
understand how each moving part of Flurry's algorithm contributed to the visuals.

I also made use of the GUI to create some presets, to more properly show off the potential
and power of Flurry.

---

Another major change was the transition back to raw WebGL from Three.js. Three.js is
great for prototyping or quickly writing a working example, but I still felt the code
could benefit from much less abstraction.

I was also unhappy with the "black box" nature of Three.js' code (whilst available in
source code form, it was still too difficult for me to follow what whappened in the code).

By reimplementing what I now knew to be working code in Javascript, into WebGL, I was able
to optimize Flurry up to threefold and gain a better understanding of how WebGL worked. This
low level approached helped me fix strange bugs, such as quads lingering on the edges and
brightness issues with extreme resolutions.

---

The next thing for Flurry-WebGL is to restructure the code; to make it cleaner, more documented
and easy for other users to understand and study the code. There is also [SIMD.js](https://blog.mozilla.org/javascript/2015/03/10/state-of-simd-js-performance-in-firefox/) support on the
way, which the original Flurry code relied heavily upon. I would like to eventually implement
SIMD support into Flurry-WebGL.

## Note 8

I think I may have made a wrong assumption about the Smoke draw loop; that it was
iterating over every *vertex*. It seems, however, it is iterating per *quad*.

## Note 7

Writing WebGL code myself is turning out to be too error-prone and verbose. I am opting
instead to use Three.JS.

Now the code is based on Three.JS and I have basic rendering working, which means the
final step is to have Flurry properly speaking WebGL/Three.JS's language. The biggest
hurdle is transforming Flurry's used of quads (4 verticies per polygon) to WebGL's
triangles (3 verticies per polygon).

## Note 6

After working on the AltiVec-based vector code for Smoke.js for a while, I found myself
trying to re-implement more and more complex methods from AltiVec. I have found it too
difficult to continue and will instead try to port the scalar based code from Flurry
(non-PPC).

I will leave in the vector code as a commit, but not in later commits.

## Note 5

I rely very heavily on my IDE to code quicker. I was having an issue with WebStorm being
unable to determine the correct members of an object, if that object itself was a member
in a container object.

After some trial-and-error, I was finally able to determine that the IDE did not like
"static" container objects being defined with a curly brace literal. For example:

```javascript
Flurry.GLSaver.State = {
    /** @type {Flurry.Smoke} */
    smoke : new Flurry.Smoke();
};

var x = Flurry.GLSaver.State.smoke.oldPos;
```

WebStorm would recognize `oldPos` as a member in syntax coloring, but internally it did
not recognize the type of `.smoke` as `Flurry.Smoke`. This broke auto-complete and Go-To
Declaration, even with the `@type` JSDoc tag. However, doing this:

```javascript
Flurry.GLSaver.State = {};
/** @type {Flurry.Smoke} */
Flurry.GLSaver.State.smoke = new Flurry.Smoke();
```

Completely fixed it for me. Now auto-complete was properly working for `Flurry.GLSaver.
State.smoke.*`. I am not sure if I was using improper Javascript or JSDoc convention, or
if WebStorm has a bug. The code is a little less cleaner with this method, subjectively.

## Note 4

As I begin implementing the GL rendering code itself, I realize how much the C code is
relying on fixed-function OpenGL, which is now largely superseded and missing in webGL.

This means I will have to learn to write my own shaders, which will be an interesting
exercise. In the meantime, I will port the rest of the code not relying on GL.

## Note 3

I am now more familiar with AltiVec and its purpose. I am using [this guide](http://www.freescale.com/files/32bit/doc/ref_manual/ALTIVECPIM.pdf)
to figure out what the called AltiVec methods do and how to re-implement them in
javascript (if necessary).

## Note 2

Throughout the code, I have noticed that the screensaver can run in four "modes". Two
of which appear to work on C scalar arrays, the other two make use of AltiVec vectors
(IIRC AltiVec was relatively new to Macs at the time Flurry was written).

Because of the large amount of calculation and rendering code for each mode, I have
decided to only port code for the VECTOR_UNROLLED mode (VECTOR_SIMPLE is unused).

I will use the Javascript typed arrays feature (e.g. Float32Array) to provide these
vectors. I am assuming (with little understanding) that this will be the fastest.

## Note 1

I have decided to tackle the port by rewriting each C struct into its own js file, as
either JS prototype objects or static objects. I have started at Gl_saver.c as it
seems to hold the main logic for the screensaver.

When I run into code that requires a typedef, I implement it with all fields but
with stubbed methods until they are needed.

## Note 0

This personal project is for me to practice:

* WebGL & HTML5
* Porting code from one language to another
* Understanding what makes a C program
* Understanding somebody else's code

I will be keeping notes in this file as I go along porting Flurry from C to WebGL.