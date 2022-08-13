import { css } from "@emotion/css";
import { Text, Box, Button, Avatar } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
    const navigate = useNavigate();
    const handleNavLogin = () => {
        navigate('/login')
    }
    const handleNavSignup = () => {
        navigate('/signup')
    }
    return (
        <Box display='flex' bg='#F5F5F5' w='100wh' h='15%'>
            <Box className={styles.headerMenu} justifyContent='space-evenly' w='50%'>
                <Button size='lg' variant='link' ml='60px' bg='#F5F5F5'>About</Button>
                <Button size='lg' variant='link' bg='#F5F5F5' borderWidth='0px'>Works</Button>
                <Button size='lg' variant='link' bg='#F5F5F5' borderWidth='0px'>News</Button>
            </Box>
            <Box className={styles.status} justifyContent='right' w='50%'>
                <Avatar size='lg' mr='45px' bg='#E2E8F0'/>
                <Text mr='45px'>Welcome guest !</Text>
                <Button size='lg' mr='45px' bg='#1D71AD' color='white' onClick={handleNavLogin}>Login</Button>
                <Button size='lg' mr='200px' bg='#1D71AD' color='white' onClick={handleNavSignup}>Signup</Button>
            </Box>
        </Box>
    )
}

const styles = {
    headerMenu: css`
        width: 401px;
        height: 61px;
        display: flex;
        flexWrap: wrap;
        align-items: center;
        margin-top: 50px;
    `,
    status: css`
        width: 660px;
        height: 64px;
        display: flex;
        align-items: center;
        margin-top: 40px;
    `
}
