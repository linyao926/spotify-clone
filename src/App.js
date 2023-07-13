import { Suspense } from 'react';
import { 
    createBrowserRouter,
    RouterProvider, 
} from 'react-router-dom';
import { AppContextProvider } from '~/context/AppContext';
import DefaultMainLayout from '~/components/Layouts/DefaultMainLayout';
import Home from '~/pages/Home';
import Search from '~/pages/Search';
import Profile from '~/pages/Profile';
import Album from '~/pages/Album';
import Artist from '~/pages/Artist';
import Playlist from '~/pages/Playlist';
import Track from '~/pages/Track';
import Genre from '~/pages/Genre';
import Download from '~/pages/Download';
import Settings from '~/pages/Settings';
import Queue from './pages/Queue/Queue';
import NotFound from '~/pages/NotFound';

import { SearchContent } from '~/components/Layouts/Content';
import MainSearch from '~/components/Layouts/Content/MainSearch';
import SubSearch from '~/components/Layouts/Content/SubSearch';
import SubContent from '~/components/Layouts/Content/SubContent';

function App() {
    const router = createBrowserRouter([
        {
          path: "/",
          element: <DefaultMainLayout />,
          errorElement: <NotFound />,
          children: [
            {
                index: true,
                element: <Home />,
                lazy: () => import('~/pages/Home'),
            }, 
            {
                path: 'search',
                element: <Search />,
                lazy: () => import("~/pages/Search"),
                children: [
                    {
                        index: true,
                        element: <SearchContent />,
                        lazy: () => import('~/components/Layouts/Content'),
                    }, 
                    {
                        path: ':inputValue',
                        element: <MainSearch />,
                        lazy: () => import('~/components/Layouts/Content/MainSearch'),
                        children: [
                            {
                                path: ':type',
                                element: <SubSearch />,
                                lazy: () => import('~/components/Layouts/Content/SubSearch'),
                            }
                        ]
                    },
                ]
            },
            {
                path: 'album/:id',
                element: <Album />,
                lazy: () => import('~/pages/Album'),
            },
            {
                path: 'playlist/:id/*',
                element: <Playlist />,
                lazy: () => import('~/pages/Playlist'),
            },
            {
                path: 'artist/:id',
                element: <Artist />,
                lazy: () => import('~/pages/Artist'),
            },
            {
                path: 'track/:id',
                element: <Track />,
                lazy: () => import('~/pages/Track'),
            },
            {
                path: 'user/:id',
                element: <Profile />,
                lazy: () => import('~/pages/Profile'),
            },
            {
                path: 'genre/:id/*',
                element: <Genre />,
                lazy: () => import('~/pages/Genre'),
            },
            {
                path: 'download',
                element: <Download />,
                lazy: () => import('~/pages/Download'),
            },
            {
                path: 'preferences',
                element: <Settings />,
                lazy: () => import('~/pages/Settings'),
            },
            {
                path: 'queue',
                element: <Queue />,
                lazy: () => import('~/pages/Queue'),
            },
            {
                path: ':type?/:id?/:subType/:pageNumber?',
                element: <SubContent />,
                errorElement: <div>Oops! There was an error.</div>,
                lazy: () => import("~/components/Layouts/Content/SubContent"),
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
