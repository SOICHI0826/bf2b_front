import { useEffect } from 'react';
import { utils } from '../..//common/utils';
import { Program } from '../..//common/Program';
import { V_SHADER, F_SHADER } from './shader';
import * as mat4 from 'gl-matrix/mat4';
import * as vec3 from 'gl-matrix/vec3';
import * as vec4 from 'gl-matrix/vec4';
import { css } from '@emotion/css';

export const WebGL = () => {
    //canvasサイズ設定
    const canvasWidth = Math.ceil(window.innerWidth);
    const canvasHeight = Math.ceil(window.innerHeight * 0.85);
    const w = window.innerWidth;
    console.log(canvasHeight);

    // create sphere point cloud
    const spherePointCloud = (nPoints) => {
        let points = [];
        for (let i = 0; i < nPoints; i++){
            const r = () => Math.random() - 0.5; // -.5 <= r <= .5
            const inputPoint = [r(), r(), r()];
            const outputPoint = vec3.normalize(vec3.create(), inputPoint);
            points.push(...outputPoint);
        }
        return points;
    }

    let gl, program, pointsBuffer, spherePoints, canvas, userPointsBuffer,
    userPoints = [],
    modelMatrix = mat4.create(),
    viewMatrix = mat4.create(),
    projectionMatrix = mat4.create(),
    modelInvertMatrix = mat4.create(),
    viewInvertMatrix = mat4.create(),
    projectionInvertMatrix = mat4.create(),
    mvInvertMatrix = mat4.create(),
    mvpInvertMatrix = mat4.create(),
    rayDirection = vec3.create(),
    pos = vec4.create(),
    out = vec4.create(),
    impactFactor = 2.0,
    x = 0;
    

    function configure() {
        canvas = utils.getCanvas('webgl-canvas');
        gl = utils.getGLContext(canvas);
        gl.clearColor(0.2, 0.2, 0.2, 1);
        gl.clearDepth(100);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        program = new Program(gl, V_SHADER, F_SHADER);
        const uniforms = [
            'uModelMatrix',
            'uViewMatrix',
            'uProjectionMatrix',
            'uModelInvertMatrix',
            'uViewInvertMatrix',
            'uProjectionInvertMatrix',
            'uInputNDC',
            'uRayDirection',
            'uImpactFactor'
        ];

        const attributes = [
            'aVertexPosition'
        ];

        program.load(attributes, uniforms);

        spherePoints = spherePointCloud(1e5);
        pointsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spherePoints), gl.STATIC_DRAW);

        // userPointsBuffer = gl.createBuffer();
        
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    //イベントリスナ設定
    function onEventListener () {
        // canvas.addEventListener('mousemove', e => {
        //     mat4.rotateY(modelMatrix, modelMatrix, (e.offsetX - x) * 0.001);
        //     x = e.offsetX;
        // })

        canvas.addEventListener('mousedown', e => {
            const x = e.x;
            const y = window.innerHeight - e.y;
            impactFactor = 2.0;
            gl.uniform4fv(program.uInputNDC, [(2 * x)/w - 1, (2 * y)/canvasHeight - 1, -1, 1]);
            // vec4.set(pos, (2 * x)/w - 1, (2 * y)/canvasHeight - 1, -1, 1)
            // mat4.multiply(mvInvertMatrix, modelInvertMatrix, viewInvertMatrix);
            // mat4.multiply(mvpInvertMatrix, mvInvertMatrix, projectionInvertMatrix);
            // vec4.transformMat4(out, pos, mvpInvertMatrix);
            // out[2] = 0;
            // console.log('clickPosition', pos);
            // console.log('reProjection', out);
            // userPoints.push(...out.slice(0, 3));
            // gl.bindBuffer(gl.ARRAY_BUFFER, userPointsBuffer);
            // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(userPoints), gl.STATIC_DRAW);
        })
    }

    function initUniforms() {
        // projectionMatrix
        mat4.perspective(projectionMatrix, 75 * Math.PI / 180, gl.canvas.width / gl.canvas.height, 0.1, 1e3);
        mat4.invert(projectionInvertMatrix, projectionMatrix);
        gl.uniformMatrix4fv(program.uProjectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(program.uProjectionInvertMatrix, false, projectionInvertMatrix);
       
        // modelMatrixを単位行列に初期化
        mat4.translate(modelMatrix, modelMatrix, [0, 0, 0]);

        // viewMatrix
        // ①バーチャルカメラ位置にviewMatrixを並行移動
        mat4.translate(viewMatrix, viewMatrix, [0.0, 0, 2.0]);
        // ②バーチャルカメラ位置の移動の逆をviewMatrixとする（世界を動かす）
        mat4.invert(viewMatrix, viewMatrix);
        mat4.invert(viewInvertMatrix, viewMatrix);
        gl.uniformMatrix4fv(program.uViewMatrix, false, viewMatrix);
        gl.uniformMatrix4fv(program.uViewInvertMatrix, false, viewInvertMatrix);

        // rayDirection
        vec3.set(rayDirection, 0.0, 0.0, 1.0);
        gl.uniform3fv(program.uRayDirection, rayDirection);

    }

    function updateUniforms() {
        // Transform関連のUniform属性更新
        // modelMatrixを更新（最初に頂点座標に影響するので、純粋にオブジェクトをどう動かしたいか）
        mat4.rotateY(modelMatrix, modelMatrix, 0.001);
        mat4.invert(modelInvertMatrix, modelMatrix);
        gl.uniformMatrix4fv(program.uModelMatrix, false, modelMatrix);
        gl.uniformMatrix4fv(program.uModelInvertMatrix, false, modelInvertMatrix);

        // Transform以外のUniform属性更新
        gl.uniform1f(program.uImpactFactor, impactFactor);
    }

    function draw() {
        requestAnimationFrame(draw);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        updateUniforms();

        gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
        gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(program.aVertexPosition);

        gl.drawArrays(gl.POINTS, 0, spherePoints.length / 3);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        if (impactFactor >= -2.0){
            impactFactor -= 0.01;
        }else{
            impactFactor += 0.01;
        }

        // gl.bindBuffer(gl.ARRAY_BUFFER, userPointsBuffer);
        // gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(program.aVertexPosition);

        // gl.drawArrays(gl.POINTS, 0, userPoints.length / 3);
        // gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
    }

    function init() {
        // 初期設定
        configure();
        // イベントリスナ設定
        onEventListener();
        // Uniform属性初期化
        initUniforms();
        // 描画
        draw();
    }

    //初期レンダリング後にinit開始
    useEffect(() => {
        init();
    }, [])

    // exportするDOM（View）
    return (
        <canvas id='webgl-canvas' width={canvasWidth} height={canvasHeight}>
            Your browser doesn't support the HTML5 canvas element
        </canvas>   
    )
}

const styles ={

}