import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '~/pages/Home';
import SingUpLogin from '~/pages/SignUpLogin';
import Account from '~/pages/Account';
import Help from '~/pages/Help';
import Download from '~/pages/Download';
import Upgrade from '~/pages/Upgrade';
import NotFound from '~/pages/NotFound';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/singuplogin" element={<SingUpLogin />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/download" element={<Download />} />
                    <Route path="/premium" element={<Upgrade />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
