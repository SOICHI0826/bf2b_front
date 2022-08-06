import { Footer } from '../components/Footer/Footer';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Box, Text, Heading } from '@chakra-ui/react';
import { css } from "@emotion/css";

export const WorkTemp = (props) => {
  const title = props.title;
  return (
     <Box display='flex' bg='#F5F5F5' w='100%' h='100%'>
        <Box className={styles.leftContainer}>
          <Sidebar />
        </Box>
        <Box className={styles.rightContainer} display='flex' flexDirection='column' w='100%'>
          <Box className={styles.titleArea} h='15%'>
            <Heading ml='10%' mt='3%' as='h2' size='xl'>{title}</Heading>
          </Box>
          <Box className={styles.workContainer} ml='10%' mb='5%' bgColor='#000000' w='80%' h='70%'>
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