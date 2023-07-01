import axios from 'axios';
import { createHashHistory } from "history";
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
import config from '~/config';
import { getTokenFromUrl } from '~/apis/spotify';
import SpotifyWebApi from "spotify-web-api-js";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [searchPage, setSearchPage] = useState(false);
    const [requireLogin, setRequireLogin] = useState(true);
    const [showRequire, setShowRequire] = useState(false);
    const [token, setToken] = useState(null);
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [selectedItemNav, setSelectedItemNav] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [widthNavbar, setWidthNavbar] = useState(null);
    const [collapse, setCollapse] = useState(false);
    const [nodeScrollY, setNodeScrollY] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [typeSearch, setTypeSearch] = useState(null);
    const [columnCount, setColumnCount] = useState(5);
    const [bgHeaderColor, setBgHeaderColor] = useState('#121212');
    const [showPlayingView, setShowPlayingView] = useState(false);
    const [userData, setUserData] = useState(null);
    
    useEffect(() => {
        let isMounted = true;

        async function loadData () {
            const data =  await spotifyApi.getMe();
            if (isMounted) {
                setUserData(data);
            }
        }

        loadData();

        return () => (isMounted = false);
    }, []);
    
    const POS_Y_CHANGE = 210;
    const langs = require('langs');
    let history = createHashHistory();
    let locationHistory = history.location; 

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
            icon:  !searchPage ? <FillHomeIcon /> : <HomeIcon />,
            isInteract: false,
            requireLogin: false,
        },
        {
            id: 2,
            title: 'Search',
            to: `${config.routes.search}`,
            icon:  searchPage ? <FillSearchIcon /> : <SearchIcon />,
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
            to: (userData ? `user/${userData.id}` : ''),
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

    const CONTAINER_PLAYLIST_CONTEXT_MENU = [
        {
            title: 'Add to queue',
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
            to: '',
        },
        {
            title: 'Exclude from your taste profile',
            border: true,
            to: '',
        },
        {
            title: 'Share',
            border: true,
            rightIcon: <RowRightIcon />,
            to: '',
            children: [
                {
                    title: 'Copy link to playlist',
                    to: '',
                },
                {
                    title: 'Embed playlist',
                    to: '',
                },
            ],
        },
        {
            title: 'About recommendations',
            to: '',
        },
    ];

    const SIDEBAR_PLAYLIST_CONTEXT_MENU = [
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
            to: '',
            border: true,
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
            to: '',
            border: true,
        },
        {
            title: 'Create playlist',
            to: '',
        },
        {
            title: 'Create folder',
            to: '',
        },
        {
            title: 'Exclude from your taste profile',
            to: '',
        },
        {
            title: 'Pin playlist',
            to: '',
            border: true,
        },
        {
            title: 'Share',
            icon: <RowRightIcon />,
            to: '',
            children: [
                {
                    title: 'Copy link to playlist',
                    to: '',
                },
                {
                    title: 'Embed playlist',
                    to: '',
                },
            ],
        },
    ];

    const popularAlbumsId = [
        '1vi1WySkgPGkbR8NnQzlXu',
        '4xc3Lc9yASZgEJGH7acWMB',
        '446ROKmKfpEwkbi2SjELVX',
        '639nejcoHHwxJCKqr35ww2',
        '5hxm3ulOLVvjFdZNFO3n4M',
        '3jeQDa9OFZ6GndLindHx3k',
        '5Jk4Eg7pxYhDrWJCVVzmMt',
        '4LyiYe4wZ6XwzUne79hidF',
        '0OThHPtV2ovPxWwh8ublMV',
        '5jDZKqgoVRbob6A3omYTG5'
    ];

    const popularArtistsId = [
        '6d0dLenjy5CnR5ZMn2agiV',
        '1zSv9qZANOWB4HRE8sxeTL',
        '6VuMaDnrHyPL1p4EHjYLi7',
        '5dfZ5uSmzR7VQK0udbAVpf',
        '1oSPZhvZMIrWW5I41kPkkY',
        '3Nrfpe0tUJi4K4DXYWgMUX',
        '6HaGTQPmzraVmaVxvz6EUc',
        '3diftVOq7aEIebXKkC34oR',
        '1LEtM3AleYg1xabW6CRkpi',
        '06HL4z0CvFAxyc27GXpf02'      
    ];

    // Get API access token
    const spotifyApi = new SpotifyWebApi();
    const hash = getTokenFromUrl();
    
    useEffect(() => {
        let _token = window.localStorage.getItem("token");

        if (!_token || _token === "undefined" && hash) {
            _token = hash.access_token;
            window.location.hash = ""
            window.localStorage.setItem("token", _token);
        }

        spotifyApi.setAccessToken(_token);
        setToken(_token);
    }, []);

    const handleLogout = () => {
        setToken('');
        window.localStorage.removeItem("token");
    }
    
    // Get Data
    const endpoint = 'https://api.spotify.com/v1/';

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

    // useLayoutEffect(() => {
    //     if (location.pathname.includes('/search')) {
    //         setSearchPage(true);
    //     } else {
    //         setSearchPage(false);
    //     }
    // }, [location]);

    // Get Data from spotify api 
    const search = async (q, type = "track", limit = 10, offset = 0) => {
        const response = await spotifyApi.search(q, [type], {limit, offset})
        return response;
    };

    const getArtistAlbums = async (id, limit = 10, offset = 0) => {
        const response = await spotifyApi.getArtistAlbums(id, {limit, offset})
        return response;
    };

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
      
        return minutes !== 0 ? `${padTo2Digits(hours)} hr ${padTo2Digits(minutes)} min` 
                             : `${padTo2Digits(hours)} hr`;
    }

    const totalDuration = (arr) => {
        let total = 0;
        for (let val of arr) {
            total += val.duration_ms;            
        }
        return total;
    }

    return (
        <AppContext.Provider
            value={{
                POS_Y_CHANGE,
                SIDEBAR_ITEMS,
                PROFILE_SUB_MENU,
                CREATE_SUB_MENU,
                SORT_SUB_MENU,
                CONTAINER_PLAYLIST_CONTEXT_MENU,
                SIDEBAR_PLAYLIST_CONTEXT_MENU,
                isLogin, setIsLogin, token,
                userData,
                handleLogout,
                searchPage, setSearchPage,
                showRequire, setShowRequire, renderRequireLogin,
                showModal, renderModal, closeModal,
                selectedItemNav,
                availableLanguages,
                widthNavbar, setWidthNavbar,
                collapse, setCollapse,
                nodeScrollY, setNodeScrollY,
                typeSearch, setTypeSearch,
                inputValue, setInputValue,
                handleGetValueInput,
                popularAlbumsId,
                popularArtistsId,
                columnCount, setColumnCount,
                msToMinAndSeconds, convertMsToHM,
                totalDuration,
                bgHeaderColor, setBgHeaderColor,
                spotifyApi,
                showPlayingView, setShowPlayingView,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};


