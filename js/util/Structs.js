// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/**
 * Defines a 3 float vector in 3D space
 * @param {number=0} x
 * @param {number=0} y
 * @param {number=0} z
 * @constructor
 */
Vector3 = function (x, y, z)
{
    this.x = x | 0.0;
    this.y = y | 0.0;
    this.z = z | 0.0;
}

/**
 * Defines a 4 float color in RGBA space
 * @param {number=0} r
 * @param {number=0} g
 * @param {number=0} b
 * @param {number=1} a
 * @constructor
 */
Color = function (r, g, b, a)
{
    this.r = r | 0.0;
    this.g = g | 0.0;
    this.b = b | 0.0;
    this.a = a | 1.0;
}

/**
 * Creates an equivalent of an AltiVec unsigned int vector
 * @returns {Uint16Array}
 */
AltiVecInt = function()
{
    return new Uint16Array(4);
};

/**
 * Creates an equivalent of an AltiVec float vector
 * @returns {Float32Array}
 */
AltiVecFloat = function()
{
    return new Float32Array(4);
};