import { css } from "@emotion/css";
import { Text, Box, Button, Image } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

export const Thumbnail = (props) => {
    const {title} = props;
    const navigate = useNavigate();
    const handleNavWork = () => {
      navigate('/test');
    };
    return (
        <Box pl='10px' pt='10px' pr='10px' w='414px' h='318px'>
           <Button type='button' mb='10px' bg='#000000' w='394px' h='240px' onClick={handleNavWork}>
           </Button>
           <Box w='394px' h='50px'>
              <Text ml='17px'>
                { title }
              </Text>
           </Box>
        </Box>
    )
}

