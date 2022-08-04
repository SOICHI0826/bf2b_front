import { ChakraProvider } from "@chakra-ui/react"
import './App.css';
import { Header } from './components/Header/Header'

function App() {
  return (
    <ChakraProvider>
        <Header />
    </ChakraProvider>
  );
}

export default App;
