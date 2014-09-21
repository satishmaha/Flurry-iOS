// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/**
 * Defines a 3 float vector in 3D space
 * @param {number=} [x=0]
 * @param {number=} [y=0]
 * @param {number=} [z=0]
 * @constructor
 */
var Vector3 = function(x, y, z)
{
    /** @type {Float32Array} */
    this.array = new Float32Array([x || 0, y || 0, z || 0]);

    /**
     * Makes a copy of this vector
     * @returns {Vector3}
     */
    this.makeCopy = function()
    {
        return new Vector3(this.x, this.y, this.z);
    };

    /**
     * Returns a delta vector from given vector to this one
     * @param {Vector3} from
     * @param {number} [mag=1]
     * @returns {Vector3}
     */
    this.delta = function(from, mag)
    {
        mag = mag || 1;
        return new Vector3(
            (from.x - this.x) * mag,
            (from.y - this.y) * mag,
            (from.z - this.z) * mag
        );
    };
};

/** @type {number} */
Object.defineProperty(Vector3.prototype, "x", {
    /** @this Vector3 */
    get: function() { return this.array[0]; }
});
/** @type {number} */
Object.defineProperty(Vector3.prototype, "y", {
    /** @this Vector3 */
    get: function() { return this.array[1]; }
});
/** @type {number} */
Object.defineProperty(Vector3.prototype, "z", {
    /** @this Vector3 */
    get: function() { return this.array[2]; }
});


/**
 * Defines a 4 float color in RGBA space
 * @param {number=} [r=0]
 * @param {number=} [g=0]
 * @param {number=} [b=0]
 * @param {number=} [a=1]
 * @constructor
 */
var Color = function (r, g, b, a)
{
    this.r = r | 0.0;
    this.g = g | 0.0;
    this.b = b | 0.0;
    this.a = a | 1.0;
};

/**
 * Creates an equivalent of a 4 value unsigned int vector either from scratch, an
 * existing vector or an initial value
 * @param {Uint16Array|Float32Array|number=} [value=0]
 * @returns {Uint16Array}
 */
Vector4I = function(value)
{
    if (value instanceof Uint16Array || value instanceof Float32Array)
        return new Uint16Array(value);
    else
        return value
            ? new Uint16Array([value, value, value, value])
            : new Uint16Array(4);
};

/**
 * Creates an equivalent of a 4 value float vector either from scratch, an existing
 * vector or an initial value
 * @param {Uint16Array|Float32Array|number=} [value=0]
 * @returns {Float32Array}
 */
Vector4F = function(value)
{
    if (value instanceof Uint16Array || value instanceof Float32Array)
        return new Float32Array(value);
    else
        return value
            ? new Float32Array([value, value, value, value])
            : new Float32Array(4);
};