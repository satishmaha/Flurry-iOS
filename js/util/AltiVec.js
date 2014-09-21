// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/**
 * The global object and namespace for JS implementations of AltiVec methods.
 *
 * Note: In the real world, AltiVec maps to SIMD instructions. As such, this javascript
 * implementation will most likely never even be as fast or efficient as using the actual
 * instructions themselves.
 * @seealso http://www.freescale.com/files/32bit/doc/ref_manual/ALTIVECPIM.pdf
 * @type {object}
 */
var AltiVec = {};

/**
 * Creates an equivalent of an AltiVec unsigned int vector either from scratch, an
 * existing vector or an initial value
 * @param {Uint16Array|Float32Array|number=} [value=0]
 * @returns {Uint16Array}
 */
AltiVec.int = function(value)
{
    if (value instanceof Uint16Array || value instanceof Float32Array)
        return new Uint16Array(value);
    else
        return value
            ? new Uint16Array([value, value, value, value])
            : new Uint16Array(4);
};

/**
 * Creates an equivalent of an AltiVec float vector either from scratch, an existing
 * vector or an initial value
 * @param {Uint16Array|Float32Array|number=} [value=0]
 * @returns {Float32Array}
 */
AltiVec.float = function(value)
{
    if (value instanceof Uint16Array || value instanceof Float32Array)
        return new Float32Array(value);
    else
        return value
            ? new Float32Array([value, value, value, value])
            : new Float32Array(4);
};

/**
 * Takes an element from a given vector and index. Returns a new vector wherein each
 * value is the same as that element.
 * @example ([0,0.1,0.112,0.3], 2) -> [0.112,0.112,0.112,0.112]
 * @param {Uint16Array|Float32Array} vec
 * @param {number} idx
 * @param {boolean=} [float=true] Return float vector, else int vector
 * @returns {Uint16Array|Float32Array}
 */
AltiVec.splat = function(vec, idx, float)
{
    return float
        ? AltiVec.float(vec[idx])
        : AltiVec.int(vec[idx]);
};

/**
 * Creates an int vector using a u32 int as initial value
 * @param value
 * @returns {Uint16Array}
 */
AltiVec.splat_u32 = function(value)
{
    return AltiVec.int(4294967296 * Math.sign(value) + value);
};

/**
 * Takes an int vector and divides each element by 2^-b. Returns the result.
 * @param {Uint16Array} a
 * @param {int} b
 * @returns {Float32Array}
 */
AltiVec.ctf = function(a, b)
{
    var d = AltiVec.float();

    for (var i = 0; i < 3; i++)
        d[i] = a[i] * Math.pow(2, -b);

    return d;
};

/**
 * Each element of a given vector is multiplied with the same element of a second vector,
 * then added with the same element of a third vector. Returns the resulting vector.
 * @param {Uint16Array|Float32Array} a
 * @param {Uint16Array|Float32Array} b
 * @param {Uint16Array|Float32Array} c
 * @returns {Uint16Array|Float32Array}
 */
AltiVec.madd = function(a, b, c)
{
    var d = AltiVec.float();

    for (var i = 0; i < 3; i++)
        d[i] = a[i] * b[i] + c[i];

    return d;
};