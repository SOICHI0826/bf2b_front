import { useEffect } from 'react';
import { utils } from '../../../common/utils';
import { Program } from '../../../common/Program';
import { Scene } from '../../../common/Scene';
import { Clock } from '../../../common/Clock';
import { Floor } from '../../../common/Floor';
import { EventEmitter } from '../../../common/EventEmitter';
import { Camera } from '../../../common/Camera';
import { Light, LightsManager } from '../../../common/Light';
import { Controls } from '../../../common/Controls';
import { Transforms } from '../../../common/Transforms';
import { V_SHADER, F_SHADER } from './shader';
import * as mat4 from 'gl-matrix/mat4';
import { Box, Icon, Heading } from '@chakra-ui/react';
import { useSettings } from '../../../utils/commonSetting';
import { css } from '@emotion/css';
import { GiRetroController } from 'react-icons/gi';


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

    //fileServerのendpoint設定
    if (isHome){
      const fileServer = 'http://192.168.0.19/';
    }else{
      const fileServer = 'http://119.172.88.222/';
    }

    function init() {

    }
    
    //初期レンダリング後にinit開始
    useEffect(() => {
      init();
    }, [])

    // exportするDOM（View）
    return (

        <Box className={styles.mainContainer} display='flex' alignItems='flex-start' w='100vw'>

            {/* Workを含むBox */}
            <Box className={styles.work} mr='2.5vw' ml='2.5vw' w='60vw'>

                {/* WorkTitle */}
                <Box className={styles.workHeader} display='flex'>
                    <Icon w={8} h={8} mt='0.5vh' ml='1vw' mr='1vw'></Icon>
                    <Heading as='h2' mb='1vh'></Heading>
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
                </Box>

            </Box>

        </Box>
    )
}

const styles ={

}