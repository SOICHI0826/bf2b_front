import { css } from "@emotion/css"
import { Text, Box } from "@chakra-ui/react"

export const Sidebar = () => {
    return (
        <Box bg='#1D71AD' pt='500px' pl='27px' pr='29px' w='114px' h='100vh'>
            <Text className={styles.sideText} transform='rotate(-90deg)' whiteSpace='nowrap'>Undex.com</Text>
        </Box>
    )
}

const styles = {
    sideText: css`
        font-size: 50px;
        text-align: center;
        -webkit-text-stroke: 2px #000000;
        color: #FDE5E5;
    `
}