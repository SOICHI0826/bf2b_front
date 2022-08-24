import { Footer } from '../components/Footer/Footer';
import { Input, FormLabel, Box, Button, Heading, Center, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { css } from "@emotion/css";

export const Signup = () => {
  const navigate = useNavigate()
  const handleNavMain = () => {
    navigate('/')
  }
  return (
    <Box className={styles.bg} display='flex' flexDirection='column' justifyContent='center' bg='#F5F5F5' w='100vw' h='100vh'>
        <Box className={styles.loginForm} margin='0 auto' border='1px' borderColor='#000000' borderRadius='5%' w='30vw' h='60vh'>
            <Center className={styles.titleBox} mt='10%'>
                <Image src='/logo.png'/>
                <Heading as='h3' size='lg' fontSize='30px'>Signup Form</Heading>
            </Center>
            <FormLabel ml='10%' mt='5%'>User ID</FormLabel>
            <Center>
                <Input placeholder='Please input userID' size='lg' w='70%' />
            </Center>
            <FormLabel ml='10%' mt='5%'>Password</FormLabel>
            <Center>
                <Input placeholder='Please input password' size='lg' w='70%'/>
            </Center>
            <Center>
                <Button mt='10%' size='lg' bg='#1D71AD' color='white' onClick={handleNavMain}>Signup</Button>
            </Center>
        </Box>
        <Box className={styles.Footer} mt='5vh'>
            <Footer />
        </Box>
    </Box>
  )
}

const styles ={
}