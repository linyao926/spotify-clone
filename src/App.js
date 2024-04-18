import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppContextProvider } from '~/context/AppContext';
import { useWindowSize } from 'react-use';
import DefaultLayout from '~/components/Layouts/DefaultLayout';
import MobileLayout from './components/Layouts/MobileLayout';
import Home from '~/pages/Home';
import Search from '~/pages/Search';
import Profile from '~/pages/Profile';
import Album from '~/pages/Album';
import Artist from '~/pages/Artist';
import Playlist from '~/pages/Playlist';
import MyPlaylist from '~/pages/MyPlaylist';
import Track from '~/pages/Track';
import Genre from '~/pages/Genre';
import Download from '~/pages/Download';
import Settings from '~/pages/Settings';
import Queue from '~/pages/Queue/Queue';
import NotFound from '~/pages/NotFound';

import SearchContent from './components/Containers/SearchContent';
import SearchedContent from './components/Containers/SearchedContent';
import SearchedDetailContent from './components/Containers/SearchedDetailContent';
import SectionContent from './components/Containers/SectionContent';
import LikedTracks from '~/pages/Collection/LikedTracks';
import CollectionPlaylists from '~/pages/Collection/CollectionPlaylists';
import CollectionArtists from '~/pages/Collection/CollectionArtists';
import CollectionAlbums from '~/pages/Collection/CollectionAlbums';
import SearchInMyPlaylist from './components/Containers/SearchInMyPlaylist';

function App() {
    const { width } = useWindowSize();

    const child = [
        {
            index: true,
            element: <Home />,
            lazy: () => import('~/pages/Home'),
        },
        {
            path: 'search',
            element: <Search />,
            lazy: () => import('~/pages/Search'),
            children: [
                {
                    index: true,
                    element: <SearchContent />,
                    lazy: () => import('~/components/Containers/SearchContent'),
                },
                {
                    path: ':searchPageInputValue',
                    element: <SearchedContent />,
                    lazy: () => import('~/components/Containers/SearchedContent'),
                    children: [
                        {
                            path: ':type',
                            element: <SearchedDetailContent />,
                            lazy: () => import('~/components/Containers/SearchedDetailContent'),
                        },
                    ],
                },
            ],
        },
        {
            path: 'album/:id',
            element: <Album />,
            errorElement: <NotFound />,
            lazy: () => import('~/pages/Album'),
        },
        {
            path: 'playlist/:id/*',
            element: <Playlist />,
            errorElement: <NotFound />,
            lazy: () => import('~/pages/Playlist'),
        },
        {
            path: 'my-playlist/:number',
            element: <MyPlaylist />,
            errorElement: <NotFound />,
            lazy: () => import('~/pages/MyPlaylist'),
            children: [
                {
                    index: true,
                    element: <SearchInMyPlaylist />,
                    lazy: () => import('~/components/Containers/SearchInMyPlaylist'),
                },
            ],
        },
        {
            path: 'artist/:id',
            element: <Artist />,
            errorElement: <NotFound />,
            lazy: () => import('~/pages/Artist'),
        },
        {
            path: 'track/:id',
            element: <Track />,
            errorElement: <NotFound />,
            lazy: () => import('~/pages/Track'),
        },
        {
            path: 'user/:id',
            element: <Profile />,
            errorElement: <NotFound />,
            lazy: () => import('~/pages/Profile'),
        },
        {
            path: 'genre/:id/*',
            element: <Genre />,
            errorElement: <NotFound />,
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
            path: 'collection/tracks',
            element: <LikedTracks />,
            lazy: () => import('~/pages/Collection/LikedTracks'),
        },
        {
            path: 'collection/playlists',
            element: <CollectionPlaylists />,
            lazy: () => import('~/pages/Collection/CollectionPlaylists'),
        },
        {
            path: 'collection/artists',
            element: <CollectionArtists />,
            lazy: () => import('~/pages/Collection/CollectionArtists'),
        },
        {
            path: 'collection/albums',
            element: <CollectionAlbums />,
            lazy: () => import('~/pages/Collection/CollectionAlbums'),
        },
        {
            path: ':type?/:id?/:subType/:pageNumber?',
            element: <SectionContent />,
            lazy: () => import('~/components/Containers/SectionContent'),
        },
    ]

    const router = createBrowserRouter([
        {
            path: '/',
            element: width > 768 ? <DefaultLayout /> : <MobileLayout />,
            errorElement: <NotFound />,
            children: child,
        },
    ]);

    return (
        <AppContextProvider>
            <div className="App">
                <RouterProvider router={router} />
            </div>
        </AppContextProvider>
    );
}

export default App;
