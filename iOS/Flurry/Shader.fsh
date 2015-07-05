precision highp float;
precision highp int;

varying vec4 vColor;
varying vec2 vUv;

uniform bool drawingRect;

uniform sampler2D uSampler;

void main()
{
    if (drawingRect)
        gl_FragColor = vColor;
    else
    {
        vec4 texel = texture2D(uSampler, vec2(vUv.s, vUv.t));
        
        gl_FragColor = vec4(texel) * vColor;
        if (gl_FragColor.a < 0.0)
            discard;
    }
}