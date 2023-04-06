import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '~/pages/Home';
import SignUp from '~/pages/SignUp';
import Login from '~/pages/Login';
import Account from '~/pages/Account';
import Help from '~/pages/Help';
import Download from '~/pages/Download';
import Upgrade from '~/pages/Upgrade';
import NotFound from '~/pages/NotFound';
import Cookies from './pages/Cookies';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/download" element={<Download />} />
                    <Route path="/premium" element={<Upgrade />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
