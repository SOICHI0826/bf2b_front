import { Text, Box} from "@chakra-ui/react";
import { css } from "@emotion/css";

export const Footer = (props) => {
    const type = props.type;
    return (
        <Box className={styles.footer} w='100vw'>
            {type === 'about' &&
                <Text textAlign='center' fontSize='14px' color='#EAEAEA'>Copyright ©︎ 2022 BF2B All Right Reserved</Text>
            }
            {type !== 'about' &&
                <Text textAlign='center' fontSize='14px'>Copyright ©︎ 2022 BF2B All Right Reserved</Text>
            }
        </Box>
    )
}

const styles ={
    //ページ最下部に固定
    footer: css`
        position: absolute;
        bottom: 1vh;
  `
}

