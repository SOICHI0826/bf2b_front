import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Main } from './pages/Main';
import { News } from './pages/News';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { TestTemp } from './pages/works/test/Temp';
import { ModelView } from './pages/works/modelView/Temp';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<Main />} />
          <Route path={'/news'} element={<News />} />
          <Route path={'/about'} element={<About />} />
          <Route path={'/login'} element={<Login />} />
          <Route path={'/signup'} element={<Signup />} />
          <Route path={'/test'} element={<TestTemp /> } />
          <Route path={'/modelView'} element={<ModelView />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
