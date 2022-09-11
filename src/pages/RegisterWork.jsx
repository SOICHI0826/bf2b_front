import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { Box, Button, Icon, IconButton, Center, Heading } from '@chakra-ui/react';
import { css } from "@emotion/css";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { BiX } from 'react-icons/bi'
import axios from 'axios';

import { useSettings } from '../utils/adminSetting';
// import { IgnorePlugin } from 'webpack';

export const RegisterWork = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [path, setPath] = useState('');
    const [images, setImages] = useState([]);
    const [submitCondition, setSubmitCondition] = useState('false');
    const maxImagesUpload = 1;

    const settings = useSettings();
    const isHome = settings.isHome;
    let endpoint;
    if (isHome){
        endpoint = 'http://192.168.0.19:8000/works';
      }
      else{
        endpoint = 'http://119.172.88.222:8000/works';
      }

    // Submitボタン押下時のイベント
    const handleOnSubmit = () => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(images[0]);
        // fileReaderオブジェクトの読み込みが完了したら、onloadイベントが発火
        // fileReaderは非同期なので、readしただけだと完了前に次の処理に向かう
        fileReader.onload = async function() {
            const resizedImg = await resizeImage(fileReader.result);
            const data = {
                'title': title,
                'thumb_img': resizedImg,
                'path': path,
            }
            // dataオブジェクトをjson形式に変換して渡す
            postData(JSON.stringify(data));
        }
    }
    
    // axiosで入力データをpost
    const postData = (data) => {
        axios.defaults.headers['Content-Type'] = 'application/json';
        axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
        const url = axios.post(endpoint, data)
        .then(() => {
            setSubmitCondition('success');
            console.log('success');
            navigate('/settings');
        })
        .catch(err => {
            setSubmitCondition('false');
        });
    }

    const resizeImage = (imgData) => {
        const resizedWidth = 180;
        const resizedHeight = 100;
        const canvas = document.createElement('canvas');
        canvas.width = resizedWidth;
        canvas.height = resizedHeight;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = imgData;
        //Promiseを返す
        return new Promise((resolve, reject) => {
            img.onload = () => {
                ctx.drawImage(img, 0, 0, resizedWidth, resizedHeight);
                return resolve(canvas.toDataURL('image/png'));
            }
            img.onerror = (e) => reject(e);
        })
    }

    //Title追加時のイベント
    const handleOnChangeTitle = (e) => {
        if (!e.target.value) return;
        setTitle(e.target.value);
    }

    // Path追加時のイベント
    const handleOnChangePath = (e) => {
        if (!e.target.value) return;
        setPath(e.target.value);
    }

    // 画像追加時のイベント
    const handleOnAddImage = (e) => {
        if (!e.target.files) return;
        setImages([...images, ...e.target.files]);
    }
    //　画像削除時のイベント
    const handleOnRemoveImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    }

    return (
        <Box className={styles.bg} display='flex' flexDirection='column' bg='#F5F5F5' w='100vw' h='100vh'>
        <Header menu='settings'/>
        <Box className={styles.formContainer} mt='5vh' ml='15vw' w='70vw'>
            <Center className={styles.registerWorkTitle} mb='8vh' display='flex'>
                <Heading as='b'>Work Info</Heading>
            </Center>
            {/* フォーム上側 */}
            <Box className={styles.upperForm} display='flex' justifyContent='space-evenly'>
                {/* Work Titleの入力フォーム */}
                <Box className={styles.workTitleForm} display='flex' flexDirection='column'>
                    <Heading as='b' size='md' mb='3vh' ml='1vw'>Title</Heading>
                    <input className={styles.workTitleInput} type='text' placeholder='(ex)    Be Free From Boundary' maxLength='30' required onChange={(e) => handleOnChangeTitle(e)}
                    style={{
                        width: '30vw',
                        height: '5vh',
                        backgroundColor: '#F5F5F5',
                        borderRadius: '5px',
                        borderWidth: '2px',
                        borderColor: '#DDDDDD'
                    }}/>
                </Box>

                {/* Work Pathの入力フォーム */}
                <Box className={styles.workPathForm} display='flex' flexDirection='column'>
                    <Heading as='b' size='md' mb='3vh' ml='1vw'>Path</Heading>
                    <input className={styles.workPathInput} placeholder='(ex)    /works/bf2b' required onChange={(e) => handleOnChangePath(e)}
                    style={{
                        width: '30vw',
                        height: '5vh',
                        backgroundColor: '#F5F5F5',
                        borderRadius: '5px',
                        borderWidth: '2px',
                        borderColor: '#DDDDDD'
                    }}
                    />
                </Box>
            </Box>
            {/* Thumbnailアップロードフォーム */}
            <Box className={styles.thumbForm} mt='5vh' display='flex' flexDirection='column'>
                <Heading as='b' size='md' mb='3vh' ml='4vw'>Thumbnail Image</Heading>
                <Box ml='4vw' display='flex'>
                    {/* 画像がアップロードされていない場合には、inputを表示 */}
                    {images.length < maxImagesUpload &&
                        <input type='file' accept='image/*' onChange={(e) => handleOnAddImage(e)} />
                    }
                    <Box className={styles.thumbPreview} position='relative' w='25vw' h='25vh'>
                        {images.map((image, index) => (
                            <div>
                                <IconButton aria-label='delete image' position='absolute' top='0.5vh' left='0.5vw' bg='#CCCCCC' borderWidth='1px' borderColor='black' onClick={() => handleOnRemoveImage(index)}>
                                    <Icon w={8} h={8} color='black' as={BiX}/>
                                </IconButton>
                                <img alt='' src={URL.createObjectURL(image)} />
                            </div>
                        ))}
                    </Box>
                </Box>
            </Box>
            <Center className={styles.submitButtonContainer}>
                <Button mt='5vh' size='lg' bg='#1D71AD' color='white' borderColor='#000000' borderWidth='2px' type='submit' onClick={handleOnSubmit}>Submit</Button> 
            </Center>
        </Box>
        <Footer />
    </Box>
    )
}

const styles ={
  workTitleInput: css`
  `,
}