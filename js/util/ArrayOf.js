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
ArrayOf = function(proto, count)
{
    var array = new Array(count);

    for (var i = 0; i < count; i++)
        array[i] = Object.create(proto);

    return array;
};

/**
 * Creates an array wherein each element is an equivalent of an AltiVec unsigned
 * int vector
 * @param count
 * @returns {Uint16Array[]}
 */
ArrayOf.AltiVecUInt = function(count)
{
    var array = new Array(count);

    for (var i = 0; i < count; i++)
        array[i] = AltiVecInt();

    return array;
};

/**
 * Creates an array wherein each element is an equivalent of an AltiVec float
 * vector
 * @param count
 * @returns {Float32Array[]}
 */
ArrayOf.AltiVecFloat = function(count)
{
    var array = new Array(count);

    for (var i = 0; i < count; i++)
        array[i] = AltiVecFloat();

    return array;
};