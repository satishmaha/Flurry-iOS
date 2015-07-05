precision highp float;
precision highp int;

attribute vec2 position;
attribute vec4 color;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec4 vColor;
varying vec2 vUv;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0, 1.0);

    vColor = color;
    vUv    = uv;
}