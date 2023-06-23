import { Suspense } from 'react';
import { 
    createBrowserRouter,
    Outlet,
    RouterProvider, 
} from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import DefaultMainLayout from './components/Layouts/DefaultMainLayout';
import Home from '~/pages/Home';
import Search from '~/pages/Search';
import Profile from '~/pages/Profile';
import Album from '~/pages/Album';
import Artist from '~/pages/Artist';
import Playlist from '~/pages/Playlist';
import Track from '~/pages/Track';
import Download from '~/pages/Download';
import NotFound from '~/pages/NotFound';

import { SearchContent, SearchResultsContent } from '~/components/Layouts/Content';
// import SearchAll from './components/Layouts/Content/SearchAll';
// import SearchGenre from './components/Layouts/Content/SearchGenre';

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
                path: '/search',
                element: <Search />,
                children: [
                    {
                        index: true,
                        element: <SearchContent />,
                    }, 
                    {
                        path: ':inputValue',
                        element: <SearchResultsContent />,
                        // children: [
                        //     {
                        //         index: true,
                        //         element: <SearchAll />,
                        //     },
                        //     {
                        //         path: ':type',
                        //         element: <SearchGenre />,
                        //     }
                        // ]
                    },
                ]
            },
            {
                path: 'album/:id',
                element: <Album />
            },
            {
                path: 'playlist/:id',
                element: <Playlist />
            },
            {
                path: 'artist/:id',
                element: <Artist />
            },
            {
                path: 'track/:id',
                element: <Track />
            },
            {
                path: 'user/:id',
                element: <Profile />
            },
            {
                path: 'download',
                element: <Download />
            },
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
