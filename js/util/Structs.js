// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/**
 * Defines a 3 float vector in 3D space
 * @param {number=} [x=0]
 * @param {number=} [y=0]
 * @param {number=} [z=]
 * @constructor
 */
var Vector3 = function (x, y, z)
{
    /** @type {number} */
    this.x = x | 0.0;
    /** @type {number} */
    this.y = y | 0.0;
    /** @type {number} */
    this.z = z | 0.0;

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

/**
 * Defines a 4 float color in RGBA space
 * @param {number=0} r
 * @param {number=0} g
 * @param {number=0} b
 * @param {number=1} a
 * @constructor
 */
var Color = function (r, g, b, a)
{
    this.r = r | 0.0;
    this.g = g | 0.0;
    this.b = b | 0.0;
    this.a = a | 1.0;
};

