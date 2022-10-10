import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { ProvideSettings } from './utils/commonSetting';
import { AuthProvider} from './utils/authSettings';
import { Main } from './pages/Main';
import { News } from './pages/News';
import { About } from './pages/about/About';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { RegisterWork } from './pages/RegisterWork';
import { TestTemp } from './pages/works/test/Temp';
import { ModelView } from './pages/works/modelView/Temp';
import { WallSpot } from './pages/works/wallSpot/workPage';

function App() {
  return (
    <ChakraProvider>
        <AuthProvider>
            <ProvideSettings>
                <BrowserRouter>
                    <Routes>
                        <Route path={'/'} element={<Main />} />
                        <Route path={'/news'} element={<News />} />
                        <Route path={'/about'} element={<About />} />
                        <Route path={'/settings'} element={<Settings />} />
                        <Route path={'/login'} element={<Login />} />
                        <Route path={'/signup'} element={<Signup />} />
                        <Route path={'/registerWork'} element={<RegisterWork />} />
                        <Route path={'/test'} element={<TestTemp /> } />
                        <Route path={'/works/modelView'} element={<ModelView />} />
                        <Route path={'/works/wallSpot'} element={<WallSpot />} />
                    </Routes>
                </BrowserRouter>
            </ProvideSettings>
        </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
