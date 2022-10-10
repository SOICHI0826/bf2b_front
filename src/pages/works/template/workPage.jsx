import { Header } from '../../../components/Header/Header';
import { Footer } from '../../../components/Footer/Footer';
import { Box } from '@chakra-ui/react';
import { css } from "@emotion/css";
import { WebGL } from './wallSpot';

export const WorkTitle = () => {
  return (
     <Box className={styles.bg} display='flex' flexDirection='column' bg='#F5F5F5' w='100vw' h='100vh'>
          <Header menu='works'/>
          <Box className={styles.mainContainer} justifyContent='center' mt='5vh' w='100vw' h='75vh'>
            <WebGL />
          </Box>
          <Footer />
     </Box>
  )
}

const styles ={
    rightContainer: css`
  `
}