import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppContextProvider } from '~/context/AppContext';
import DefaultLayout from '~/components/Layouts/DefaultLayout';
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
    const router = createBrowserRouter([
        {
            path: '/',
            element: <DefaultLayout />,
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
                    lazy: () => import('~/pages/Album'),
                },
                {
                    path: 'playlist/:id/*',
                    element: <Playlist />,
                    lazy: () => import('~/pages/Playlist'),
                },
                {
                    path: 'my-playlist/:number',
                    element: <MyPlaylist />,
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
                    errorElement: <div>Oops! There was an error.</div>,
                    lazy: () => import('~/components/Containers/SectionContent'),
                },
            ],
        },
    ]);

    // history.pushState("", "", `${location.pathname}${location.search}`);
    // history.pushState("", "", `${location.pathname}${location.search}`);

    return (
        <AppContextProvider>
            <div className="App">
                <Suspense fallback={<div>Loading...</div>}>
                    <RouterProvider router={router} />
                </Suspense>
            </div>
        </AppContextProvider>
    );
}

export default App;
