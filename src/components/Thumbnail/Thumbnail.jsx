import { css } from "@emotion/css";
import { Text, Box, Button, Image } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

export const Thumbnail = (props) => {
    const {title, route} = props;
    const navigate = useNavigate();
    const handleNavWork = () => {
      navigate(route);
    };
    return (
        <Box pl='10px' pt='10px' pr='10px' w='20vw' h='28vh'>
           <Button mb='10px' bg='#000000' w='94%' h='80%' onClick={handleNavWork}>
            <Image src='/logo192.png' />
           </Button>
           <Box w='94%' h='12%'>
              <Text>
                { title }
              </Text>
           </Box>
        </Box>
    )
}

