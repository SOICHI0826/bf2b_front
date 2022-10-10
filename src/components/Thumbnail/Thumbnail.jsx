import { css } from "@emotion/css";
import { Text, Box, Button, Image } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

export const Thumbnail = (props) => {
    const {title, path, thumb_img, status} = props;
    const navigate = useNavigate();
    const handleNavWork = () => {
      navigate(path);
    };
    return (
        <Box pl='10px' pt='10px' pr='10px' w='20vw' h='28vh'>
            {status !== 'empty' &&
                <>
                <Button mb='10px' bg='#223344' w='94%' h='80%' onClick={handleNavWork}>
                    <Image src={thumb_img} w='20vw' h='20vh'/>
                </Button>
                <Box w='94%' h='12%'>
                    <Text>
                      { title }
                    </Text>
                </Box>
                </>
            }
            {status === 'empty' &&
                <></>
            }
        </Box>
    )
}

