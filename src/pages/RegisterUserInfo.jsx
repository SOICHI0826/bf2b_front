import { Footer } from '../components/Footer/Footer';
import { Icon, Box, Button, Text, Heading, Center, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BiUserPin, BiCake, BiWorld } from 'react-icons/bi';
import { css } from "@emotion/css";
import { years, months, days, countries} from '../utils/Options';
import axios from 'axios';
import { useSettings } from '../utils/commonSetting';
import { useAuth } from '../utils/authSettings';

export const RegisterUserInfo = () => {
    // Username
    const [username, setUsername] = useState();
    // Birthday
    const [year, setYear] = useState();
    const [month, setMonth] = useState();
    const [day, setDay] = useState();
    // Country
    const [country, setCountry] = useState();

    const navigate = useNavigate();
    const settings = useSettings();
    const isHome = settings.isHome;
    let endpoint;
    if (isHome){
        endpoint = 'http://192.168.0.19:8000/users/signup/info';
    }else{
        endpoint = 'http://119.172.88.222:8000/users/signup/info';
    }
    const auth = useAuth();

    // Username入力があった際のハンドラ
    const handleOnChangeUsername = (e) => {
        if (!e.target.value) return;
        setUsername(e.target.value);
    }

    // Yearが選択された際のハンドラ
    const handleOnChangeYear = (e) => {
        if (!e.target.value) return;
        setYear(e.target.value);
    }

    // Monthが選択された際のハンドラ
    const handleOnChangeMonth = (e) => {
        if (!e.target.value) return;
        setMonth(e.target.value);
    }

    // Dayが選択された際のハンドラ
    const handleOnChangeDay = (e) => {
        if (!e.target.value) return;
        setDay(e.target.value);
    }

    // Countryが選択された際のハンドラ
    const handleOnChangeCountry = (e) => {
        if (!e.target.value) return;
        setCountry(e.target.value);
    }

    const handleOnSubmit = async() => {
        const data = {
            'user_id': auth.userId,
            'username': username,
            'birthday': year+month+day,
            'country': country
        }
        axios.defaults.headers['Content-Type'] = 'application/json';
        const res = await axios.post(endpoint, JSON.stringify(data));
        auth.setUsername(username);
        navigate('/')
    }

    return (
        <Box className={styles.bg} display='flex' flexDirection='column' justifyContent='center' bg='#F5F5F5' w='100vw' h='100vh'>
            <Box className={styles.loginForm} margin='0 auto' border='2px' borderColor='#1088AA' borderRadius='5%' w='40vw' h='80vh'>
                <Center className={styles.titleBox} mt='2vh'>
                    <Image src='/logo.png' />
                    <Heading as='h3' size='lg' fontSize='35px'>Your Information</Heading>
                </Center>

                {/* Username入力コンテナ */}
                <Box className={styles.usernameInputOuter} mt='5vh' ml='2.5vw' w='35vw'>
                    <Box className={styles.usernameInputTitle} display='flex'>
                        <Icon mr='1vw' w={6} h={6} as={ BiUserPin } />
                        <Heading fontSize='20px'>Username</Heading>
                    </Box>
                    <Box className={styles.nameInputInner} mt='1vh' ml='2.5vw'>
                        <input className={styles.usernameInput} placeholder='  Username' required onChange={(e) => handleOnChangeUsername(e)}
                            style={{
                                width: '25vw',
                                height: '4vh',
                                backgroundColor: '#F5F5F5',
                                borderRadius: '5px',
                                borderWidth: '2px',
                                borderColor: '#BBBBBB'
                            }}
                        />
                    </Box>
                </Box>

                {/* Birthday入力コンテナ */}
                <Box className={styles.birthdayInputOuter} mt='6vh' ml='2.5vw' w='35vw'>
                    <Box className={styles.birthdayInputTitle} display='flex'>
                        <Icon mr='1vw' w={6} h={6} as={BiCake} />
                        <Heading fontSize='20px'>Birthday</Heading>
                    </Box>
                    <Box className={styles.birthdayInputInner} mt='1vh' ml='2.5vw' display='flex' w='32.5vw'>
                        <Box className={styles.yearSelect} mr='3vw'>
                            <Text mb='1vh' fontSize='10px'>Year</Text>
                            <select className={styles.selectYear} onChange={(e) => handleOnChangeYear(e)}
                                style={{
                                    width: '8vw',
                                    height: '4vh',
                                    backgroundColor: '#F5F5F5',
                                    borderRadius: '5px',
                                    borderWidth: '2px',
                                    borderColor: '#BBBBBB'
                                }}
                            >
                                <option value=''>----</option>
                                {years.map((year) => (
                                    <option key={year}>{year}</option>
                                ))}
                            </select>
                        </Box>
                        <Box className={styles.monthSelect} mr='3vw'>
                            <Text mb='1vh' fontSize='10px'>Month</Text>
                            <select className={styles.selectMonth} onChange={(e) => handleOnChangeMonth(e)}
                                style={{
                                    width: '8vw',
                                    height: '4vh',
                                    backgroundColor: '#F5F5F5',
                                    borderRadius: '5px',
                                    borderWidth: '2px',
                                    borderColor: '#BBBBBB'
                                }}
                            > 
                                <option value=''>----</option>
                                {months.map((month) => (
                                    <option key={month}>{month}</option>
                                ))}
                            </select>
                        </Box>
                        <Box className={styles.daySelect} >
                            <Text mb='1vh' fontSize='10px'>Day</Text>
                            <select className={styles.selectDay} onChange={(e) => handleOnChangeDay(e)}
                                style={{
                                    width: '8vw',
                                    height: '4vh',
                                    backgroundColor: '#F5F5F5',
                                    borderRadius: '5px',
                                    borderWidth: '2px',
                                    borderColor: '#BBBBBB'
                                }}
                            >
                                <option value=''>----</option>
                                {days.map((day) => (
                                    <option key={day}>{day}</option>
                                ))}
                            </select>
                        </Box>
                    </Box>
                </Box>

                {/* Country入力コンテナ */}
                <Box className={styles.countryInputOuter} mt='6vh' ml='2.5vw' w='35vw'>
                    <Box className={styles.countryInputTitle} display='flex'>
                        <Icon mr='1vw' w={6} h={6} as={BiWorld} />    
                        <Heading fontSize='20px'>Country</Heading>
                    </Box>
                    <Box className={styles.countryInputInner} mt='1vh' ml='2.5vw'>
                        <select className={styles.selectCountry} onChange={(e) => handleOnChangeCountry(e)}
                            style={{
                                width: '10vw',
                                height: '4vh',
                                backgroundColor: '#F5F5F5',
                                borderRadius: '5px',
                                borderWidth: '2px',
                                borderColor: '#BBBBBB'
                            }}
                        >
                            <option value=''>----</option>
                            {countries.map((country) => (
                                <option value={country}>{country}</option>
                            ))}
                        </select>
                    </Box>
                </Box>

                {/* 提出ボタン */}
                <Center>
                    <Button mt='6vh' size='lg' bg='#1D71AD' color='white' onClick={handleOnSubmit}>Submit</Button>
                </Center>
          </Box>
          <Box className={styles.Footer}>
              <Footer />
          </Box>
        </Box>
    )
}

const styles ={
}