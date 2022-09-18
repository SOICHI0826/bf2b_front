import { Footer } from '../components/Footer/Footer';
import { Icon, Box, Button, Heading, Text, Center, Image,
Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { css } from "@emotion/css";
import { AiOutlineMail, AiOutlineExclamationCircle } from 'react-icons/ai';
import { BsKey } from 'react-icons/bs';
import { useState } from 'react';
import { useSettings } from '../utils/commonSetting';
import { useAuth } from '../utils/authSettings';
import axios from 'axios';
import { GiSettingsKnobs } from 'react-icons/gi';

export const Login = () => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    // Modal制御用フラグ
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ noExist, setNoExist ] = useState(false);
    // Modalに表示するエラーメッセージ
    const [ errorMessage, setErrorMessage ] = useState('');
    const navigate = useNavigate();
    const settings = useSettings();
    const isHome = settings.isHome;
    let endpoint;
    if (isHome){
        endpoint = 'http://192.168.0.19:8000/users/login';
    }else{
        endpoint = 'http://119.172.88.222:8000/users/login';
    }
    const auth = useAuth();

    const handleOnChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleOnChangePW = (e) => {
        setPassword(e.target.value);
    }

    const handleOnSubmit = async() => {
        if (email === '' || password === ''){
            setIsModalOpen(true);
            setErrorMessage('Please input your email and password correctly.');
        }else{
            const data = {
                'email' : email,
                'password': password
            }
            axios.defaults.headers['Content-Type'] = 'application/json';
            await axios.post(endpoint, JSON.stringify(data))
            .then(res => {
                if (res.data.status){
                    // userId設定
                    auth.setUserId(res.data.user_id);
                    // username設定
                    auth.setUsername(res.data.username);
                    // admin設定
                    auth.setIsAdmin(res.data.is_admin);
                    // ログインステータス設定
                    auth.setIsLoggedIn(true);
                    // ログイン成功フラグ設定
                    settings.setLoggedInSuccess(true);
                    // Mainページへ遷移
                    navigate('/')
                }else{
                    setIsModalOpen(true);
                    setErrorMessage(res.data.message);
                    if (res.data.message === 'Your mail address does not exist.'){
                        setNoExist(true);
                    }
                }
            })
            .catch(error => {
                setIsModalOpen(true);
                setErrorMessage(error.message);
            });
        }
    }

    const onModalClose = () => {
        setIsModalOpen(false);
        setNoExist(false);
    }

    // Signupボタンが押された際のハンドラ
    const handleOnSignup = () => {
        navigate('/signup');
    }

    return (
        <Box className={styles.bg} position='relative' display='flex' flexDirection='column' justifyContent='center' bg='#F5F5F5' w='100vw' h='100vh'>
            <Box className={styles.loginForm} margin='0 auto' border='2px' borderColor='#1088AA' borderRadius='5%' w='35vw' h='70vh'>
                <Center className={styles.titleBox} mt='5vh'>
                    <Image src='/logo.png' />
                    <Heading as='h3' size='lg' fontSize='40px'>Login Form</Heading>
                </Center>
                <Box className={styles.emailInputTitle} ml='5vw' mt='5vh' display='flex'>
                    <Icon mr='1vw' w={6} h={6} as={AiOutlineMail} />
                    <Heading fontSize='20px'>Email</Heading>
                </Box>
                <Center mt='2vh'>
                    <input className={styles.emailInput} placeholder='  bf2b@example.com' required onChange={(e) => handleOnChangeEmail(e)}
                        style={{
                            width: '25vw',
                            height: '5vh',
                            backgroundColor: '#F5F5F5',
                            borderRadius: '5px',
                            borderWidth: '2px',
                            borderColor: '#BBBBBB'
                        }}
                    />
                </Center>
                <Box className={styles.pwInputTitle} ml='5vw' mt='5vh' display='flex'>
                    <Icon mr='1vw' w={6} h={6} as={BsKey} />
                    <Heading fontSize='20px'>Password</Heading>
                </Box>
                <Center mt='2vh'>
                    <input className={styles.pwInput} placeholder='  Please input your password' type='password' required onChange={(e) => handleOnChangePW(e)}
                        style={{
                            width: '25vw',
                            height: '5vh',
                            backgroundColor: '#F5F5F5',
                            borderRadius: '5px',
                            borderWidth: '2px',
                            borderColor: '#BBBBBB'
                        }}
                    />
                </Center>
                <Center>
                    <Button mt='8vh' size='lg' bg='#1D71AD' color='white' onClick={handleOnSubmit}>Login</Button>
                </Center>
            </Box>
            
            {/* Loginに失敗した際に表示するモーダル */}
            <Modal size='2xl' isOpen={isModalOpen} onClose={onModalClose}>
                <ModalOverlay />
                <ModalContent mt='35vh' bg='#FFF5F5' borderWidth='2px' borderColor='#AA0000'>
                    <ModalHeader color='#AA0000' display='flex'>
                        <Icon mr='1vw' w={8} h={8} as={AiOutlineExclamationCircle} />
                        <Heading fontSize='24px'>Login Failure</Heading>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display='flex' h='8vh'>
                            <Text mt='1vh' fontSize='16px'>
                                { errorMessage }
                            </Text>
                            {/* ユーザのメールアドレスが登録されていない場合、サインアップページに誘導 */}
                            { noExist &&
                                <>
                                    <Text mt='1vh' ml='3vw' mr='3vw' as='b'>-----------------&gt;</Text>
                                    <Button size='lg' bg='#1D71AD' color='white' borderColor='#000000' borderWidth='2px' onClick={handleOnSignup}>Signup</Button>
                                </>
                            }
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
    
          <Box className={styles.Footer}>
              <Footer />
          </Box>
        </Box>
    )
}

const styles ={
}