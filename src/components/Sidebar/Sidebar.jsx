import { css } from "@emotion/css"
import { Text, Box } from "@chakra-ui/react"

export const Sidebar = () => {
    return (
        <>
            {/* paddingの修正 */}
            <Box bg='#1D71AD' w='114px' h='calc(100vh)' pt='400px' pl='27px' pr='29px'>
                <p className={styles.sideText}>Undex.com</p>
            </Box>
        </>
    )
}

const styles = {
    sideText: css`
        font-size: 48px;
        text-align: center;
        -webkit-text-stroke: 2px #000000;
        color: #FDE5E5;
        transform: rotate(-90deg);
    `
}