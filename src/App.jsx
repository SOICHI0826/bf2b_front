import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Main } from './pages/Main';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Thumbnail } from './components/Thumbnail/Thumbnail';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<Main />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
