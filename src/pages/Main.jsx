import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Thumbnail } from '../components/Thumbnail/Thumbnail';
import { Box } from '@chakra-ui/react';
import { css } from "@emotion/css";

export const Main = () => {
  return (
     <Box display='flex' bg='#F5F5F5' w='100%' h='100%'>
        <Box className={styles.leftContainer}>
          <Sidebar />
        </Box>
        <Box className={styles.rightContainer} display='flex' flexDirection='column' w='100%'>
          <Header />
          <Box className={styles.worksContainer} ml='10%' mb='5%' bgColor='rgb(255, 230, 230, 0.3)' border='1px' borderColor='#000000' w='80%' h='70%'>
            <Box className={styles.upperContainer} pt='20px' display='flex' justifyContent='space-evenly'>
              <Thumbnail title='テスト'></Thumbnail>
              <Thumbnail title='テスト'></Thumbnail>
              <Thumbnail title='テスト'></Thumbnail>
            </Box>
            <Box className={styles.lowerContainer} pt='20px' display='flex' justifyContent='space-evenly'>
              <Thumbnail title='テスト'></Thumbnail>
              <Thumbnail title='テスト'></Thumbnail>
              <Thumbnail title='テスト'></Thumbnail>
            </Box>
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