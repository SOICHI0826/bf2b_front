export const V_SHADER = `#version 300 es
precision mediump float;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelInvertMatrix;
uniform mat4 uViewInvertMatrix;
uniform mat4 uProjectionInvertMatrix;
uniform vec4 uInputNDC;
uniform vec3 uRayDirection;
uniform float uImpactFactor;
in vec3 aVertexPosition;
out vec3 vColor;

float rnd(vec2 p){
    return 0.5 * fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}

float norm2(vec2 p){
    return sqrt(pow(p.x, 2.0) + pow(p.y, 2.0));
}

float norm3(vec3 p){
    return sqrt(pow(p.x, 2.0) + pow(p.y, 2.0) + pow(p.z, 2.0));
}

void main() {
    // 3D空間に再投影した座標を用いた方法(不良設定：奥行きは未定)
    // vec4 homoPoint = uModelInvertMatrix * uViewInvertMatrix * uProjectionInvertMatrix * uInputNDC;
    // vec3 point = vec3(homoPoint.xy, 0.0);
    // vec3 q = aVertexPosition - point;
    // float dis = length(cross(uRayDirection, q)) / length(uRayDirection);
    // if (q.x <= 0.01){
    //     vColor = vec3(0.0, 0.5, 0.8);
    //     vec3 newVertex = aVertexPosition + uImpactFactor * aVertexPosition;
    //     gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(newVertex, 1.0);
    // }else{
    //     vColor = vec3(1.0, 0.7, 0.8);
    //     gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
    // }
    // vColor = vec3(1.0, 0.7, 0.8);
    // gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(point, 1.0);
    // gl_PointSize = 3.0;

    // レンダリング後の座標を用いた方法(良設定：画面上での距離なので深度は関与してこない)
    // vec4 vertex = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
    // vec2 sub = vertex.xy - uInputNDC.xy;
    // vColor = vec3(0.0, abs(sub.x), abs(sub.y));
    // gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
    // if (norm2(sub) <= 0.2){
    //     vColor = vec3(0.0, 0.5, 0.8);
    //     gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
    // }else{
    //     vColor = vec3(1.0, 0.7, 0.8);
    //     gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
    // }

    // InputNDCの描画
    // gl_Position = vec4(uInputNDC.xyz, 1.0);
    // vColor = vec3(1.0, 0.7, 0.8);
    // gl_PointSize = 3.0;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
    vColor = vec3(1.0, 0.7, 0.8);
}`;

export const F_SHADER = `#version 300 es
precision mediump float;

in vec3 vColor;
out vec4 fragColor;

void main(){
    fragColor = vec4(vColor, 1);
}`;