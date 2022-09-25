import { useEffect } from 'react';
import { utils } from '../../../common/utils';
import { Program } from '../../../common/Program';
import { Scene } from '../../../common/Scene';
import { Clock } from '../../../common/Clock';
import { Axis } from '../../../common/Axis';
import { Floor } from '../../../common/Floor';
import { V_SHADER, F_SHADER } from './shader';
import * as mat4 from "gl-matrix/mat4";
import * as vec3 from "gl-matrix/vec3";
import { Text, Icon, Heading, Box, Radio, RadioGroup, Stack, Slider, SliderTrack, SliderFilledTrack, SliderMark, SliderThumb} from '@chakra-ui/react';
import { useSettings } from '../../../utils/commonSetting';
import { GiRetroController } from 'react-icons/gi';
import { BiCameraMovie } from 'react-icons/bi';
import { css } from "@emotion/css";

export const WebGL = () => {
  const settings = useSettings();
  const isHome = settings.isHome;
  // canvasサイズを絶対値で指定するために、ビューポートの半分のサイズを計算
  // canvasは相対値で指定できなかったため
  const canvasWidth = Math.ceil(window.innerWidth * 0.6);
  const canvasHeight= Math.ceil(window.innerHeight * 0.6);

  const controllerStyles = {
    bg: '#ABABAB',
    titleColor: '#F0F0F0',
    textColor: '#555555'
  };
  
  let
  fileServer, gl, scene, program, clock,
  WORLD_COORDINATES = 'World Coordinates',
  CAMERA_COORDINATES = 'Camera Coordinates',
  coordinates = WORLD_COORDINATES,
  home = [0, -2, -50],
  position = [0, -2, -50],
  rotation = [0, 0, 0],
  cameraMatrix = mat4.create(),
  modelViewMatrix = mat4.create(),
  projectionMatrix = mat4.create(),
  normalMatrix = mat4.create();

  function configure() {
    // Configure `canvas`
    const canvas = utils.getCanvas('webgl-canvas');
    
    // Set ModelServer IP
    if (isHome){
      fileServer = 'http://192.168.0.19/';
    }
    else{
      fileServer = 'http://119.172.88.222/';
    }

    // Configure `gl`
    gl = utils.getGLContext(canvas);
    gl.clearColor(0.9, 0.9, 0.9, 1);
    gl.clearDepth(100);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // Configure `clock` which we can subscribe to on every `tick`.
    // We will discuss this in a later chapter, but it's simply a way to
    // abstract away the `requestAnimationFrame` we have been using.
    clock = new Clock();

    // Configure `program`
    program = new Program(gl, V_SHADER, F_SHADER);

    // Uniforms to be set
    const uniforms = [
      'uProjectionMatrix',
      'uModelViewMatrix',
      'uNormalMatrix',
      'uMaterialDiffuse',
      'uLightAmbient',
      'uLightDiffuse',
      'uLightPosition',
      'uWireframe'
    ];

    // Attributes to be set
    const attributes = [
      'aVertexPosition',
      'aVertexNormal',
      'aVertexColor'
    ];

    // Load uniforms and attributes
    program.load(attributes, uniforms);

    // Configure `scene`. We will discuss this in a later chapter, but
    // this is a simple way to add objects into our scene, rather than
    // maintaining sets of global arrays as we've done in previous chapters.
    scene = new Scene(gl, program);

    // Configure lights
    gl.uniform3fv(program.uLightPosition, [0, 120, 120]);
    gl.uniform4fv(program.uLightAmbient, [0.20, 0.20, 0.20, 1]);
    gl.uniform4fv(program.uLightDiffuse, [1, 1, 1, 1]);

    initTransforms();
  }

  // Load objects into our `scene`
  function load() {
    scene.add(new Floor(80, 2));
    scene.add(new Axis(82));
    scene.load(fileServer+'cone3.json', 'cone');
  }

  // Initialize the necessary transforms
  function initTransforms() {
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, home);

    mat4.identity(cameraMatrix);
    mat4.invert(modelViewMatrix, cameraMatrix);

    mat4.identity(projectionMatrix);

    mat4.identity(normalMatrix);
    mat4.copy(normalMatrix, modelViewMatrix);
    mat4.invert(normalMatrix, normalMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
  }

  // Update transforms
  function updateTransforms() {
    mat4.perspective(projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 1000);

    if (coordinates === WORLD_COORDINATES) {
      mat4.identity(modelViewMatrix);
      mat4.translate(modelViewMatrix, modelViewMatrix, position);
      mat4.rotateX(modelViewMatrix, modelViewMatrix, rotation[0] * Math.PI / 180);
      mat4.rotateY(modelViewMatrix, modelViewMatrix, rotation[1] * Math.PI / 180);
      mat4.rotateZ(modelViewMatrix, modelViewMatrix, rotation[2] * Math.PI / 180);
    }
    else {
      mat4.identity(cameraMatrix);
      mat4.translate(cameraMatrix, cameraMatrix, position);
      mat4.rotateX(cameraMatrix, cameraMatrix, rotation[0] * Math.PI / 180);
      mat4.rotateY(cameraMatrix, cameraMatrix, rotation[1] * Math.PI / 180);
      mat4.rotateZ(cameraMatrix, cameraMatrix, rotation[2] * Math.PI / 180);
    }
  }

  // Set the matrix uniforms
  function setMatrixUniforms() {
    if (coordinates === WORLD_COORDINATES) {
      mat4.invert(cameraMatrix, modelViewMatrix);
      gl.uniformMatrix4fv(program.uModelViewMatrix, false, modelViewMatrix);
    }
    else {
      mat4.invert(modelViewMatrix, cameraMatrix);
    }

    gl.uniformMatrix4fv(program.uProjectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(program.uModelViewMatrix, false, modelViewMatrix);
    mat4.transpose(normalMatrix, cameraMatrix);
    gl.uniformMatrix4fv(program.uNormalMatrix, false, normalMatrix);
  }

  function draw() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    try {
      updateTransforms();
      setMatrixUniforms();

      // Iterate over every object in the scene
      scene.traverse(object => {
        gl.uniform4fv(program.uMaterialDiffuse, object.diffuse);
        gl.uniform1i(program.uWireframe, object.wireframe);

        // Bind
        gl.bindVertexArray(object.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.ibo);

        // Draw
        if (object.wireframe) {
          gl.drawElements(gl.LINES, object.indices.length, gl.UNSIGNED_SHORT, 0);
        }
        else {
          gl.drawElements(gl.TRIANGLES, object.indices.length, gl.UNSIGNED_SHORT, 0);
        }

        // Clean
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      });
    }
    catch (error) {
      console.error(error);
    }
  }

  function init() {
    configure();
    load();
    clock.on('tick', draw);
    initControls();
  }

  function initControls(){
    clock.on('tick', () => {
      const matrix = (coordinates === WORLD_COORDINATES) ? modelViewMatrix : cameraMatrix;
      matrix.forEach((data, i) => {
        document.getElementById(`m${i}`).innerText = data.toFixed(1);
      });
    });
  }

  const setCoordinate = (val) => {
    coordinates = val;
  }

  const setTranslateX = (val) => {
    position[0] = val;
  }

  const setTranslateY = (val) => {
    position[1] = val;
  }

  const setTranslateZ = (val) => {
    position[2] = val;
  }
  
  const setRotateX = (val) => {
    rotation[0] = val;
  }

  const setRotateY = (val) => {
    rotation[1] = val;
  }

  const setRotateZ = (val) => {
    rotation[2] = val;
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <Box className={styles.mainContainer} display='flex' alignItems='flex-start' w='100vw'>
      {/* position=relative/absoluteで座標を重畳表示 */}
      <Box className={styles.workCanvas} position='relative' w='60vw'>
        <Box className={styles.workHeader} display='flex'>
          <Icon w={8} h={8} mt='0.5vh' ml='1vw' mr='1vw' as={BiCameraMovie} />
          <Heading as='h2' mb='1vh'>ModelView</Heading>
          {/* <Button className={styles.likeButton} position='absolute' variant='unstyled' top='1vh' right='1vw' bgColor='rgb(0, 0, 0, 0)' onClick={onLikeButton}>
            {isLike===true &&
              <Icon w={8} h={8} as={AiOutlineLike} color='#FE9999'/>
            }
            {isLike===false &&
              <Icon w={8} h={8} as={AiOutlineLike} />
            }
          </Button> */}
        </Box>
        <canvas id="webgl-canvas" width={canvasWidth} height={canvasHeight}>
            Your browser doesn't support the HTML5 canvas element
        </canvas>
        <div className={styles.info}>
            <p className={styles.matrixTitle} id="coordinates">World Coordinates</p>
            <table className={styles.matrix}>
              <tbody>
                <tr>
                  <td className={styles.matrixContent} id="m0"></td>
                  <td className={styles.matrixContent} id="m4"></td>
                  <td className={styles.matrixContent} id="m8"></td>
                  <td className={styles.matrixContent} id="m12"></td>
                </tr>
                <tr>
                  <td className={styles.matrixContent} id="m1"></td>
                  <td className={styles.matrixContent} id="m5"></td>
                  <td className={styles.matrixContent} id="m9"></td>
                  <td className={styles.matrixContent} id="m13"></td>
                </tr>
                <tr>
                  <td className={styles.matrixContent} id="m2"></td>
                  <td className={styles.matrixContent} id="m6"></td>
                  <td className={styles.matrixContent} id="m10"></td>
                  <td className={styles.matrixContent} id="m14"></td>
                </tr>
                <tr>
                  <td className={styles.matrixContent} id="m3"></td>
                  <td className={styles.matrixContent} id="m7"></td>
                  <td className={styles.matrixContent} id="m11"></td>
                  <td className={styles.matrixContent} id="m15"></td>
                </tr>
              </tbody>
            </table>
          </div>
      </Box>

      <Box className={styles.workController} mr='2.5vw' w='32.5vw'>

        <Box className={styles.controllerTitle} display='flex' justifyContent='center'>
          <Icon w={8} h={8} mr='1vw' as={GiRetroController} />
          <Heading as='h2'>Controller</Heading> 
        </Box>

        <Box className={styles.controller} bg={controllerStyles.bg} mt='1vh' pr='2vw' pl='2vw' h='60vh' borderRadius='2%' overflow='auto'>
          <Box mt='2vh' mb='5vh'>
            <Text as='b' fontSize='xl' color={controllerStyles.titleColor}>Coordinate</Text>
            <RadioGroup mt='1vh' ml='1vw' onChange={(val) => setCoordinate(val)} defaultValue='World Coordinates'>
              <Stack direction='row'>
                <Radio value='World Coordinates'>
                  <Text as='b' color={controllerStyles.textColor}>World Coordinates</Text>
                </Radio>
                <Radio value='Camera Coordinates'>
                <Text as='b' color={controllerStyles.textColor}>Camera Coordinates</Text>
                </Radio>
              </Stack>
            </RadioGroup>
          </Box>

          <Box mb='5vh'>
            <Text as='b' fontSize='xl' color={controllerStyles.titleColor}>TranslateX</Text>
            <Slider mt='1vh' ml='1vw' w='25vw' defaultValue={0} min={-100} max={100} step={1} onChange={(val) => setTranslateX(val)}>
              <SliderMark value={-100} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>-100</Text>
              </SliderMark>
              <SliderMark value={0} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>0</Text>
              </SliderMark>
              <SliderMark value={100} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>100</Text>
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack bgColor='rgb(29, 113, 173, 0.8)'/>
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>

          <Box mb='5vh'>
            <Text as='b' fontSize='xl' color={controllerStyles.titleColor}>TranslateY</Text>
            <Slider mt='1vh' ml='1vw' w='25vw' defaultValue={-2} min={-100} max={100} step={1} onChange={(val) => setTranslateY(val)}>
              <SliderMark value={-100} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>-100</Text>
              </SliderMark>
              <SliderMark value={0} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>0</Text>
              </SliderMark>
              <SliderMark value={100} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>100</Text>
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack bgColor='rgb(29, 113, 173, 0.8)'/>
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>

          <Box mb='5vh'>
            <Text as='b' fontSize='xl' color={controllerStyles.titleColor}>TranslateZ</Text>
            <Slider mt='1vh' ml='1vw' w='25vw' defaultValue={50} min={-100} max={100} step={1} onChange={(val) => setTranslateZ(val)}>
              <SliderMark value={-100} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>-100</Text>
              </SliderMark>
              <SliderMark value={0} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>0</Text>
              </SliderMark>
              <SliderMark value={100} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>100</Text>
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack bgColor='rgb(29, 113, 173, 0.8)'/>
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>

          <Box mb='5vh'>
            <Text as='b' fontSize='xl' color={controllerStyles.titleColor}>RotateX</Text>
            <Slider mt='1vh' ml='1vw' w='25vw' defaultValue={0} min={-180} max={180} step={1} onChange={(val) => setRotateX(val)}>
              <SliderMark value={-180} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>-180°</Text>
              </SliderMark>
              <SliderMark value={0} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>0°</Text>
              </SliderMark>
              <SliderMark value={180} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>180°</Text>
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack bgColor='rgb(29, 113, 173, 0.8)'/>
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>

          <Box mb='5vh'>
            <Text as='b' fontSize='xl' color={controllerStyles.titleColor}>RotateY</Text>
            <Slider mt='1vh' ml='1vw' w='25vw' defaultValue={0} min={-180} max={180} step={1} onChange={(val) => setRotateY(val)}>
              <SliderMark value={-180} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>-180°</Text>
              </SliderMark>
              <SliderMark value={0} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>0°</Text>
              </SliderMark>
              <SliderMark value={180} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>180°</Text>
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack bgColor='rgb(29, 113, 173, 0.8)'/>
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>

          <Box mb='5vh'>
            <Text as='b' fontSize='xl' color={controllerStyles.titleColor}>RotateZ</Text>
            <Slider mt='1vh' ml='1vw' w='25vw' defaultValue={0} min={-180} max={180} step={1} onChange={(val) => setRotateZ(val)}>
              <SliderMark value={-180} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>-180°</Text>
              </SliderMark>
              <SliderMark value={0} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>0°</Text>
              </SliderMark>
              <SliderMark value={180} mt='1vh' ml='-2.5' fontSize='sm'>
                <Text as='b' color={controllerStyles.textColor}>180°</Text>
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack bgColor='rgb(29, 113, 173, 0.8)'/>
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>

        </Box>
      </Box>
    </Box>
  )
}

const styles ={
    workCanvas: css`
        margin-left: 2.5vw;
        margin-right: 2.5vw;
  `,
    info: css`
        position: absolute;
        bottom: 0;
        left: 0;
        border: 1px solid #444444;
        border-radius: 5px;
        background: black;
  `,
    matrix: css`
        border: 1px dashed white;
        margin: 10px;
  `,
    matrixTitle: css`
        color: white;
  `,
    matrixContent: css`
        font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
        font-style: normal;
        font-variant: normal;
        color: white;
        padding: 5px 15px;
  `
}