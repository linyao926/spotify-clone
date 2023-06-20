import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import config from '~/config';
import Home from '~/pages/Home';
import Search from '~/pages/Search';
import Profile from './pages/Profile';
import Album from './pages/Album';
import Artist from './pages/Artist';
import Playlist from './pages/Playlist';
import Track from './pages/Track';
import Download from '~/pages/Download';
import NotFound from '~/pages/NotFound';

function App() {

    // history.pushState("", "", `${location.pathname}${location.search}`);
    // history.pushState("", "", `${location.pathname}${location.search}`);

    return (
        <BrowserRouter >
            <AppContextProvider>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/user" element={<Profile />} />
                        <Route path="/album" element={<Album />} />
                        <Route path="/playlist" element={<Playlist />} />
                        <Route path="/artist" element={<Artist />} />
                        <Route path="/track" element={<Track />} />
                        <Route path="/download" element={<Download />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </AppContextProvider>
        </BrowserRouter>
    );
}

export default App;
