import { Header } from '../../../components/Header/Header';
import { Footer } from '../../../components/Footer/Footer';
import { Box, Heading } from '@chakra-ui/react';
import { css } from "@emotion/css";
import { WebGL } from './Test';

export const TestTemp = (props) => {
  const title = 'TestWork';
  return (
     <Box className={styles.bg} display='flex' flexDirection='column' bg='#F5F5F5' w='100vw' h='100vh'>
          <Header menu='works'/>
          <Box className={styles.mainContainer} justifyContent='center' mt='3vh' mb='3vh' w='75%' h='70%'>
              <Heading as='h2' ml='20vw' mt='5vh' mb='5vh'>{title}</Heading>
              <Box className={styles.workContainer} ml='25vw' bgColor='#a0a0a0' w='50vw' h='50vh'>
                  <WebGL />
              </Box> 
          </Box>
          <Footer />
     </Box>
  )
}

const styles ={
  rightContainer: css`
  `
}