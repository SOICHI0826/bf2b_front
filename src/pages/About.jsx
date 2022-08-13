import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Box, Text } from '@chakra-ui/react';
import { css } from "@emotion/css";

export const About = () => {
  return (
     <Box display='flex' bg='#F5F5F5' w='100%' h='100%'>
        <Box className={styles.leftContainer}>
          <Sidebar />
        </Box>
        <Box className={styles.rightContainer} display='flex' flexDirection='column' w='100%'>
          <Header menu='about'/>
          <Box className={styles.newsContainer} ml='10%' mb='5%' bgColor='rgb(255, 230, 230, 0.3)' border='1px' borderColor='#000000' w='80%' h='70%'>
            <Text>About本文が来ます</Text>
          </Box>
          {/* もっと柔軟にFooterの位置に配置する */}
          <Footer />
        </Box>
     </Box>
  )
}

const styles ={
  rightContainer: css`
  `
}