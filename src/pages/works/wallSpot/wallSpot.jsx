import { useEffect } from 'react';
import { utils } from '../../../common/utils';
import { Program } from '../../../common/Program';
import { Scene } from '../../../common/Scene';
import { Clock } from '../../../common/Clock';
import { Floor } from '../../../common/Floor';
import { Camera } from '../../../common/Camera';
import { Light, LightsManager } from '../../../common/Light';
import { Controls } from '../../../common/Controls';
import { Transforms } from '../../../common/Transforms';
import { sideMoveCtrl, rotateToggle } from '../../../common/Style';
import { V_SHADER, F_SHADER } from './shader';
import * as mat4 from 'gl-matrix/mat4';
import { Box, Button, Icon, Heading, Text, Radio, RadioGroup, Stack, Slider, SliderTrack, SliderFilledTrack, SliderMark, SliderThumb } from '@chakra-ui/react';
import { useSettings } from '../../../utils/commonSetting';
import { css } from '@emotion/css';
import { GiRetroController, GiFogLight } from 'react-icons/gi';
import { BiChevronDown } from 'react-icons/bi';

export const WebGL = () => {
    const settings = useSettings();
    const isHome = settings.isHome;
    //canvasサイズ設定
    const canvasWidth = Math.ceil(window.innerWidth * 0.6);
    const canvasHeight = Math.ceil(window.innerHeight * 0.6);

    const controllerStyles = {
        bg: '#ABABAB',
        titleColor: '#F0F0F0',
        textColor: '#555555'
    };
    
    let gl, canvas, scene, program, camera, transforms, clock, lights, fileServer, 
    rSideMoveCtrl, gSideMoveCtrl, bSideMoveCtrl,
    lightCutOff = 0.75,
    exponentFactor = 10,
    // lights data
    lightsData = [
        {
            id: 'redLight', name: 'Red Light',
            position: [0, 7, 3], diffuse: [1, 0, 0, 1], direction: [0, -2, -0.1]
        },
        {
            id: 'greenLight', name: 'Green Light',
            position: [2.5, 3, 3], diffuse: [0, 1, 0, 1], direction: [-0.5, 1, -0.1]
        },
        {
            id: 'blueLight', name: 'Blue Light',
            position: [-2.5, 3, 3], diffuse: [0, 0, 1, 1], direction: [0.5, 1, -0.1]
        },
    ]

    //fileServerのendpoint設定
    if (isHome){
        fileServer = 'http://192.168.0.19/';
    }else{
        fileServer = 'http://119.172.88.222/';
    }

    function configure(){
        canvas = utils.getCanvas('webgl-canvas');

        gl = utils.getGLContext(canvas);
        gl.clearColor(0.9, 0.9, 0.9, 1);
        gl.clearDepth(1);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendEquation(gl.FUNC_ADD);
        gl.depthFunc(gl.LEQUAL);

        program = new Program(gl, V_SHADER, F_SHADER);

        const attributes = [
            'aVertexPosition',
            'aVertexNormal',
            'aVertexColor'
        ];

        const uniforms = [
            'uProjectionMatrix',
            'uModelViewMatrix',
            'uNormalMatrix',
            'uWireframe',
            'uMaterialDiffuse',
            'uMaterialAmbient',
            'uLightAmbient',
            'uLightDiffuse',
            'uLightDirection',
            'uLightPosition',
            'uLightSource',
            'uCutOff',
            'uExponentFactor'
        ];

        program.load(attributes, uniforms);
        clock = new Clock();

        scene = new Scene(gl, program);

        camera = new Camera(Camera.ORBITING_TYPE);
        camera.goHome([0, 5, 30]);
        camera.setFocus([0, 0, 0]);
        camera.setAzimuth(0);
        camera.setElevation(-3);
        new Controls(camera, canvas);

        transforms = new Transforms(gl, program, camera, canvas);

        // 複数Lights管理オブジェクト定義
        lights = new LightsManager();

        lightsData.forEach(({id, position, diffuse, direction }) => {
            const light = new Light(id);
            light.setPosition(position);
            light.setDiffuse(diffuse);
            light.setProperty('direction', direction);
            lights.add(light);
        })

        gl.uniform3fv(program.uLightPosition, lights.getArray('position'));
        gl.uniform3fv(program.uLightDirection, lights.getArray('direction'));
        gl.uniform4fv(program.uLightDiffuse, lights.getArray('diffuse'));

        gl.uniform1f(program.uCutOff, lightCutOff);
        gl.uniform1f(program.uExponentFactor, exponentFactor);
        gl.uniform4fv(program.uLightAmbient, [1, 1, 1, 1]);
    }

    function load() {
        scene.add(new Floor(80, 2));
        scene.load(fileServer + 'wall.json', 'wall');
        lightsData.forEach(({ id }) => {
            scene.load(fileServer + 'sphere3.json', id);
        });
    }

    //描画関数
    function draw() {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        transforms.updatePerspective();

        try {
            scene.traverse(object => {
                transforms.calculateModelView();
                transforms.push();

                gl.uniform1i(program.uLightSource, false);

                const light = lightsData.find(({ id }) => object.alias === id);
                if (light) {
                    const { position, diffuse } = lights.get(light.id);
                    mat4.translate(transforms.modelViewMatrix, transforms.modelViewMatrix, position);
                    object.diffuse = diffuse;
                    gl.uniform1i(program.uLightSource, true);
                }

                transforms.setMatrixUniforms();
                transforms.pop();

                // Set light positions
                gl.uniform3fv(program.uLightPosition, lights.getArray('position'));
                gl.uniform4fv(program.uMaterialDiffuse, object.diffuse);
                gl.uniform4fv(program.uMaterialAmbient, object.ambient);
                gl.uniform1i(program.uWireframe, object.wireframe);

                gl.bindVertexArray(object.vao);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.ibo);

                if (object.wireframe){
                    gl.drawElements(gl.LINES, object.indices.length, gl.UNSIGNED_SHORT, 0);
                }else{
                    gl.drawElements(gl.TRIANGLES, object.indices.length, gl.UNSIGNED_SHORT, 0);
                }

                // Clean
                gl.bindVertexArray(null);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            })
        }
        catch (error) {
            console.error(error);
        }
    }

    function init() {
      configure();
      load();
      clock.on('tick', draw);
    }

    const onChangeCameraType = (val) => {
        if (val === 'Tracking') {
            camera = new Camera(Camera.TRACKING_TYPE);
        }else{
            camera = new Camera(Camera.ORBITING_TYPE);
        }
        camera.goHome([0, 5, 30]);
        camera.setFocus([0, 0, 0]);
        camera.setAzimuth(0);
        camera.setElevation(-3);
        new Controls(camera, canvas);
        transforms = new Transforms(gl, program, camera, canvas);
    }

    const handleOnRedSideMove = () => {
        rSideMoveCtrl.sideToggle();
        rotateToggle(document.getElementById('rChevron'));
    }

    const handleOnGreenSideMove = () => {
        gSideMoveCtrl.sideToggle();
        rotateToggle(document.getElementById('gChevron'));
    }

    const handleOnBlueSideMove = () => {
        bSideMoveCtrl.sideToggle();
        rotateToggle(document.getElementById('bChevron'));
    }

    //初期レンダリング後にinit開始
    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        rSideMoveCtrl = new sideMoveCtrl(document.getElementById('rTranslateCtrl'), '20vh', 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        gSideMoveCtrl = new sideMoveCtrl(document.getElementById('gTranslateCtrl'), '20vh', 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        bSideMoveCtrl = new sideMoveCtrl(document.getElementById('bTranslateCtrl'), '20vh', 300);
    }, [])

    // exportするDOM（View）
    return (

        <Box className={styles.mainContainer} display='flex' alignItems='flex-start' w='100vw'>

            {/* Workを含むBox */}
            <Box className={styles.work} mr='2.5vw' ml='2.5vw' w='60vw'>

                {/* WorkTitle */}
                <Box className={styles.workHeader} display='flex'>
                    <Icon w={8} h={8} mt='0.5vh' ml='1vw' mr='1vw' as={GiFogLight}></Icon>
                    <Heading as='h2' mb='1vh'>Wall SpotLight</Heading>
                </Box>

                {/* Workを表示するCanvas */}
                <canvas id='webgl-canvas' width={canvasWidth} height={canvasHeight}>
                    Your browser doesn't support the HTML5 canvas element
                </canvas>

            </Box>

            {/* ControllerBox */}
            <Box className={styles.controller} mr='2.5vw' w='32.5vw'>

                {/* ControllerTitle */}
                <Box className={styles.controllerTitle} display='flex' justifyContent='center'>
                    <Icon w={8} h={8} mr='1vw' as={GiRetroController} />
                    <Heading as='h2'>Controller</Heading> 
                </Box>

                 {/* Controller */}
                <Box className={styles.controller} bg={controllerStyles.bg} mt='1vh' pr='2vw' pl='2vw' h='60vh' borderRadius='2%' overflow='auto'>
                    {/* Camera Type選択ラジオボタン */}
                    <Box mt='2vh' mb='5vh'>
                        <Text as='b' fontSize='xl' color={controllerStyles.titleColor}>Camera Type</Text>
                        <RadioGroup mt='1vh' ml='1vw' onChange={(val) => onChangeCameraType(val)} defaultValue='Orbiting'>
                            <Stack direction='row'>
                                <Radio value='Tracking'>
                                    <Text as='b' color={controllerStyles.textColor}>TRACKING TYPE</Text>
                                </Radio>
                                <Radio value='Orbiting'>
                                <Text as='b' color={controllerStyles.textColor}>ORBITING TYPE</Text>
                                </Radio>
                            </Stack>
                        </RadioGroup>
                    </Box>

                    {/* 光源の位置座標設定用Ctrl */}
                    <Box mt='2vh' mb='5vh'>
                        <Text as='b' fontSize='xl' color={controllerStyles.titleColor}>Light Translate</Text>

                        {/* Red光源の位置座標設定用Ctrl */}
                        <Button mt='1vh' ml='1vw' position='relative' colorScheme='red' w='25vw' onClick={handleOnRedSideMove}>
                            <Icon id='rChevron' position='absolute' left='0' w={6} h={6} as={BiChevronDown} />
                            Red Light
                        </Button>
                        {/* SideCtrlで表示・非表示切り替えを行うBox */}
                        <Box id='rTranslateCtrl' mt='2vh' ml='3vw' w='21vw' display='none'>

                            {/* 光源X方向の位置座標設定用スライダー */}
                            <Box mb='3vh'>
                                <Text as='b' fontSize='md' color={controllerStyles.titleColor}>X</Text>
                                <Slider mt='1vh' ml='1vw' w='18vw' defaultValue={0} min={-15} max={15} step={1} onChange={(val) => {lights.list[0].position[0] = val}}>
                                    <SliderMark value={-15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>-15</Text>
                                    </SliderMark>
                                    <SliderMark value={0} mt='1vh' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>0</Text>
                                    </SliderMark>
                                    <SliderMark value={15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>15</Text>
                                    </SliderMark>
                                    <SliderTrack>
                                      <SliderFilledTrack bgColor='rgb(170, 30, 30, 0.5)'/>
                                    </SliderTrack>
                                    <SliderThumb />
                                </Slider>
                            </Box>

                            {/* 光源Y方向の位置座標設定用スライダー */}
                            <Box mb='3vh'>
                                <Text as='b' fontSize='md' color={controllerStyles.titleColor}>Y</Text>
                                <Slider mt='1vh' ml='1vw' w='18vw' defaultValue={0} min={-15} max={15} step={1} onChange={(val) => {lights.list[0].position[1] = val}}>
                                    <SliderMark value={-15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>-15</Text>
                                    </SliderMark>
                                    <SliderMark value={0} mt='1vh' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>0</Text>
                                    </SliderMark>
                                    <SliderMark value={15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>15</Text>
                                    </SliderMark>
                                    <SliderTrack>
                                      <SliderFilledTrack bgColor='rgb(170, 30, 30, 0.5)'/>
                                    </SliderTrack>
                                    <SliderThumb />
                                </Slider>
                            </Box>

                            {/* 光源Z方向の位置座標設定用スライダー */}
                            <Box mb='3vh'>
                                <Text as='b' fontSize='md' color={controllerStyles.titleColor}>Z</Text>
                                <Slider mt='1vh' ml='1vw' w='18vw' defaultValue={0} min={-15} max={15} step={1} onChange={(val) => {lights.list[0].position[2] = val}}>
                                    <SliderMark value={-15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>-15</Text>
                                    </SliderMark>
                                    <SliderMark value={0} mt='1vh' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>0</Text>
                                    </SliderMark>
                                    <SliderMark value={15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>15</Text>
                                    </SliderMark>
                                    <SliderTrack>
                                      <SliderFilledTrack bgColor='rgb(170, 30, 30, 0.5)'/>
                                    </SliderTrack>
                                    <SliderThumb />
                                </Slider>
                            </Box>

                        </Box>

                        {/* Green光源の位置座標設定用Ctrl */}
                        <Button mt='1vh' ml='1vw' position='relative' colorScheme='green' w='25vw' onClick={handleOnGreenSideMove}>
                            <Icon id='gChevron' position='absolute' left='0' w={6} h={6} as={BiChevronDown} />
                            Green Light
                        </Button>
                        {/* SideCtrlで表示・非表示切り替えを行うBox */}
                        <Box id='gTranslateCtrl' mt='2vh' ml='3vw' w='21vw' display='none'>

                            {/* 光源X方向の位置座標設定用スライダー */}
                            <Box mb='3vh'>
                                <Text as='b' fontSize='md' color={controllerStyles.titleColor}>X</Text>
                                <Slider mt='1vh' ml='1vw' w='18vw' defaultValue={0} min={-15} max={15} step={1} onChange={(val) => {lights.list[1].position[0] = val}}>
                                    <SliderMark value={-15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>-15</Text>
                                    </SliderMark>
                                    <SliderMark value={0} mt='1vh' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>0</Text>
                                    </SliderMark>
                                    <SliderMark value={15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>15</Text>
                                    </SliderMark>
                                    <SliderTrack>
                                      <SliderFilledTrack bgColor='rgb(30, 170, 30, 0.5)'/>
                                    </SliderTrack>
                                    <SliderThumb />
                                </Slider>
                            </Box>

                            {/* 光源Y方向の位置座標設定用スライダー */}
                            <Box mb='3vh'>
                                <Text as='b' fontSize='md' color={controllerStyles.titleColor}>Y</Text>
                                <Slider mt='1vh' ml='1vw' w='18vw' defaultValue={0} min={-15} max={15} step={1} onChange={(val) => {lights.list[1].position[1] = val}}>
                                    <SliderMark value={-15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>-15</Text>
                                    </SliderMark>
                                    <SliderMark value={0} mt='1vh' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>0</Text>
                                    </SliderMark>
                                    <SliderMark value={15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>15</Text>
                                    </SliderMark>
                                    <SliderTrack>
                                      <SliderFilledTrack bgColor='rgb(30, 170, 30, 0.5)'/>
                                    </SliderTrack>
                                    <SliderThumb />
                                </Slider>
                            </Box>

                            {/* 光源Z方向の位置座標設定用スライダー */}
                            <Box mb='3vh'>
                                <Text as='b' fontSize='md' color={controllerStyles.titleColor}>Z</Text>
                                <Slider mt='1vh' ml='1vw' w='18vw' defaultValue={0} min={-15} max={15} step={1} onChange={(val) => {lights.list[1].position[2] = val}}>
                                    <SliderMark value={-15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>-15</Text>
                                    </SliderMark>
                                    <SliderMark value={0} mt='1vh' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>0</Text>
                                    </SliderMark>
                                    <SliderMark value={15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>15</Text>
                                    </SliderMark>
                                    <SliderTrack>
                                      <SliderFilledTrack bgColor='rgb(30, 170, 30, 0.5)'/>
                                    </SliderTrack>
                                    <SliderThumb />
                                </Slider>
                            </Box>

                        </Box>

                        {/* Blue光源の位置座標設定用Ctrl */}
                        <Button mt='1vh' ml='1vw' position='relative' colorScheme='blue' w='25vw' onClick={handleOnBlueSideMove}>
                            <Icon id='bChevron' position='absolute' left='0' w={6} h={6} as={BiChevronDown} />
                            Blue Light
                        </Button>
                        {/* SideCtrlで表示・非表示切り替えを行うBox */}
                        <Box id='bTranslateCtrl' mt='2vh' ml='3vw' w='21vw' display='none'>

                            {/* 光源X方向の位置座標設定用スライダー */}
                            <Box mb='3vh'>
                                <Text as='b' fontSize='md' color={controllerStyles.titleColor}>X</Text>
                                <Slider mt='1vh' ml='1vw' w='18vw' defaultValue={0} min={-15} max={15} step={1} onChange={(val) => {lights.list[2].position[0] = val}}>
                                    <SliderMark value={-15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>-15</Text>
                                    </SliderMark>
                                    <SliderMark value={0} mt='1vh' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>0</Text>
                                    </SliderMark>
                                    <SliderMark value={15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>15</Text>
                                    </SliderMark>
                                    <SliderTrack>
                                      <SliderFilledTrack bgColor='rgb(30, 30, 250, 0.5)'/>
                                    </SliderTrack>
                                    <SliderThumb />
                                </Slider>
                            </Box>

                            {/* 光源Y方向の位置座標設定用スライダー */}
                            <Box mb='3vh'>
                                <Text as='b' fontSize='md' color={controllerStyles.titleColor}>Y</Text>
                                <Slider mt='1vh' ml='1vw' w='18vw' defaultValue={0} min={-15} max={15} step={1} onChange={(val) => {lights.list[2].position[1] = val}}>
                                    <SliderMark value={-15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>-15</Text>
                                    </SliderMark>
                                    <SliderMark value={0} mt='1vh' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>0</Text>
                                    </SliderMark>
                                    <SliderMark value={15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>15</Text>
                                    </SliderMark>
                                    <SliderTrack>
                                      <SliderFilledTrack bgColor='rgb(30, 30, 250, 0.5)'/>
                                    </SliderTrack>
                                    <SliderThumb />
                                </Slider>
                            </Box>

                            {/* 光源Z方向の位置座標設定用スライダー */}
                            <Box mb='3vh'>
                                <Text as='b' fontSize='md' color={controllerStyles.titleColor}>Z</Text>
                                <Slider mt='1vh' ml='1vw' w='18vw' defaultValue={0} min={-15} max={15} step={1} onChange={(val) => {lights.list[2].position[2] = val}}>
                                    <SliderMark value={-15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>-15</Text>
                                    </SliderMark>
                                    <SliderMark value={0} mt='1vh' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>0</Text>
                                    </SliderMark>
                                    <SliderMark value={15} mt='1vh' ml='-2.5' fontSize='sm'>
                                        <Text as='b' color={controllerStyles.textColor}>15</Text>
                                    </SliderMark>
                                    <SliderTrack>
                                      <SliderFilledTrack bgColor='rgb(30, 30, 250, 0.5)'/>
                                    </SliderTrack>
                                    <SliderThumb />
                                </Slider>
                            </Box>

                        </Box>
                    </Box>

                    {/* Light Cone Cut Off設定用スライダー */}
                    <Box mb='5vh'>
                        <Text as='b' fontSize='xl' color={controllerStyles.titleColor}>Light Cone Cut Off</Text>
                        <Slider mt='1vh' ml='1vw' w='25vw' defaultValue={lightCutOff} min={0} max={1} step={0.1} onChange={(val) => {gl.uniform1f(program.uCutOff, val)}}>
                            <SliderMark value={0} mt='1vh' ml='-2.5' fontSize='sm'>
                                <Text as='b' color={controllerStyles.textColor}>0</Text>
                            </SliderMark>
                            <SliderMark value={0.5} mt='1vh' ml='-2.5' fontSize='sm'>
                                <Text as='b' color={controllerStyles.textColor}>0.5</Text>
                            </SliderMark>
                            <SliderMark value={1} mt='1vh' ml='-2.5' fontSize='sm'>
                                <Text as='b' color={controllerStyles.textColor}>1</Text>
                            </SliderMark>
                            <SliderTrack>
                                <SliderFilledTrack bgColor='rgb(29, 113, 173, 0.8)'/>
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </Box>

                    {/* Exponent Factor設定用スライダー */}
                    <Box mb='5vh'>
                        <Text as='b' fontSize='xl' color={controllerStyles.titleColor}>Exponent Factor</Text>
                        <Slider mt='1vh' ml='1vw' w='25vw' defaultValue={exponentFactor} min={1} max={100} step={0.01} onChange={(val) => {gl.uniform1f(program.uExponentFactor, val)}}>
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

                </Box>

            </Box>

        </Box>
    )
}

const styles ={

}

