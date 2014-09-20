// By Roy Curtis
// Based off original code from https://github.com/calumr/flurry

/**
 * Computes the distance from 0, 0 to x, y with ~3.5% error
 * @param x
 * @param y
 * @returns {number}
 */
Math.fastDist2D = function(x, y)
{
    x = (x < 0) ? -x : x;
    y = (y < 0) ? -y : y;

    var mn = x < y ? x : y;
    return (x + y - (mn * 0.5) - (mn * 0.25) + (mn * 0.0625));
};

Math.randFlt = function(min, max)
{
    return (min + (max - min) * Math.random());
}

Math.randBell = function(scale)
{
    return (scale * (1.0 - ( Math.random() + Math.random() + Math.random() ) / 1.5));
}
