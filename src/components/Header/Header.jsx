import { css } from "@emotion/css";
import { Text, Box, Button, Avatar } from "@chakra-ui/react";

export const Header = () => {
    return (
        <Box display='flex' bg='#F5F5F5' w='1486px' h='168px'>
            <div className={styles.headerMenu}>
                <Button ml='60px' mr='60px' bg='#F5F5F5'>About</Button>
                <Button mr='60px' bg='#F5F5F5' borderWidth='0px'>Works</Button>
                <Button mr='60px' bg='#F5F5F5' borderWidth='0px'>News</Button>
            </div>
            <div className={styles.status}>
                <Avatar size='lg' mr='45px' bg='#E2E8F0'/>
                <Text mr='60px'>Welcome guest</Text>
                <Button size='lg' mr='45px' bg='#1D71AD' color='white'>Login</Button>
                <Button size='lg' bg='#1D71AD' color='white'>Signup</Button>
            </div>
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
        margin-top: 40px;
        margin-right: 450px;
    `,
    status: css`
        width: 660px;
        height: 64px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-top: 40px;
    `
}
