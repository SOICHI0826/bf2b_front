import { useEffect } from 'react';
import { utils } from '../../../common/utils';
import { V_SHADER, F_SHADER } from './shader';
import * as mat4 from "gl-matrix/mat4";
import { useSettings } from '../../../utils/adminSetting';

export const WebGL = () => {
  // canvasサイズを絶対値で指定するために、ビューポートの半分のサイズを計算
  // canvasは相対値で指定できなかったため
  const canvasWidth = Math.ceil(window.innerWidth * 0.5);
  const canvasHeight= Math.ceil(window.innerHeight * 0.5);

  const settings = useSettings();
  const isHome = settings.isHome;

  let gl,
  fileServer,
  program,
  parts = [],
  projectionMatrix = mat4.create(),
  modelViewMatrix = mat4.create();

  function initProgram() {
    // Retrieve shaders based on the shader script IDs
    const vertexShader = utils.getShader(gl, 'vertex', V_SHADER);
    const fragmentShader = utils.getShader(gl, 'fragment', F_SHADER);

    if (isHome){
      fileServer = 'http://192.168.0.19/';
    }
    else{
      fileServer = 'http://119.172.88.222/';
    }

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
    }

    gl.useProgram(program);

    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    program.uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
    program.uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
  }

  function load() {
    for (let i = 1; i < 179; i++) {
      fetch(fileServer + `/nissan-gtr/part${i}.json`)
      .then(res => res.json())
      // eslint-disable-next-line no-loop-func
      .then(data => {
        // Create a VAO
        const vao = gl.createVertexArray();

        // Bind VAO
        gl.bindVertexArray(vao);

        // VBO
        const vertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertices), gl.STATIC_DRAW);

        // Configure instructions
        gl.enableVertexAttribArray(program.aVertexPosition);
        gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        // IBO
        const indexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);

        // Attach them for later access
        data.vao = vao;
        data.ibo = indexBufferObject;

        // Push data onto parts array
        parts.push(data);

        // Clean
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      })
      .catch(console.error);
    }
  }

  function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // We will discuss these operations in later chapters
    mat4.perspective(projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 10, 10000);
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, [-10, 0, -100]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, 30 * Math.PI / 180, [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, 30 * Math.PI / 180, [0, 1, 0]);

    gl.uniformMatrix4fv(program.uProjectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(program.uModelViewMatrix, false, modelViewMatrix);

    // Iterate over every part inside of the `parts` array
    parts.forEach(part => {
      // Bind
      gl.bindVertexArray(part.vao);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, part.ibo);

      // Draw
      gl.drawElements(gl.LINES, part.indices.length, gl.UNSIGNED_SHORT, 0);

      // Clean
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    });
  }

  function render() {
    requestAnimationFrame(render);
    draw();
  }
  
  function init() {
    const canvas = utils.getCanvas('webgl-canvas');
    // Retrieve a valid WebGL2 context
    gl = utils.getGLContext(canvas);
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    initProgram();
    // We are no longer blocking the render until `load` has resolved,
    // as we're not returning a Promise.
    load();
    render();
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <>
      <canvas id="webgl-canvas" width={canvasWidth} height={canvasHeight}>
        Your browser doesn't support the HTML5 canvas element
      </canvas>
    </>
  )
}
