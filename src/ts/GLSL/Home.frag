
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

varying vec2 vUv;
//varying vec3 vPos;
uniform sampler2D texture;
// Based on the example from
// https://www.shadertoy.com/view/Ml3SRf


#define PI 3.14159265359
#define TWO_PI 6.28318530718

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.54531237);
}

float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3. - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1. - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 4

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(10.0-vec2(u_time*0.2));
    mat2 rot = mat2(cos(0.1), sin(0.1),
                    -sin(0.1), cos(0.1));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 1.6+sin(u_time*0.2)*2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 st = vUv;

    vec3 color = vec3(0.);
    vec2 a = vec2(0.);
    vec2 b = vec2(0.);
    vec2 c = vec2(60.,800.);


     a.x = fbm( st);
    a.y = fbm( st + vec2(1.0));

    b.x = fbm( st + 3.*a);
    b.y = fbm( st);

    c.x = fbm( st + 7.0*b + vec2(0.7,.2)+ 0.215*u_time );
    c.y = fbm( st + 3.944*b + vec2(.3,12.8)+ 0.16*u_time);

    float f = fbm(st+b+c);

    color = mix(vec3(0.861,0.522,0.990), vec3(0.134,0.658,0.835), clamp((f*f),0.2, 1.0));
    color = mix(color, vec3(0.289,0.930,0.506), clamp(c.x,0.040, 0.208));
    float nx = noise(vec2(st.x*18.0,st.y+u_time*0.1))*0.1-0.05;
    float ny = noise(vec2(st.y*4.0,st.y+u_time*0.2))*0.1-0.05;
    vec4 textureColor = texture2D(texture,vec2(st.x+nx, st.y-ny-0.2));
    vec3 finalColor = vec3(f*1.5*color);
    // vec3 finalColor = vec3(st.y+f,f,st.x+f);
//
//    if(textureColor.a > 0.0)
//    {
    float _r = texture2D(texture,vec2(st.x+nx+0.08*(st.x-0.5), st.y-ny-0.2)).r;
    float _g = texture2D(texture,vec2(st.x+nx+0.09*(st.x-0.5), st.y-ny-0.2)).g;
    float _b = texture2D(texture,vec2(st.x+nx+0.1*(st.x-0.5), st.y-ny-0.2)).b;

        finalColor *= (vec3(_r,_g,_b) + vec3(0.2,ny,0.2));
//    }
    gl_FragColor = vec4(finalColor,1.0);


}