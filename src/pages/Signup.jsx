import { Footer } from '../components/Footer/Footer';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Input, FormLabel, Box, Button, Heading, Center } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { css } from "@emotion/css";

export const Signup = () => {
  const navigate = useNavigate()
  const handleNavMain = () => {
    navigate('/')
  }
  return (
     <Box display='flex' bg='#F5F5F5' w='100%' h='100%'>
        <Box className={styles.leftContainer}>
          <Sidebar />
        </Box>
        <Box className={styles.rightContainer} w='100%'>
          <Box h='15%'></Box>
          <Box h='70%'>
            <Box ml='35%' border='1px' borderColor='#000000' borderRadius='5%' w='30%' h='580px'>
              <Heading mt='20%' as='h3' size='lg' fontSize='36px' textAlign='center'>Signup Form</Heading>
              <FormLabel ml='10%' mt='5%'>User ID</FormLabel>
              <Center>
                <Input placeholder='Please input userID' size='lg' w='70%' />
              </Center>
              <FormLabel ml='10%' mt='5%'>Password</FormLabel>
              <Center>
                <Input placeholder='Please input password' size='lg' w='70%'/>
              </Center>
              <Center>
              <Button mt='15%' size='lg' bg='#1D71AD' color='white' onClick={handleNavMain}>Signup</Button>
              </Center>
            </Box>
          </Box>
          <Footer />
        </Box>
     </Box>
  )
}

const styles ={
}