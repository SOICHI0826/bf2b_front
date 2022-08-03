import { css } from "@emotion/css"
import { Text, Box, Button, Avatar } from "@chakra-ui/react"

export const Header = () => {
    return (
          // スタイリング修正
          <Box display='flex' justifyContent="space-between" bg='#D9D9D9' w='1486px' h='168px'>
              <div className={styles.headerMenu}>
                <Text ml='60px' mr='60px'>About</Text>
                <Text mr='60px'>Works</Text>
                <Text mr='60px'>News</Text>
              </div>
              <div className={styles.status}>
                <Text>Welcome guest!</Text>
                <Button size='lg' bg='#1D71AD' color='white' rounded='md'>Login</Button>
                <Button size='lg' bg='#1D71AD' color='white' rounded='md'>Signup</Button>
              </div>
          </Box>
    )
}

const styles = {
    headerMenu: css`
        display: flex;
    `,
    status: css`
        display: flex;
    `
}
