## Note 3

I am now more familiar with AltiVec and its purpose. I am using [this guide](http://www.freescale.com/files/32bit/doc/ref_manual/ALTIVECPIM.pdf)
to figure out what the called AltiVec methods do and how to re-implement them in
javascript (if necessary).

## Note 2

Throughout the code, I have noticed that the screensaver can run in four "modes". Two
of which appear to work on C scalars, the other two make use of AltiVec vectors (IIRC
AltiVec was relatively new to Macs at the time Flurry was written).

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