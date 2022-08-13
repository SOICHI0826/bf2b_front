import { css } from "@emotion/css";
import { Text, Box, Button, Avatar, Divider } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Header = (props) => {
    const menu = props.menu;
    const navigate = useNavigate();
    const handleNavAbout = () => {
        navigate('/about')
    }
    const handleNavMain = () => {
        navigate('/')
    }
    const handleNavNews = () => {
        navigate('/news')
    }
    const handleNavLogin = () => {
        navigate('/login')
    }
    const handleNavSignup = () => {
        navigate('/signup')
    }
    return (
        <Box display='flex' bg='#F5F5F5' w='100wh' h='15%'>
            <Box className={styles.headerMenu} justifyContent='space-evenly' w='50%'>
                <Box className={styles.aboutButton} mb='10px' display='flex' flexDirection='column'>
                    {menu === 'about' &&
                    <Divider ml='60px' mb='10px' orientation='horizontal' borderColor="#FFA3A3" borderWidth='3px' width='20px'/>
                    }
                    {menu !== 'about' &&
                    <Divider ml='60px' mb='10px' orientation='horizontal' borderColor="#F5F5F5" borderWidth='3px'/>
                    }
                    <Button size='lg' variant='link' ml='60px' bg='#F5F5F5' onClick={handleNavAbout}>About</Button>
                </Box>
                <Box className={styles.worksButton} mb='10px' display='flex' flexDirection='column'>
                    {menu === 'works' &&
                    <Divider mb='10px' orientation='horizontal' borderColor="#FFA3A3" borderWidth='3px' width='20px'/>
                    }
                    {menu !== 'works' &&
                    <Divider mb='10px' orientation='horizontal' borderColor="#F5F5F5" borderWidth='3px'/>
                    }
                    <Button size='lg' variant='link' bg='#F5F5F5' borderWidth='0px' onClick={handleNavMain}>Works</Button>
                </Box>
                <Box className={styles.newsButton} mb='10px' display='flex' flexDirection='column'>
                    {menu === 'news' &&
                    <Divider mb='10px' orientation='horizontal' borderColor="#FFA3A3" borderWidth='3px' width='20px'/>
                    }
                    {menu !== 'news' &&
                    <Divider mb='10px' orientation='horizontal' borderColor="#F5F5F5" borderWidth='3px'/>
                    }
                    <Button size='lg' variant='link' bg='#F5F5F5' borderWidth='0px' onClick={handleNavNews}>News</Button>
                </Box>
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
