import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Main } from './pages/Main';
import { WorkTest } from './pages/works/WorkTest';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<Main />} />
          <Route path={'/test'} element={<WorkTest /> } />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
