// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

FastMath = {};

/**
 * Computes the distance from 0, 0 to x, y with ~3.5% error
 * @param x
 * @param y
 * @returns {number}
 */
FastMath.Dist2D = function (x, y)
{
    x = (x < 0) ? -x : x;
    y = (y < 0) ? -y : y;

    var mn = x < y ? x : y;
    return (x + y - (mn * 0.5) - (mn * 0.25) + (mn * 0.0625));
};