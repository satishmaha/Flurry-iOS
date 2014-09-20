// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

Flurry.GLSaver = {};

(function(){
    var GLSaver = Flurry.GLSaver;

    GLSaver.OPT_MODE_SCALAR_BASE     = 0x0;
    GLSaver.OPT_MODE_SCALAR_FRSQRTE  = 0x1;
    GLSaver.OPT_MODE_VECTOR_SIMPLE   = 0x2;
    GLSaver.OPT_MODE_VECTOR_UNROLLED = 0x3;

})();