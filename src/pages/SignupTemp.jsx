import { Footer } from '../components/Footer/Footer';
import { Icon, Box, Button, Text, Heading, Center, Image, 
Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { css } from "@emotion/css";
import axios from 'axios';
import { AiOutlineMail, AiOutlineExclamationCircle } from 'react-icons/ai';
import { BiUserPin } from 'react-icons/bi';
import { BsKey, BsKeyFill} from 'react-icons/bs';
import { useSettings } from '../utils/commonSetting';
import { useAuth } from '../utils/authSettings';

export const SignupTemp = () => {
    // Username
    const [username, setUsername] = useState();
    // Email
    const [email, setEmail] = useState();
    // Password
    const [password, setPassword] = useState();
    // Modal制御用フラグ
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ exist, setExist ] = useState(false);
    // Modalに表示するメッセージ
    const [ errorMessage, setErrorMessage ] = useState('');
    // ユーザが入力したPWが入力規則に合致しているかどうか表現するフラグ
    const [isProperPW, setIsProperPW] = useState(true);
    // ユーザが入力した２つのPWが合致しているかどうか表現するフラグ
    const [isSamePW, setIsSamePW] = useState(true);

    const navigate = useNavigate();
    const settings = useSettings();
    const isHome = settings.isHome;
    let endpoint;
    if (isHome){
        endpoint = 'http://192.168.0.19:8000/users/signup';
    }else{
        endpoint = 'http://119.172.88.222:8000/users/signup';
    }
    const auth = useAuth();

    // Username入力があった際のハンドラ
    const handleOnChangeUsername = (e) => {
        if (!e.target.value) return;
        setUsername(e.target.value);
   }

    // メールアドレス入力があった際のハンドラ
    const handleOnChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    // 最初のPW入力があった際のハンドラ
    const handleOnChangePW1 = (e) => {
        setPassword(e.target.value);
        validationCheck(e.target.value);
    }

    // ２回目のPW入力があった際のハンドラ
    const handleOnChangePW2 = (e) => {
        isSameCheck(password, e.target.value);
    }

    // バリデーションチェッカー（大文字、小文字、数字、８桁以上）
    const validationCheck = (data) => {
        const re = /^(?=.*?[a-z])(?=.*[A-Z])(?=.*?[0-9])/;
        if (!re.test(data) || data.length < 8){
            setIsProperPW(false);
        }else{
            setIsProperPW(true);
        }
    }

    // パスワード確認（１回目と２回目）
    const isSameCheck = (pw1, pw2) => {
        if (pw1 !== pw2){
            setIsSamePW(false);
        }else{
            setIsSamePW(true);
        }
    }
    
    const handleOnSubmit = async() => {
        if (email === '' || password === '' || username === ''){
            setIsModalOpen(true);
            setErrorMessage('Please fill in all required fields(*).');
        }else if (!isProperPW) {
            setIsModalOpen(true);
            setErrorMessage('Password needs to be at least 8digits and include uppercase, lowercase and numbers');
        }else if (!isSamePW){
            setIsModalOpen(true);
            setErrorMessage('Passwords do not match.');
        }else{
            const data = {
                'email': email,
                'password': password,
                'username': username
            }
            console.log(data);
            axios.defaults.headers['Content-Type'] = 'application/json';
            await axios.post(endpoint, JSON.stringify(data))
            .then(res => {
                console.log(res);
                if (!res.data.is_dup){
                    // userId設定
                    auth.setUserId(res.data.user_id);
                    // username設定
                    auth.setUsername(username);
                    // admin設定
                    auth.setIsAdmin(res.data.is_admin);
                    // ログインステータス設定
                    auth.setIsLoggedIn(true);
                    // Mainページへ遷移
                    navigate('/');
                }else{
                    setIsModalOpen(true);
                    setErrorMessage('This email has already been registered.')
                    setExist(true);
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
        setExist(false);
    }

    const handleOnLogin = () => {
        navigate('/login');
    }

    return (
        <Box className={styles.bg} display='flex' flexDirection='column' justifyContent='center' bg='#F5F5F5' w='100vw' h='100vh'>
            <Box className={styles.signupForm} margin='0 auto' border='2px' borderColor='#1088AA' borderRadius='5%' w='35vw' h='85vh'>
                <Center className={styles.titleBox} mt='2vh'>
                    <Image src='/logo.png' />
                    <Heading as='h3' size='lg' fontSize='35px'>Signup Form</Heading>
                </Center>

                <Box className={styles.inputContainer} ml='5vw' position='relative' display='flex' flexDirection='column' w='25vw'>
                    <Box position='absolute' right='0' display='flex'>
                      <Text as='b' mt='0.5vh' mr='0.5vw' color='red'>*</Text>
                      <Text as='b' color='red'>: required</Text>
                    </Box>
                    {/* Username入力コンテナ */}
                    <Box className={styles.usernameInputOuter} mt='4vh'>
                        <Box className={styles.usernameInputTitle} display='flex'>
                            <Icon mr='1vw' w={6} h={6} as={ BiUserPin } />
                            <Heading fontSize='20px'>Username</Heading>
                            <Text as='b' color='red'>*</Text>
                        </Box>
                        <Box className={styles.nameInputInner} mt='1vh'>
                            <input className={styles.usernameInput} placeholder='  Username' required onChange={(e) => handleOnChangeUsername(e)}
                                style={{
                                    width: '25vw',
                                    height: '5vh',
                                    backgroundColor: '#F5F5F5',
                                    borderRadius: '5px',
                                    borderWidth: '2px',
                                    borderColor: '#BBBBBB'
                                }}
                            />
                        </Box>
                    </Box>

                    {/* メールアドレス入力エリア */}
                    <Box className={styles.emailInputOuter} mt='4vh'>
                        <Box className={styles.emailInputTitle} display='flex'>
                            <Icon mr='1vw' w={6} h={6} as={AiOutlineMail} />
                            <Heading fontSize='20px'>Email address</Heading>
                            <Text as='b' color='red'>*</Text>
                        </Box>
                        <Box className={styles.emailInputInner} mt='1vh'>
                            <input className={styles.usernameInput} placeholder='  bf2b@example.com' required onChange={(e) => handleOnChangeEmail(e)}
                                style={{
                                    width: '25vw',
                                    height: '5vh',
                                    backgroundColor: '#F5F5F5',
                                    borderRadius: '5px',
                                    borderWidth: '2px',
                                    borderColor: '#BBBBBB'
                                }}
                            />
                        </Box>
                    </Box>

                    {/* パスワード１回目入力エリア */}
                    <Box className={styles.pwInputOuter} mt='4vh'>
                        <Box className={styles.pwInputTitle} display='flex'>
                            <Icon mr='1vw' w={6} h={6} as={BsKey} />
                            <Heading fontSize='20px'>Password</Heading>
                            <Text as='b' color='red'>*</Text>
                        </Box>
                        <Box className={styles.pwInputInner} mt='1vh'>
                            <input className={styles.pwInput} placeholder='  Please input your password' type='password' required onChange={(e) => handleOnChangePW1(e)}
                                style={{
                                    width: '25vw',
                                    height: '5vh',
                                    backgroundColor: '#F5F5F5',
                                    borderRadius: '5px',
                                    borderWidth: '2px',
                                    borderColor: '#BBBBBB'
                                }}
                            />
                        </Box>
                    </Box>

                    {/* パスワード２回目入力エリア */}
                    <Box className={styles.pw2InputOuter} mt='4vh'>
                        <Box className={styles.pw2InputTitle} display='flex'>
                            <Icon mr='1vw' w={6} h={6} as={BsKeyFill} />
                            <Heading fontSize='20px'>Confirm Password</Heading>
                            <Text as='b' color='red'>*</Text>
                        </Box>
                        <Box className={styles.pw2InputInner} mt='1vh'>
                            <input className={styles.pw2Input} placeholder='  Please input your password again' type='password' required onChange={(e) => handleOnChangePW2(e)}
                                style={{
                                    width: '25vw',
                                    height: '5vh',
                                    backgroundColor: '#F5F5F5',
                                    borderRadius: '5px',
                                    borderWidth: '2px',
                                    borderColor: '#BBBBBB'
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
                {/* 提出ボタン */}
                <Center>
                    <Button mt='6vh' size='lg' bg='#1D71AD' color='white' onClick={handleOnSubmit}>Submit</Button>
                </Center>
          </Box>

          {/* Signupに失敗した際に表示するモーダル */}
          <Modal size='2xl' isOpen={isModalOpen} onClose={onModalClose}>
                <ModalOverlay />
                <ModalContent mt='35vh' bg='#FFF5F5' borderWidth='2px' borderColor='#AA0000'>
                    <ModalHeader color='#AA0000' display='flex'>
                        <Icon mr='1vw' w={8} h={8} as={AiOutlineExclamationCircle} />
                        <Heading fontSize='24px'>Signup Failure</Heading>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontSize='16px'>
                            { errorMessage }
                        </Text>
                        {/* ユーザのメールアドレスが登録されていない場合、サインアップページに誘導 */}
                        { exist &&
                            <Box mt='3vh' display='flex' h='8vh'>
                                <Text mt='1vh' mr='5vw' as='b'>---------------------------------&gt;</Text>
                                <Button size='lg' bg='#1D71AD' color='white' borderColor='#000000' borderWidth='2px' onClick={handleOnLogin}>Login</Button>
                            </Box>
                        }
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