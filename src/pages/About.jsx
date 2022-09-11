import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { Box, Text } from '@chakra-ui/react';
import { css } from "@emotion/css";

export const About = () => {
  return (
    <Box className={styles.bg} display='flex' flexDirection='column' bg='#F5F5F5' w='100vw' h='100vh'>
    <Header menu='about'/>
    <Box className={styles.aboutContainer} ml='12.5%' mt='10vh' mb='3vh' bgColor='rgb(255, 230, 230, 0.3)' border='1px' borderColor='#000000' w='75%' h='70%'>
      <Text>About本文</Text>
    </Box>
    <Footer />
 </Box>
  )
}

const styles ={
  rightContainer: css`
  `
}