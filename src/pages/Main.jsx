import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { Thumbnail } from '../components/Thumbnail/Thumbnail';
import { Box, Select } from '@chakra-ui/react';
import { css } from "@emotion/css";

export const Main = () => {
  return (
     <Box className={styles.bg} display='flex' flexDirection='column' bg='#F5F5F5' w='100vw' h='100vh'>
        <Header menu='works'/>
        {/* <Box className={styles.pageInfo} display='flex'>
          <Select size='md' bg='#FFFFFF' borderWidth='1px' borderColor='#3182CE' w='20vw' h='5vh'>
            <option value='option1'>Date</option>
            <option value='option2'>Popularity</option>
          </Select>
        </Box> */}
        <Box className={styles.worksContainer} ml='12.5%' mt='15vh' mb='3vh' bgColor='rgb(255, 230, 230, 0.3)' border='1px' borderColor='#000000' w='75%' h='70%'>
          <Box className={styles.upperContainer} pt='20px' display='flex' justifyContent='space-evenly'>
            <Thumbnail title='nissan-gtr' route='/test'></Thumbnail>
            <Thumbnail title='nissan-gtr' route='/test'></Thumbnail>
            <Thumbnail title='nissan-gtr' route='/test'></Thumbnail>
          </Box>
          <Box className={styles.lowerContainer} pt='20px' display='flex' justifyContent='space-evenly'>
            <Thumbnail title='modelView' route='/modelView'></Thumbnail>
            <Thumbnail title='modelView' route='/modelView'></Thumbnail>
            <Thumbnail title='modelView' route='/modelView'></Thumbnail>
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