import { Suspense } from 'react';
import { 
    createBrowserRouter,
    Outlet,
    RouterProvider, 
} from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { AppContextProvider } from './context/AppContext';
import DefaultMainLayout from './components/Layouts/DefaultMainLayout';
import Home from '~/pages/Home';
import Search from '~/pages/Search';
import Profile from '~/pages/Profile';
import Album from '~/pages/Album';
import Artist from '~/pages/Artist';
import Playlist from '~/pages/Playlist';
import Track from '~/pages/Track';
import Genre from './pages/Genre';
import Download from '~/pages/Download';
import Settings from './pages/Settings';
import NotFound from '~/pages/NotFound';

import { SearchContent } from '~/components/Layouts/Content';
import MainSearch from './components/Layouts/Content/MainSearch';
import SubSearch from './components/Layouts/Content/SubSearch';
import SubContent from './components/Layouts/Content/SubContent';

function App() {
    const router = createBrowserRouter([
        {
          path: "/",
          element: <>
            <DefaultMainLayout />
            <Outlet />
          </>,
          errorElement: <NotFound />,
          children: [
            {
                index: true,
                element: <Home />,
            }, 
            {
                path: 'search',
                element: <Search />,
                children: [
                    {
                        index: true,
                        element: <SearchContent />,
                    }, 
                    {
                        path: ':inputValue',
                        element: <MainSearch />,
                        children: [
                            {
                                path: ':type',
                                element: <SubSearch />,
                            }
                        ]
                    },
                ]
            },
            {
                path: 'album/:id',
                element: <Album />
            },
            {
                path: 'playlist/:id/*',
                element: <Playlist />
            },
            {
                path: 'artist/:id',
                element: <Artist />,
            },
            {
                path: 'track/:id',
                element: <Track />
            },
            {
                path: 'user/:id',
                element: <Profile />,
            },
            {
                path: 'genre/:id',
                element: <Genre />
            },
            {
                path: 'download',
                element: <Download />
            },
            {
                path: 'preferences',
                element: <Settings />
            },
            {
                path: ':type/:id/:subType/*',
                element: <SubContent />,
            }
          ]
        },
    ]);

    // history.pushState("", "", `${location.pathname}${location.search}`);
    // history.pushState("", "", `${location.pathname}${location.search}`);

    return (
        <AppContextProvider>
            <div className='App'>
                <Suspense fallback={<div>Loading...</div>}>
                    <RouterProvider router={router} />
                </Suspense>
            </div>
        </AppContextProvider>
    );
}

export default App;
