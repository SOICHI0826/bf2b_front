import { css } from "@emotion/css";
import { Text, Box, Button, Image } from "@chakra-ui/react";

export const Thumbnail = (props) => {
    const {title, thumb} = props;
    return (
        <Box pl='10px' pt='10px' pr='10px' w='414px' h='318px'>
           <Button mb='10px' bg='#000000' w='394px' h='240px'>
           </Button>
           <Box w='394px' h='50px'>
              <Text ml='17px'>
                { title }
              </Text>
           </Box>
        </Box>
    )
}

