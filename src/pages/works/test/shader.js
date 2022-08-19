export const V_SHADER=` #version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

in vec3 aVertexPosition;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`;
export const F_SHADER=`#version 300 es
precision mediump float;

out vec4 fragColor;

void main(void) {
  fragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;