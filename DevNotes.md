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