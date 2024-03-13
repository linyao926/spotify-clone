import { createContext, useState, useEffect } from 'react';
import {
    FillHomeIcon,
    HomeIcon,
    SearchIcon,
    FillSearchIcon,
    LibraryIcon,
    FillLibraryIcon,
    NewTabIcon,
    MusicNotesIcon,
    FolderIcon,
    GridIcon,
    ListIcon,
    CompactIcon,
} from '~/assets/icons/icons';
import { BsCollection, BsFillCollectionFill } from 'react-icons/bs';
import { AiOutlinePlus } from 'react-icons/ai';
import { VscHeartFilled } from 'react-icons/vsc';
import config from '~/config';
import SpotifyWebApi from 'spotify-web-api-js';
import { functional } from './functional';
import { contextMenu } from './contextMenu';
import useAuth, {refreshToken} from '~/apis/useAuth';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState(null);
    const [accessToken, setAccessToken] = useState('');
    const [tokenError, setTokenError] = useState(false);

    const [playing, setPlaying] = useState(false);
    const [waitingMusicList, setWaitingMusicList] = useState(null);
    const [currentPlayingIndex, setCurrentPlayingIndex] = useState(JSON.parse(localStorage.getItem('CURRENT_INDEX')));

    const [availableLanguages, setAvailableLanguages] = useState([]);

    const [containerWidth, setContainerWidth] = useState(1052);
    const [ctnHeaderTextHeight, setCtnHeaderTextHeight] = useState(null);
    const [ctnHeaderTextSize, setCtnHeaderTextSize] = useState(9.6);
    const [columnCount, setColumnCount] = useState(5);
    const [bgHeaderColor, setBgHeaderColor] = useState('#121212');
    const [widthNavbar, setWidthNavbar] = useState(null);

    const [isLogin, setIsLogin] = useState(false);
    const [isHomePage, setIsHomePage] = useState(true);
    const [searchPage, setSearchPage] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showRequire, setShowRequire] = useState(false);
    const [showRemind, setShowRemind] = useState(false);
    const [remindText, setRemindText] = useState('');
    const [selectedItemNav, setSelectedItemNav] = useState(null);
    const [showPlayingView, setShowPlayingView] = useState(false);
    const [nowPlayingPanel, setNowPlayingPanel] = useState(functional.getInitialCondition('CONDITION').panel || false);
    const [showSubContent, setShowSubContent] = useState(false);
    const [typeSubContent, setTypeSubContent] = useState(null);
    const [mainContainer, setMainContainer] = useState(null);
    const [collapse, setCollapse] = useState(functional.getInitialCondition('CONDITION').collapse || false);
    const [disableScroll, setDisableScroll] = useState(false);
    const [posHeaderNextBtn, setPosHeaderNextBtn] = useState(0);
    const [yPosScroll, setYPosScroll] = useState(0);
    const [enlarge, setEnlarge] = useState(functional.getInitialCondition('CONDITION').enlarge || false);

    const [searchPageInputValue, setSearchPageInputValue] = useState('');
    const [searchLibraryInputValue, setSearchLibraryInputValue] = useState('');
    const [searchMyPlaylistValue, setSearchMyPlaylistValue] = useState('');
    const [myPlaylistPageInputValue, setMyPlaylistPageInputValue] = useState('');
    const [typeSearch, setTypeSearch] = useState(null);
    const [compactLibrary, setCompactLibrary] = useState(functional.getInitialCondition('CONDITION')['compact_library'] || false);
    const [gridLibrary, setGridLibrary] = useState(functional.getInitialCondition('CONDITION')['grid_library'] || false);
    const [existPlaylist, setExistPlaylist] = useState(false);
    const [myPlaylistsData, setMyPlaylistsData] = useState(functional.getInitialList('MY_PLAYLIST_DATA'));
    const [libraryPlaylistIds, setLibraryPlaylistIds] = useState(functional.getInitialList('LIBRARY_DATA').playlist);
    const [libraryAlbumIds, setLibraryAlbumIds] = useState(functional.getInitialList('LIBRARY_DATA').album);
    const [libraryArtistIds, setLibraryArtistIds] = useState(functional.getInitialList('LIBRARY_DATA').artist);
    const [savedTracks, setSavedTracks] = useState(functional.getInitialList('LIKED_TRACKS_DATA'));
    const [sortByCreator, setSortByCreator] = useState(functional.getInitialCondition('CONDITION')['sort_creator'] || true);
    const [myPlaylistId, setMyPlaylistId] = useState(null);

    const [nowPlayingId, setNowPlayingId] = useState(null);
    const [nextQueueId, setNextQueueId] = useState(functional.getInitialOther('MUSIC_LIST')['next_queue']);
    const [nextFromId, setNextFromId] = useState(functional.getInitialOther('MUSIC_LIST')['next_from']);

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
            title: 'Your Collection',
            icon: !existPlaylist ? <BsCollection /> : <BsFillCollectionFill />,
            to: `${config.routes.savedPlaylist}`,
            children: {
                title: 'Enjoy Your Collection',
                description: 'Log in to see saved songs, artists, and playlists in Your Collection.',
            },
            isInteract: false,
            requireLogin: !isLogin,
        },
        {
            id: 4,
            title: 'Your Library',
            icon: collapse || !existPlaylist ? <LibraryIcon /> : <FillLibraryIcon />,
            children: {
                title: 'Enjoy Your Library',
                description: 'Log in to see saved songs, artists, and playlists in Your Library.',
            },
            isInteract: false,
            requireLogin: !isLogin,
        },
        {
            id: 5,
            title: 'Create Playlist',
            to: `${config.routes.home}`,
            icon: <AiOutlinePlus />,
            children: {
                title: 'Create a playlist',
                description: 'Log in to create and share playlists.',
            },
            isInteract: true,
            requireLogin: !isLogin,
        },
        {
            id: 6,
            title: 'Liked Songs',
            to: `${config.routes.home}`,
            icon: <VscHeartFilled />,
            children: {
                title: 'Enjoy your Liked Songs',
                description: 'Log in to see all the songs you’ve liked in one easy playlist.',
            },
            isInteract: true,
            requireLogin: !isLogin,
        },
    ];

    const PROFILE_SUB_MENU = [
        {
            value: 'account',
            title: 'Account',
            rightIcon: <NewTabIcon />,
            href: config.externalLink.account,
            target: '_blank',
        },
        {
            value: 'profile',
            title: 'Profile',
            to: userData ? `user/${userData.id}` : '',
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
            'handle-create-playlist': true,
            lefticon: <MusicNotesIcon />,
        },
        {
            title: 'Create a playlist folder',
            lefticon: <FolderIcon />,
            'notification-text': 'The function is currently under development!',
            'handle-show-notification': true,
        },
    ];

    const SORT_SUB_MENU = [
        {
            value: 'sort',
            title: 'Sort by',
            disable: true,
        },
        {
            value: 'alphabetical',
            title: 'Alphabetical',
            active: !sortByCreator,
            sort: true,
        },
        {
            value: 'creator',
            title: 'Creator',
            active: sortByCreator,
            sort: true,
            border: 1,
        },
        {
            value: 'viewas',
            title: 'View as',
            disable: true,
        },
        {
            value: 'compact',
            title: 'Compact',
            lefticon: <CompactIcon />,
            active: compactLibrary,
        },
        {
            value: 'list',
            title: 'List',
            lefticon: <ListIcon />,
            active: !gridLibrary && !compactLibrary,
        },
        {
            value: 'grid',
            title: 'Grid',
            lefticon: <GridIcon />,
            active: !compactLibrary && gridLibrary,
        },
    ];

    const COLLECTION_TABS = [
        {
            value: 'playlists',
            title: 'Playlists',
            to: config.routes.savedPlaylist,
        },
        {
            value: 'artists',
            title: 'Artists',
            to: config.routes.followArtists,
        },
        {
            value: 'albums',
            title: 'Albums',
            to: config.routes.likedAlbums,
        },
        {
            value: 'songs',
            title: 'Songs',
            to: config.routes.likedTracks,
        },
    ];
    
    // Get API access token
    const spotifyApi = new SpotifyWebApi();
    const code = new URLSearchParams(window.location.search).get("code");
    let _token = useAuth(code);

    if (_token !== undefined) {
        window.localStorage.setItem('token', JSON.stringify(_token));
    }

    let access_token = JSON.parse(window.localStorage.getItem('token'));

    useEffect(() => {
        if (access_token !== undefined) {
            spotifyApi.setAccessToken(access_token);
            setToken(access_token);
        } else {
            setToken(null);
        }
    }, [access_token]);

    const handleLogout = () => {
        setToken('');
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('refresh_token');
    };

    useEffect(() => {
        let isMounted = true;

        if (token) {
            async function loadData() {
                await spotifyApi.getMe({}, function (error, data) {
                    if (error) {
                        console.error('Error:', error);
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    } else {
                        if (isMounted) {
                            setUserData(data);
                        }
                    }
                });
            }

            loadData();
        }

        return () => (isMounted = false);
    }, [token]);

    useEffect(() => {
        if (tokenError) {
            window.localStorage.removeItem('token');
            refreshToken();
            setTokenError(false);
        }
    }, [tokenError])

    useEffect(() => {
        if (access_token) {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    }, [access_token]);

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

    useEffect(() => {
        const data = [...myPlaylistsData];
        // if (data.length > 0) {
        //     data.map(item => item.img = '');
        // }
        localStorage.setItem('MY_PLAYLIST_DATA', JSON.stringify(data));
    }, [myPlaylistsData]);

    useEffect(() => {
        const dataObj = {
            playlist: libraryPlaylistIds,
            album: libraryAlbumIds,
            artist: libraryArtistIds,
        };
        localStorage.setItem('LIBRARY_DATA', JSON.stringify(dataObj));
    }, [libraryPlaylistIds, libraryAlbumIds, libraryArtistIds]);

    useEffect(() => {
        localStorage.setItem('LIKED_TRACKS_DATA', JSON.stringify(savedTracks));
    }, [savedTracks]);

    useEffect(() => {
        const obj = {
            panel: nowPlayingPanel,
            collapse: collapse,
            sort_creator: sortByCreator,
            compact_library: compactLibrary,
            gird_library: gridLibrary,
            enlarge: enlarge,
        };

        localStorage.setItem('CONDITION', JSON.stringify(obj));
    }, [nowPlayingPanel, collapse, sortByCreator, compactLibrary, gridLibrary, enlarge]);

    useEffect(() => {
        const obj = {
            next_queue: nextQueueId,
            next_from: nextFromId,
        };

        localStorage.setItem('MUSIC_LIST', JSON.stringify(obj));
    }, [nextQueueId, nextFromId]); 

    useEffect(() => {
        localStorage.setItem('CURRENT_INDEX', JSON.stringify(currentPlayingIndex));
    }, [currentPlayingIndex]);

    // console.log(functional.getInitialOther('MUSIC_LIST')['next_from'])

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

    const handleGetValueInput = (event, setFunc) => {
        setFunc(event.target.value);
    };

    const relatedLibrary = {
        compactLibrary,
        setCompactLibrary,
        gridLibrary,
        setGridLibrary,
        existPlaylist,
        setExistPlaylist,
        myPlaylistsData,
        setMyPlaylistsData,
        libraryPlaylistIds,
        setLibraryPlaylistIds,
        libraryAlbumIds,
        setLibraryAlbumIds,
        libraryArtistIds,
        setLibraryArtistIds,
        savedTracks,
        setSavedTracks,
        sortByCreator,
        setSortByCreator,
        myPlaylistId,
        setMyPlaylistId,
    };

    const cssAttribute = {
        containerWidth,
        setContainerWidth,
        ctnHeaderTextHeight,
        setCtnHeaderTextHeight,
        ctnHeaderTextSize,
        setCtnHeaderTextSize,
        widthNavbar,
        setWidthNavbar,
        columnCount,
        setColumnCount,
        bgHeaderColor,
        setBgHeaderColor,
        disableScroll, setDisableScroll,
        posHeaderNextBtn, setPosHeaderNextBtn,
        yPosScroll, setYPosScroll,
    };

    const queueContext = {
        nowPlayingId,
        setNowPlayingId,
        nextQueueId,
        setNextQueueId,
        nextFromId,
        setNextFromId,
    };

    const relatedSearch = {
        searchPageInputValue,
        setSearchPageInputValue,
        typeSearch,
        setTypeSearch,
        myPlaylistPageInputValue,
        setMyPlaylistPageInputValue,
        searchMyPlaylistValue,
        setSearchMyPlaylistValue,
        searchLibraryInputValue,
        setSearchLibraryInputValue,
    };

    const regardingDisplay = {
        isLogin,
        setIsLogin,
        isHomePage,
        setIsHomePage,
        searchPage,
        setSearchPage,
        showModal,
        setShowModal,
        showRequire,
        showRemind,
        setShowRemind,
        selectedItemNav,
        setSelectedItemNav,
        showPlayingView,
        setShowPlayingView,
        nowPlayingPanel,
        setNowPlayingPanel,
        showSubContent,
        setShowSubContent,
        typeSubContent,
        setTypeSubContent,
        mainContainer,
        setMainContainer,
        collapse,
        setCollapse,
        handleLogout,
        renderRequireLogin,
        renderModal,
        closeModal,
        remindText,
        setRemindText,
        enlarge, setEnlarge,
    };

    const playerControl = {
        playing,
        setPlaying,
        currentPlayingIndex,
        setCurrentPlayingIndex,
        waitingMusicList,
        setWaitingMusicList,
    };
    
    function getData(method, id = null, option = null) {
        if (option) {
            if (id) {
                return method(id, option)
                .then((data) => data)
                .catch((error) => {
                    console.error('Error:', error);
                    if (error.status === 401) {
                        setTokenError(true);
                    }
                });
            } else {
                return method(option)
                .then((data) => data)
                .catch((error) => {
                    console.error('Error:', error);
                    if (error.status === 401) {
                        setTokenError(true);
                    }
                });
            }
        } else {
            if (id) {
                return method(id)
                .then((data) => data)
                .catch((error) => {
                    console.error('Error:', error);
                    if (error.status === 401) {
                        setTokenError(true);
                    }
                });
            } else {
                return method()
                .then((data) => data)
                .catch((error) => {
                    console.error('Error:', error);
                    if (error.status === 401) {
                        setTokenError(true);
                    }
                });
            }
        }
    }

    return (
        <AppContext.Provider
            value={{
                SIDEBAR_ITEMS,
                PROFILE_SUB_MENU,
                CREATE_SUB_MENU,
                SORT_SUB_MENU,
                COLLECTION_TABS,
                token,
                userData,
                spotifyApi,
                availableLanguages,
                handleGetValueInput,
                contextMenu,
                setTokenError,
                getData,
                ...relatedLibrary,
                ...cssAttribute,
                ...queueContext,
                ...relatedSearch,
                ...regardingDisplay,
                ...functional,
                ...playerControl,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
