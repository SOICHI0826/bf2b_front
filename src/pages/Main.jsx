import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { Thumbnail } from '../components/Thumbnail/Thumbnail';
import { Box, Button } from '@chakra-ui/react';
import { css } from "@emotion/css";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSettings } from '../utils/adminSetting';

export const Main = () => {
  // オブジェクト初期化
  const [work1, setWork1] = useState({title: '', path: '', thumb_img: ''});
  const [work2, setWork2] = useState({title: '', path: '', thumb_img: ''});
  const [work3, setWork3] = useState({title: '', path: '', thumb_img: ''});
  const [work4, setWork4] = useState({title: '', path: '', thumb_img: ''});
  const [work5, setWork5] = useState({title: '', path: '', thumb_img: ''});
  const [work6, setWork6] = useState({title: '', path: '', thumb_img: ''});

  const settings = useSettings();
  const isHome = settings.isHome;

  const page = '1';
  let sortType = 'created_date';

  let endpoint;
  if (isHome){
    endpoint = 'http://192.168.0.19:8000/works?';
  }else{
    endpoint = 'http://119.172.88.222:8000/works?';
  }

  const getWorks = async() => {
      axios.defaults.headers['Content-Type'] = 'application/json';
      axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
      const response = await axios.get(endpoint + 'page=' + page + '&' + 'sort_type=' + sortType)
      console.log(response.data);
      setWork1({...work1, title: response.data.res[0].title, path: response.data.res[0].path, thumb_img: response.data.res[0].thumb_img});
      setWork2({...work2, title: response.data.res[1].title, path: response.data.res[1].path, thumb_img: response.data.res[1].thumb_img});
      setWork3({...work3, title: response.data.res[2].title, path: response.data.res[2].path, thumb_img: response.data.res[2].thumb_img});
      setWork4({...work4, title: response.data.res[3].title, path: response.data.res[3].path, thumb_img: response.data.res[3].thumb_img});
      setWork5({...work5, title: response.data.res[4].title, path: response.data.res[4].path, thumb_img: response.data.res[4].thumb_img});
      setWork6({...work6, title: response.data.res[5].title, path: response.data.res[5].path, thumb_img: response.data.res[5].thumb_img});
  }

  const checkRes = () => {
      console.log("work1", work1);
      console.log("work2", work2);
      console.log("work3", work3);
      console.log("work4", work4);
      console.log("work5", work5);
      console.log("work6", work6);
  }

  useEffect(() => {
      getWorks();
  }, []);

  return (
     <Box className={styles.bg} display='flex' flexDirection='column' bg='#F5F5F5' w='100vw' h='100vh'>
        <Header menu='works' />
        {/* <Box className={styles.pageInfo} display='flex'>
          <Select size='md' bg='#FFFFFF' borderWidth='1px' borderColor='#3182CE' w='20vw' h='5vh'>
            <option value='option1'>Date</option>
            <option value='option2'>Popularity</option>
          </Select>
        </Box> */}
        <Box className={styles.worksContainer} ml='12.5%' mt='10vh' bgColor='rgb(255, 230, 230, 0.3)' border='1px' borderColor='#000000' w='75%' h='70%'>
            <Box className={styles.upperContainer} pt='20px' display='flex' justifyContent='space-evenly'>
                {/* Work1 */}
                { work1 !== undefined &&
                  <Thumbnail title={work1.title} path={work1.path} thumb_img={work1.thumb_img}></Thumbnail>
                }
                {
                  work1 === undefined &&
                  <Thumbnail status='empty'></Thumbnail>
                }

                {/* Work2 */}
                { work2 !== undefined &&
                  <Thumbnail title={work2.title} path={work2.path} thumb_img={work2.thumb_img}></Thumbnail>
                }
                {
                  work2 === undefined &&
                  <Thumbnail status='empty'></Thumbnail>
                }

                {/* Work3 */}
                { work3 !== undefined &&
                  <Thumbnail title={work3.title} path={work3.path} thumb_img={work3.thumb_img}></Thumbnail>
                }
                {
                  work3 === undefined &&
                  <Thumbnail status='empty'></Thumbnail>
                }
            </Box>
            <Box className={styles.lowerContainer} pt='20px' display='flex' justifyContent='space-evenly'>
                {/* Work4 */}
                { work4 !== undefined &&
                  <Thumbnail title={work4.title} path={work4.path} thumb_img={work4.thumb_img}></Thumbnail>
                }
                {
                  work4 === undefined &&
                  <Thumbnail status='empty'></Thumbnail>
                }

                {/* Work5 */}
                { work5 !== undefined &&
                  <Thumbnail title={work5.title} path={work5.path} thumb_img={work5.thumb_img}></Thumbnail>
                }
                {
                  work5 === undefined &&
                  <Thumbnail status='empty'></Thumbnail>
                }

                {/* Work6 */}
                { work6 !== undefined &&
                  <Thumbnail title={work6.title} path={work6.path} thumb_img={work6.thumb_img}></Thumbnail>
                }
                {
                  work6 === undefined &&
                  <Thumbnail status='empty'></Thumbnail>
                }
            </Box>
        </Box>
        {/* <Button onClick={checkRes}>test</Button> */}
        <Footer />
     </Box>
  )
}

const styles ={
  rightContainer: css`
  `
}