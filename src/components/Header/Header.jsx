import { css } from "@emotion/css";
import { Icon, Text, Box, Button, Avatar, Divider, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BiBulb, BiPalette, BiNews, BiCog} from "react-icons/bi";


export const Header = (props) => {
    const menu = props.menu;
    // propsで受け取る予定
    const isAdmin = true;
    const navigate = useNavigate();
    const handleIconButton = () => {
        navigate('/');
    }
    const handleNavAbout = () => {
        navigate('/about');
    }
    const handleNavMain = () => {
        navigate('/');
    }
    const handleNavNews = () => {
        navigate('/news');
    }
    const handleNavSettings = () => {
        navigate('/settings');
    }
    const handleNavLogin = () => {
        navigate('/login');
    }
    const handleNavSignup = () => {
        navigate('/signup');
    }
    return (
        <Box display='flex' bgColor='rgb(29, 113, 173, 0.6)' w='100vw' h='15%'>
            <Box className={styles.logo} w='10vw'>
                <Button variant='unstyled' bgColor='rgb(0, 0, 0, 0)' h='100%' onClick={handleIconButton}>
                    <Image src='/logo.png' />
                </Button>
            </Box>
            <Box className={styles.headerMenu} justifyContent='space-evenly' w='40vw'>
                <Box className={styles.about} display='flex'>
                    <Icon w={8} h={8} mt='1.5vh' mr='1vw' as={BiBulb} />
                    <Box className={styles.aboutButton} mb='10px' display='flex' flexDirection='column'>
                        {menu === 'about' &&
                        <Divider mb='10px' orientation='horizontal' borderColor="#FF5C96" borderWidth='3px' width='20px'/>
                        }
                        {menu !== 'about' &&
                        <Divider mb='10px' orientation='horizontal' borderColor="rgb(0, 0, 0, 0)" borderWidth='3px'/>
                        }
                        <Button fontSize='24px' size='lg' variant='link' bgColor='rgb(0, 0, 0, 0)' color='#000000' onClick={handleNavAbout}>About</Button>
                    </Box>
                </Box>
                <Box className={styles.works} display='flex'>
                    <Icon w={8} h={8} mt='1.5vh' mr='1vw' as={BiPalette} />
                    <Box className={styles.worksButton} mb='10px' display='flex' flexDirection='column'>
                        {menu === 'works' &&
                        <Divider mb='10px' orientation='horizontal' borderColor="#FF5C96" borderWidth='3px' width='20px'/>
                        }
                        {menu !== 'works' &&
                        <Divider mb='10px' orientation='horizontal' borderColor="rgb(0, 0, 0, 0)" borderWidth='3px'/>
                        }
                        <Button fontSize='24px' size='lg' variant='link' bgColor='rgb(0, 0, 0, 0)' color='#000000' borderWidth='0px' onClick={handleNavMain}>Works</Button>
                    </Box>
                </Box>
                <Box className={styles.news} display='flex'>
                    <Icon w={8} h={8} mt='1.5vh' mr='1vw' as={BiNews} />
                    <Box className={styles.newsButton} mb='10px' display='flex' flexDirection='column'>
                        {menu === 'news' &&
                        <Divider mb='10px' orientation='horizontal' borderColor="#FF5C96" borderWidth='3px' width='20px'/>
                        }
                        {menu !== 'news' &&
                        <Divider mb='10px' orientation='horizontal' borderColor="rgb(0, 0, 0, 0)" borderWidth='3px'/>
                        }
                        <Button fontSize='24px' size='lg' variant='link' bgColor='rgb(0, 0, 0, 0)' color='#000000' borderWidth='0px' onClick={handleNavNews}>News</Button>
                    </Box>
                </Box>
                {isAdmin &&
                    <Box className={styles.config} display='flex'>
                        <Icon w={8} h={8} mt='1.5vh' mr='1vw' as={BiCog} />
                        <Box className={styles.newsButton} mb='10px' display='flex' flexDirection='column'>
                            {menu === 'settings' &&
                            <Divider mb='10px' orientation='horizontal' borderColor="#FF5C96" borderWidth='3px' width='20px'/>
                            }
                            {menu !== 'settings' &&
                            <Divider mb='10px' orientation='horizontal' borderColor="rgb(0, 0, 0, 0)" borderWidth='3px'/>
                            }
                            <Button fontSize='24px' size='lg' variant='link' bgColor='rgb(0, 0, 0, 0)' color='#000000' borderWidth='0px' onClick={handleNavSettings}>Settings</Button>
                        </Box>
                    </Box>
                }
            </Box>
            <Box className={styles.status} ml='10vw' w='40vw' justifyContent='space-evenly'>
                {/* Loginしてたらボタンにして、プロフィール画面に遷移できるようにする */}
                <Avatar size='lg' bg='#1D71AD' borderColor='#000000' borderWidth='2px'/>
                <Text fontSize='20px' color='#000000'>Welcome guest !</Text>
                <Button size='lg' bg='#1D71AD' color='white' borderColor='#000000' borderWidth='2px' onClick={handleNavLogin}>Login</Button>
                <Button size='lg' bg='#1D71AD' color='white' borderColor='#000000' borderWidth='2px' onClick={handleNavSignup}>Signup</Button>
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
