import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Box, Text } from '@chakra-ui/react';
import { css } from "@emotion/css";

export const News = () => {
  return (
    <Box className={styles.bg} display='flex' flexDirection='column' bg='#F5F5F5' w='100vw' h='100vh'>
    <Header menu='news'/>
    <Box className={styles.worksContainer} ml='12.5%' mt='10vh' mb='3vh' bgColor='rgb(255, 230, 230, 0.3)' border='1px' borderColor='#000000' w='75%' h='70%'>
      <Text>News本文</Text>
    </Box>
    <Footer />
 </Box>
  )
}

const styles ={
  rightContainer: css`
  `
}