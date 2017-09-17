void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 tmpPos = texture2D( texturePosition, uv );
    //tmpPos.x += 0.5;
    vec3 pos = tmpPos.xyz;
    gl_FragColor = vec4( pos, 1.0 );
}