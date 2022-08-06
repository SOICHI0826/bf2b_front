import { ChakraProvider } from "@chakra-ui/react"
import './App.css';
import { Header } from './components/Header/Header'
import { Thumbnail } from './components/Thumbnail/Thumbnail'
import { Footer } from './components/Footer/Footer'

function App() {
  return (
    <ChakraProvider>
        <Thumbnail title='Metaball' thumb='../public/logo192.png'/>
        <Footer></Footer>
    </ChakraProvider>
  );
}

export default App;
