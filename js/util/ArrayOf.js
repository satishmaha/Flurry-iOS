// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/**
 * Creates an array wherein each element is an instance created from the given
 * prototype
 * @param {T} proto Prototype to make an array of elements with
 * @param {Number} count Number of elements
 * @return {Array.<T>} Array of elements, each of the given type
 * @template T
 */
var ArrayOf = function(proto, count)
{
    var array = new Array(count);

    for (var i = 0; i < count; i++)
        array[i] = Object.create(proto);

    return array;
};

/**
 * Creates an array wherein each element is an equivalent of an Vector4 unsigned
 * int vector
 * @param count
 * @returns {Uint16Array[]}
 */
ArrayOf.Vector4I = function(count)
{
    var array = new Array(count);

    for (var i = 0; i < count; i++)
        array[i] = Vector4I();

    return array;
};

/**
 * Creates an array wherein each element is an equivalent of an Vector4 float
 * vector
 * @param count
 * @returns {Float32Array[]}
 */
ArrayOf.Vector4F = function(count)
{
    var array = new Array(count);

    for (var i = 0; i < count; i++)
        array[i] = Vector4F();

    return array;
};