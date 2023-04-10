import {createContext, useState, useEffect} from 'react';
import { HomeIcon, SearchIcon, LibraryIcon, LanguageIcon } from '~/assets/icons/icons';
import { AiOutlinePlus } from 'react-icons/ai';
import { VscHeartFilled } from 'react-icons/vsc';
import config from '~/config';

export const AppContext = createContext();

export const AppContextProvider = ({children}) => {
    const [isLogin, setIsLogin] = useState(false);
    const [requireLogin, setRequireLogin] = useState(true);
    const [selectedItemNav, setSelectedItemNav] = useState(null);
    const [showRequire, setShowRequire] = useState(false);

    useEffect(() => {
        if (isLogin) {
            setRequireLogin(false);
        }
    }, [isLogin])

    const MENU_ITEMS = [
        {
            id: 1,
            title: 'Home',
            to: `${config.routes.home}`,
            icon: <HomeIcon />,
            isInteract: false,
            requireLogin: false,
        },
        {
            id: 2,
            title: 'Search',
            to: `${config.routes.search}`,
            icon: <SearchIcon />,
            isInteract: false,
            requireLogin: false,
        },
        {
            id: 3,
            title: 'Your Library',
            to: `${config.routes.library}`,
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

    const renderRequireLogin = (e, idItem = undefined) => {
        e.stopPropagation();
        let item;
        if (idItem) {
            item = MENU_ITEMS.find((itemMenu) => itemMenu.id === idItem);
            if (item.requireLogin) {
                setSelectedItemNav(item);
                setShowRequire(true);
            } else {
                setShowRequire(false);
            }
        } else {
            setShowRequire(false);
        }
    }

    return (
        <AppContext.Provider value={
            {
                MENU_ITEMS,
                isLogin,
                setIsLogin,
                showRequire,
                setShowRequire,
                renderRequireLogin,
                selectedItemNav,
            }
        }>
            {children}
        </AppContext.Provider>
    )
};