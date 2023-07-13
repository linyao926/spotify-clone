import { createContext, useState, useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    FillHomeIcon,
    HomeIcon,
    SearchIcon,
    FillSearchIcon,
    LibraryIcon,
    NewTabIcon,
    MusicNoteIcon,
    FolderIcon,
    RowRightIcon,
} from '~/assets/icons/icons';
import { AiOutlinePlus } from 'react-icons/ai';
import { VscHeartFilled } from 'react-icons/vsc';
import SearchForm from '~/components/SearchForm';
import config from '~/config';
import { getTokenFromUrl } from '~/apis/spotify';
import SpotifyWebApi from 'spotify-web-api-js';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [isHomePage, setIsHomePage] = useState(true);
    const [searchPage, setSearchPage] = useState(false);
    const [requireLogin, setRequireLogin] = useState(true);
    const [showRequire, setShowRequire] = useState(false);
    const [token, setToken] = useState(null);
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [selectedItemNav, setSelectedItemNav] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [widthNavbar, setWidthNavbar] = useState(null);
    const [collapse, setCollapse] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [typeSearch, setTypeSearch] = useState(null);
    const [columnCount, setColumnCount] = useState(5);
    const [bgHeaderColor, setBgHeaderColor] = useState('#121212');
    const [showPlayingView, setShowPlayingView] = useState(false);
    const [userData, setUserData] = useState(null);
    const [showSubContent, setShowSubContent] = useState(false);
    const [typeSubContent, setTypeSubContent] = useState(null);
    const [mainContainer, setMainContainer] = useState(null);

    const langs = require('langs');

    const availableLanguagesCode = [
        'en',
        'af',
        'am',
        'ar',
        'az',
        'bg',
        'bho',
        'bn',
        'ca',
        'cs',
        'da',
        'de',
        'el',
        'es',
        'es-419',
        'et',
        'fa',
        'fi',
        'fil',
        'fr',
        'fr-CA',
        'gu',
        'he',
        'hi',
        'hr',
        'hu',
        'id',
        'is',
        'it',
        'ja',
        'kn',
        'ko',
        'lt',
        'lv',
        'ml',
        'mr',
        'ms',
        'nb',
        'ne',
        'nl',
        'or',
        'pa-IN',
        'pa-PK',
        'pl',
        'pt-BR',
        'pt-PT',
        'ro',
        'ru',
        'sk',
        'sl',
        'sr',
        'sv',
        'sw',
        'ta',
        'te',
        'th',
        'tr',
        'uk',
        'ur',
        'vi',
        'zh',
        'zh-TW',
        'zu',
    ];

    const SIDEBAR_ITEMS = [
        {
            id: 1,
            title: 'Home',
            to: `${config.routes.home}`,
            icon: isHomePage ? <FillHomeIcon /> : <HomeIcon />,
            isInteract: false,
            requireLogin: false,
        },
        {
            id: 2,
            title: 'Search',
            to: `${config.routes.search}`,
            icon: searchPage ? <FillSearchIcon /> : <SearchIcon />,
            isInteract: false,
            requireLogin: false,
        },
        {
            id: 3,
            title: 'Your Library',
            icon: <LibraryIcon />,
            children: {
                title: 'Enjoy Your Library',
                description: 'Log in to see saved songs, podcasts, artists, and playlists in Your Library.',
            },
            isInteract: false,
            requireLogin: requireLogin,
        },
        {
            id: 4,
            title: 'Create Playlist',
            to: `${config.routes.home}`,
            icon: <AiOutlinePlus />,
            children: {
                title: 'Create a playlist',
                description: 'Log in to create and share playlists.',
            },
            isInteract: true,
            requireLogin: requireLogin,
        },
        {
            id: 5,
            title: 'Liked Songs',
            to: `${config.routes.home}`,
            icon: <VscHeartFilled />,
            children: {
                title: 'Enjoy your Liked Songs',
                description: 'Log in to see all the songs you’ve liked in one easy playlist.',
            },
            isInteract: true,
            requireLogin: requireLogin,
        },
    ];

    const PROFILE_SUB_MENU = [
        {
            value: 'account',
            title: 'Account',
            rightIcon: <NewTabIcon />,
            href: '',
            target: '_blank',
        },
        {
            value: 'profile',
            title: 'Profile',
            to: userData ? `user/${userData.id}` : '',
        },
        {
            value: 'upgrade',
            title: 'Upgrade to Premium',
            rightIcon: <NewTabIcon />,
            href: '',
            target: '_blank',
        },
        {
            value: 'settings',
            title: 'Settings',
            border: true,
            to: config.routes.settings,
        },
        {
            value: 'logout',
            title: 'Log out',
            logout: true,
            to: config.routes.home,
        },
    ];

    const CREATE_SUB_MENU = [
        {
            title: 'Create a new playlist',
            lefticon: <MusicNoteIcon />,
        },
        {
            title: 'Create a playlist folder',
            lefticon: <FolderIcon />,
        },
    ];

    const SORT_SUB_MENU = [
        {
            value: 'sort',
            title: 'Sort by',
            disable: true,
        },
        {
            value: 'recents',
            title: 'Recents',
            active: false,
        },
        {
            value: 'recently-added',
            title: 'Recently Added',
            active: false,
        },
        {
            value: 'alphabetical',
            title: 'Alphabetical',
            active: false,
        },
        {
            value: 'creator',
            title: 'Creator',
            active: true,
        },
    ];

    const MY_PLAYLIST_CONTEXT_MENU = [
        {
            title: 'Add to queue',
            to: '',
        },
        {
            title: 'Go to playlist radio',
            to: '',
        },
        {
            title: 'Remove from profile',
            border: true,
            to: '',
        },
        {
            title: 'Edit details',
            to: '',
        },
        {
            title: 'Create similar playlist',
            to: '',
        },
        {
            title: 'Delete',
            border: true,
            to: '',
        },
        {
            title: 'About recommendations',
            to: '',
        },
    ];

    const LIBRARY_PLAYLIST_CONTEXT_MENU = [
        {
            title: 'Add to queue',
            to: '',
        },
        {
            title: 'Go to playlist radio',
            to: '',
        },
        {
            title: 'Remove from profile',
            border: true,
            to: '',
        },
        {
            title: 'Edit details',
            to: '',
        },
        {
            title: 'Create similar playlist',
            to: '',
        },
        {
            title: 'Delete',
            border: true,
            to: '',
        },
        {
            title: 'Create playlist',
            to: '',
        },
        {
            title: 'Pin playlist',
            border: true,
            to: '',
        },
        {
            title: 'About recommendations',
            to: '',
        },
    ];

    const PLAYLIST_CONTEXT_MENU = [
        {
            title: 'Add to queue',
            to: '',
        },
        {
            title: 'Add to Your Library',
            border: true,
            to: '',
        },
        {
            title: 'About recommendations',
            to: '',
        },
    ];

    const ALBUM_CONTEXT_MENU = [
        {
            title: 'Add to queue',
            to: '',
        },
        {
            title: 'Go to artist radio',
            border: true,
            to: '',
        },
        {
            title: 'Add to Your Library',
            to: '',
        },
        {
            title: 'Add to playlist',
            rightIcon: <RowRightIcon />,
            to: '',
        },
    ];

    const LIBRARY_ALBUM_CONTEXT_MENU = [
        {
            title: 'Add to queue',
            to: '',
        },
        {
            title: 'Go to artist radio',
            border: true,
            to: '',
        },
        {
            title: 'Pin album',
            to: '',
        },
        {
            title: 'Remove from Your Library',
            to: '',
        },
        {
            title: 'Add to playlist',
            rightIcon: <RowRightIcon />,
            to: '',
        },
    ];

    const ARTIST_CONTEXT_MENU = [
        {
            title: 'Follow',
            to: '',
        },
        {
            title: 'Go to artist radio',
            to: '',
        },
    ];

    const LIBRARY_ARTIST_CONTEXT_MENU = [
        {
            title: 'Unfollow',
            to: '',
        },
        {
            title: 'Pin artist',
            to: '',
        },
        {
            title: 'Go to artist radio',
            to: '',
        },
    ];

    const TRACK_CONTEXT_MENU = [
        {
            title: 'Add to queue',
            border: true,
            to: '',
        },
        {
            title: 'Go to song radio',
            to: '',
        },
        {
            title: 'Go to artist',
            to: '',
        },
        {
            title: 'Go to album',
            to: '',
        },
        {
            title: 'Show credits',
            border: true,
            to: '',
        },
        {
            title: 'Save to Your Liked Songs',
            to: '',
        },
        {
            title: 'Add to playlist',
            rightIcon: <RowRightIcon />,
            child: true,
            to: '',
        },
    ];

    const CONTEXT_MENU_PLAYLIST_CHILDREN = [
        {
            title: <SearchForm submenu />,
            isSearch: true,
        },
        {
            title: 'Create playlist',
            border: true,
            to: '',
        },
        {
            title: 'My playlist',
            to: '',
        },
    ];

    const contextMenu = {
        'my-playlist': MY_PLAYLIST_CONTEXT_MENU,
        'library-playlist': LIBRARY_PLAYLIST_CONTEXT_MENU,
        playlist: PLAYLIST_CONTEXT_MENU,
        album: ALBUM_CONTEXT_MENU,
        'library-album': LIBRARY_ALBUM_CONTEXT_MENU,
        artist: ARTIST_CONTEXT_MENU,
        'library-artist': LIBRARY_ARTIST_CONTEXT_MENU,
        track: TRACK_CONTEXT_MENU,
        'children-playlist': CONTEXT_MENU_PLAYLIST_CHILDREN,
    };

    // Get API access token
    const spotifyApi = new SpotifyWebApi();
    const hash = getTokenFromUrl();

    useEffect(() => {
        let _token = window.localStorage.getItem('token');

        if (!_token || (_token === 'undefined' && hash)) {
            _token = hash.access_token;
            window.location.hash = '';
            window.localStorage.setItem('token', _token);
        }

        spotifyApi.setAccessToken(_token);
        setToken(_token);
    }, []);

    const handleLogout = () => {
        setToken('');
        window.localStorage.removeItem('token');
    };

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            const data = await spotifyApi.getMe({}, function (error, data) {
                if (error) {
                    console.error('Error:', error);
                } else {
                    if (isMounted) {
                        setUserData(data);
                    }
                }
            });
        }

        loadData();

        return () => (isMounted = false);
    }, [token]);

    useEffect(() => {
        if (token) {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    }, [token]);

    useEffect(() => {
        if (isLogin) {
            setRequireLogin(false);
        }
    }, [isLogin]);

    useEffect(() => {
        const codes = langs.codes('1');
        const available = [];
        for (let i = 0; i < availableLanguagesCode.length; i++) {
            let index = codes.findIndex((code) => code === availableLanguagesCode[i]);

            if (index !== -1) {
                available.push({
                    code: availableLanguagesCode[i],
                    name: langs.all()[index].name,
                    local: langs.all()[index].local,
                });
            }
        }
        setAvailableLanguages(available);
    }, []);

    // Render Modal
    const renderModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        if (showModal) {
            setShowModal(false);
        }
    };

    const renderRequireLogin = (e, idItem = undefined) => {
        e.stopPropagation();
        let item;
        if (idItem) {
            item = SIDEBAR_ITEMS.find((itemMenu) => itemMenu.id === idItem);
            if (item.requireLogin) {
                setSelectedItemNav(item);
                setShowRequire(true);
            } else {
                setShowRequire(false);
            }
        } else {
            setShowRequire(false);
        }
    };

    const handleGetValueInput = (event) => {
        setInputValue(event.target.value);
        // search();
    };

    // Convert ms
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function msToMinAndSeconds(ms, track = false) {
        let minutes = Math.floor(ms / 60000);
        let seconds = ((ms % 60000) / 1000).toFixed(0);
        if (!track) {
            return seconds === 60
                ? `${padTo2Digits(minutes + 1)} min`
                : `${padTo2Digits(minutes)} min ${padTo2Digits(seconds)} sec`;
        } else {
            return seconds === 60
                ? `${padTo2Digits(minutes + 1)}:00`
                : `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
        }
    }

    function convertMsToHM(ms) {
        let seconds = Math.floor(ms / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);

        seconds = seconds % 60;
        minutes = seconds >= 30 ? minutes + 1 : minutes;
        minutes = minutes % 60;
        hours = hours % 24;

        return minutes !== 0 ? `${padTo2Digits(hours)} hr ${padTo2Digits(minutes)} min` : `${padTo2Digits(hours)} hr`;
    }

    const totalDuration = (arr) => {
        let total = 0;
        for (let val of arr) {
            total += val.duration_ms;
        }
        return total;
    };

    return (
        <AppContext.Provider
            value={{
                SIDEBAR_ITEMS,
                PROFILE_SUB_MENU,
                CREATE_SUB_MENU,
                SORT_SUB_MENU,
                contextMenu,
                isLogin,
                setIsLogin,
                token,
                userData,
                handleLogout,
                setIsHomePage,
                searchPage,
                setSearchPage,
                showRequire,
                setShowRequire,
                renderRequireLogin,
                showModal,
                renderModal,
                closeModal,
                selectedItemNav,
                availableLanguages,
                widthNavbar,
                setWidthNavbar,
                collapse,
                setCollapse,
                typeSearch,
                setTypeSearch,
                inputValue,
                setInputValue,
                handleGetValueInput,
                columnCount,
                setColumnCount,
                msToMinAndSeconds,
                convertMsToHM,
                totalDuration,
                bgHeaderColor,
                setBgHeaderColor,
                spotifyApi,
                showPlayingView,
                setShowPlayingView,
                showSubContent,
                setShowSubContent,
                typeSubContent,
                setTypeSubContent,
                mainContainer,
                setMainContainer,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
