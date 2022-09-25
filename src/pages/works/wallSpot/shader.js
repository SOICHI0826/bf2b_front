export const V_SHADER = `#version 300 es
precision mediump float;

const int numLights = 3;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition[numLights];
uniform vec3 uLightDirection[numLights];

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

out vec3 vNormal[numLights];
out vec3 vLightRay[numLights];

void main(void) {
  vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);
  vec3 normal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));

  for(int i = 0; i < numLights; i++) {
    vec4 positionLight = uModelViewMatrix * vec4(uLightPosition[i], 1.0);
    vec3 directionLight = vec3(uNormalMatrix * vec4(uLightDirection[i], 1.0));
    vNormal[i] = normal - directionLight;
    vLightRay[i] = vertex.xyz - positionLight.xyz;
  }

  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}`;
export const F_SHADER = `#version 300 es
precision mediump float;

const int numLights= 3;

uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform bool uWireframe;
uniform bool uLightSource;
uniform float uCutOff;
uniform float uExponentFactor;
uniform vec4 uLightAmbient;
uniform vec3 uLightDirection[numLights];
uniform vec4 uLightDiffuse[numLights];

in vec3 vNormal[numLights];
in vec3 vLightRay[numLights];

out vec4 fragColor;

void main(void) {
  if (uWireframe || uLightSource) {
    fragColor = uMaterialDiffuse;
  }
  else {
    vec4 Ia = uLightAmbient * uMaterialAmbient;
    vec4 finalColor = vec4(0.0, 0.0, 0.0, 1.0);

    vec3 L = vec3(0.0);
    vec3 N = vec3(0.0);
    float lambertTerm = 0.0;

    for(int i = 0; i < numLights; i++) {
      L = normalize(vLightRay[i]);
      N = normalize(vNormal[i]);
      lambertTerm	= dot(N, -L);
      finalColor += uLightDiffuse[i] * uMaterialDiffuse * pow(lambertTerm, uExponentFactor * uCutOff);
    }

    fragColor = vec4(vec3(finalColor), 1.0);
  }
}`;