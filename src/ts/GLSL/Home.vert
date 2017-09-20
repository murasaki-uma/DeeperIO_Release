//varying vec3 vPos;
varying vec2 vUv;
void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
//    vPos = position;
    vUv = uv;
    gl_Position = projectionMatrix * mvPosition;
}