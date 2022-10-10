import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { Box, Text } from '@chakra-ui/react';
import { WebGL } from './WebGL';
import { css } from "@emotion/css";

export const About = () => {
  return (
    <Box className={styles.bg} display='flex' flexDirection='column' bg='#F5F5F5' w='100vw' h='100vh'>
        <Header menu='about'/>
            <Box className={styles.aboutContainer} mb='3vh' w='100vw' h='85vh'>
                <Box position='relative'>
                    <WebGL />
                </Box>
                <Text className={styles.title} as='b' fontSize='60px' position='absolute' top='50vh' left='45vw' color='#F5F5F5'>BF2B</Text>
            </Box>
        <Footer type='about'/>
    </Box>
  )
}

const styles ={
}