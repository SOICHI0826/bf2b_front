import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { Icon, Box, Text, Radio, RadioGroup, Stack, Button } from '@chakra-ui/react';
import { BsPlayFill } from 'react-icons/bs';
import { useSettings } from '../utils/adminSetting';
import { css } from "@emotion/css";

export const Settings = () => {
  // useContextのSettings
  const settings = useSettings();

  const commonStyles = {
    icon: BsPlayFill,
    iconColor: '#446699'
  };

  const toBoolean = (string) => {
      return string.toLowerCase() === 'true';
  }

  const toString = (boolean) => {
      if (boolean){
        return 'True';
      }else{
        return 'False';
      }
  }

  return (
      <Box className={styles.bg} display='flex' flexDirection='column' bg='#F5F5F5' w='100vw' h='100vh'>
          <Header menu='settings'/>
          <Box className={styles.mainContainer} mt='2vh' ml='5vw'>
              <Text as='b' fontSize='3xl'>Settings</Text>
              <Box className={styles.isHomeSetting} mt='2vh' ml='2vw'>
                  <Box className={styles.settingTitle} display='flex'>
                      <Icon mr='1vw' w={8} h={8} as={ commonStyles.icon } color={commonStyles.iconColor} />
                      <Text as='b' fontSize='xl'>Home or Outside</Text>
                  </Box>
                  <RadioGroup mt='2vh' ml='4vw' onChange={(val) => settings.setIsHome(toBoolean(val))} defaultValue={toString(settings.isHome)}>
                      <Stack direction='row'>
                          <Radio value='True'>
                              <Text as='b'>Home</Text>
                          </Radio>
                          <Radio value='False'>
                              <Text as='b'>Outside</Text>
                          </Radio>
                      </Stack>
                  </RadioGroup>
              </Box>
              <Box className={styles.registerWork} mt='2vh' ml='2vw'>
                  <Box className={styles.settingTitle} display='flex'>
                      <Icon mr='1vw' w={8} h={8} as={ commonStyles.icon } color={commonStyles.iconColor} />
                      <Text as='b' fontSize='xl'>Register Work Info</Text>
                  </Box>
              </Box>
              <Box className={styles.editWork} mt='2vh' ml='2vw'>
                  <Box className={styles.settingTitle} display='flex'>
                      <Icon mr='1vw' w={8} h={8} as={ commonStyles.icon } color={commonStyles.iconColor} />
                      <Text as='b' fontSize='xl'>Edit Work Info</Text>
                  </Box>
              </Box>
              <Box className={styles.registerNews} mt='2vh' ml='2vw'>
                  <Box className={styles.settingTitle} display='flex'>
                      <Icon mr='1vw' w={8} h={8} as={ commonStyles.icon } color={commonStyles.iconColor} />
                      <Text as='b' fontSize='xl'>Register News</Text>
                  </Box>
              </Box>
              <Box className={styles.editNews} mt='2vh' ml='2vw'>
                  <Box className={styles.settingTitle} display='flex'>
                      <Icon mr='1vw' w={8} h={8} as={ commonStyles.icon } color={commonStyles.iconColor} />
                      <Text as='b' fontSize='xl'>Edit News</Text>
                  </Box>
              </Box>
          </Box>
          <Footer />
      </Box>
  )
}

const styles ={
  rightContainer: css`
  `
}