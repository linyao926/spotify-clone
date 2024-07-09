import { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import { useContextMenu } from '~/hooks';
import { HiOutlineArrowRight, HiOutlineArrowLeft } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import { VscChromeClose } from 'react-icons/vsc';
import { LanguageIcon, GridIcon, ListIcon, CompactIcon } from '~/assets/icons/icons';
import images from '~/assets/images';
import config from '~/config';
import SubMenu from '~/components/Blocks/SubMenu';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import SearchForm from '~/components/Blocks/SearchForm';
import Library from '../Library';
import CreatePlaylist from './CreatePlaylist';
import Item from './Item';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

function Sidebar() {
    const {
        SIDEBAR_ITEMS,
        SORT_SUB_MENU,
        isLogin,
        renderModal,
        widthNavbar,
        setWidthNavbar,
        collapse,
        setCollapse,
        gridLibrary,
        compactLibrary,
        setShowSubContent,
        existPlaylist,
        myPlaylistsData,
        libraryPlaylistIds,
        libraryAlbumIds,
        libraryArtistIds,
        savedTracks,
        searchLibraryInputValue,
        setSearchLibraryInputValue,
        getInitialRelatedNumber,
        enlarge,
        setEnlarge,
        showPlayingView,
        setShowPlayingView,
        playingPanelWidth,
    } = useContext(AppContext);

    const [resizeData, setResizeData] = useState({
        login: {
            min: 130,
            max: 394,
        },
        collapse: 72,
        normal: {
            min: 282,
            max: 420,
        },
        enlarge: {
            min: 584,
            max: 922,   
        },
        startWidth: getInitialRelatedNumber('SIDEBAR_CURRENT_WIDTH'),
        startCursorScreenX: getInitialRelatedNumber('SIDEBAR_CURRENT_WIDTH'),
        currentWidth: getInitialRelatedNumber('SIDEBAR_CURRENT_WIDTH'),
    });
    const [renderSearchBar, setRenderSearchBar] = useState(false);
    const [filterType, setFilterType] = useState(false);
    const [isPlaylist, setIsPlaylist] = useState(false);
    const [isArtist, setIsArtist] = useState(false);
    const [isAlbum, setIsAlbum] = useState(false);
    const [playlistCreatorByYou, setPlaylistCreatorByYou] = useState(false);
    const [libraryContentHeight, setLibraryContentHeight] = useState(0);
    const [startDrag, setStartDrag] = useState(false);

    const { ref, isComponentVisible, setIsComponentVisible } = useContextMenu(false);

    const sidebarPanel = useRef('sidebarPanel');
    const dragging = useRef(false);
    const preEndRef = useRef(null);
    const libraryHeaderRef = useRef(null);
    const libraryRef = useRef(null);

    const DEFAULT_SIDEBAR_WIDTH = 282;
    const { width } = useWindowSize();
    const gap = 8 * 3;

    // Get height of library content
    useEffect(() => {
        if (libraryRef.current && libraryHeaderRef.current) {
            if (preEndRef.current) {
                if (enlarge) {
                    if (gridLibrary) {
                        setLibraryContentHeight(
                            libraryRef.current.getBoundingClientRect().height -
                                libraryHeaderRef.current.getBoundingClientRect().height -
                                preEndRef.current.getBoundingClientRect().height -
                                14 * 2 -
                                4,
                        );
                    } else {
                        setLibraryContentHeight(
                            libraryRef.current.getBoundingClientRect().height -
                                libraryHeaderRef.current.getBoundingClientRect().height -
                                preEndRef.current.getBoundingClientRect().height -
                                14 * 2 -
                                26,
                        );
                    }
                } else {
                    setLibraryContentHeight(
                        libraryRef.current.getBoundingClientRect().height -
                            libraryHeaderRef.current.getBoundingClientRect().height -
                            preEndRef.current.getBoundingClientRect().height -
                            14 * 2 -
                            11,
                    );
                }
            } else {
                setLibraryContentHeight(
                    libraryRef.current.getBoundingClientRect().height -
                        libraryHeaderRef.current.getBoundingClientRect().height -
                        14 * 2 -
                        4,
                );
            }
        }
    }, [
        libraryRef.current?.getBoundingClientRect().height,
        libraryHeaderRef.current?.getBoundingClientRect().height,
        preEndRef?.current?.getBoundingClientRect().height,
        enlarge,
        widthNavbar,
        gridLibrary,
    ]);

    // Drag 
    useEffect(() => {
        if (!isLogin) {
            if (resizeData.currentWidth > resizeData.login.max || resizeData.currentWidth < resizeData.login.min) {
                const copy = {...resizeData};
                copy.currentWidth = 282;
                setResizeData(copy);
            }
            setCollapse(false);
            setEnlarge(false);
        }
    }, [isLogin]);

    useEffect(() => {
        if (enlarge) {
            if (width - widthNavbar - gap < 416) {
                setEnlarge(false);
            }
        }
    }, [widthNavbar, width]);

    useEffect(() => {
        if (showPlayingView && width - widthNavbar - playingPanelWidth - gap < 416) {
            setCollapse(true);
        }
    }, [showPlayingView, width]);

    // Change width with value of collapse and enlarge
    useEffect(() => {
        const copy = {...resizeData};
        let newWidth = copy.currentWidth;
        if (collapse) {
            copy.currentWidth = resizeData.collapse;
            newWidth = resizeData.collapse;
        } else {
            if (enlarge) {
                if (resizeData.currentWidth < resizeData.enlarge.min) {
                    copy.currentWidth = resizeData.enlarge.min;
                    newWidth = resizeData.enlarge.min;
                }
            } else if (resizeData.currentWidth >= resizeData.enlarge.min) {
                copy.currentWidth = DEFAULT_SIDEBAR_WIDTH;
                newWidth = DEFAULT_SIDEBAR_WIDTH;
            }
        } 
        
        if (newWidth === resizeData.collapse && !collapse) {
            newWidth = DEFAULT_SIDEBAR_WIDTH;
            copy.currentWidth = DEFAULT_SIDEBAR_WIDTH;
        }
        
        setResizeData(copy);
        sidebarPanel.current.style.width = newWidth + 'px';
    }, [collapse, enlarge]);

    // Functional
    const handleMouseMove = useCallback((e) => {
        if (!dragging.current) {
            return;
        }
        sidebarPanel.current.style.cursor = 'grabbing';
        const cursorScreenXDelta = e.screenX - resizeData.startCursorScreenX;

        let maxWidth;
        let minWidth;
        if (!isLogin) {
            maxWidth = resizeData.login.max;
            minWidth = resizeData.login.min;
        } else {
            maxWidth = resizeData.enlarge.max;
            minWidth = resizeData.collapse;
        }

        let newWidth = Math.min(resizeData.startWidth + cursorScreenXDelta, maxWidth);

        if (isLogin) {
            if (newWidth < (resizeData.normal.min / 2)) {
                newWidth = resizeData.collapse;
                setCollapse(true);
            } else if (newWidth >= (resizeData.normal.min / 2)) {
                setCollapse(false);
                if (newWidth < resizeData.normal.min) {
                    newWidth = resizeData.normal.min;
                } else if (newWidth <= resizeData.normal.max) {
                    newWidth = newWidth;
                } else {
                    if (newWidth >= (resizeData.normal.max / 2)) {
                        setEnlarge(true);
                        if (newWidth < resizeData.enlarge.min) {
                            newWidth = resizeData.enlarge.min
                        }
                    } else if (enlarge) {
                        setEnlarge(false);
                        newWidth = resizeData.normal.max;
                    }
                }

                if (width - newWidth - gap < 416) {
                    newWidth = width - gap - 416;
                    if (newWidth < resizeData.enlarge.min) {
                        setEnlarge(false);
                        if (newWidth > resizeData.normal.max) {
                            newWidth = resizeData.normal.max;
                        }
                    } else if (newWidth < resizeData.normal.min) {
                        newWidth = resizeData.collapse;
                        setCollapse(true);
                    }
                }
            } 
        } else {
            newWidth = Math.max(minWidth, newWidth);
        }
        const copy = {...resizeData};
        copy.currentWidth = newWidth;
        setResizeData(copy);
        sidebarPanel.current.style.width = newWidth + 'px';
    }, []);

    const handleMouseDown = useCallback((e) => {
        const copy = {...resizeData};
        copy.startWidth = sidebarPanel.current.offsetWidth;
        copy.startCursorScreenX = e.screenX;
        setResizeData(copy);
        dragging.current = true;
    }, []);

    const handleMouseUp = useCallback((e) => {
        sidebarPanel.current.style.cursor = 'default';
        setStartDrag(false);
        dragging.current = false;
    }, []);

    useEffect(() => {
        if (startDrag) {
            document.addEventListener("mousedown", handleMouseDown);
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("mousemove", handleMouseMove);
        
            return () => {
                document.removeEventListener("mousedown", handleMouseDown);
                document.removeEventListener("mouseup", handleMouseUp);
                document.removeEventListener("mousemove", handleMouseMove);
            };
        }
    }, [dragging, handleMouseDown, handleMouseUp, handleMouseMove, startDrag]);

    // Local storage sidebar width
    useEffect(() => {
        localStorage.setItem('SIDEBAR_CURRENT_WIDTH', JSON.stringify(resizeData.currentWidth));
    }, [resizeData.currentWidth]);

    useEffect(() => {
        setWidthNavbar(resizeData.currentWidth);
    }, [resizeData.currentWidth]);

    function handleEnlarge() {
        setEnlarge(!enlarge);
    }

    function handleCollapse() {
        if (collapse) {
            if (showPlayingView) {
                if (width - resizeData.normal.min - playingPanelWidth - gap < 416) {
                    setShowPlayingView(false);
                }
            }
            setCollapse(false);
        } else {
            setCollapse(true);
        }
    }

    // Get position
    let rect;

    if (preEndRef.current) {
        rect = preEndRef.current.getBoundingClientRect();
    }

    let sortRect;

    if (ref.current) {
        sortRect = ref.current.getBoundingClientRect();
    };

    const renderButton = (props, handleClick) => {
        return (
            <ButtonPrimary
                smaller
                className={cx('type-btn', props.active && 'active')}
                onClick={handleClick}
            >
                {props.text}
            </ButtonPrimary>
        );
    }

    return isLogin ? (
        <nav className={cx('navbar', 'login')} ref={sidebarPanel}>
            <ul className={cx('navigation', 'login')}>
                <Item item={SIDEBAR_ITEMS[0]} onClick={() => setShowSubContent(false)} />
                <Item item={SIDEBAR_ITEMS[1]} />
                <Item item={SIDEBAR_ITEMS[2]} />
            </ul>

            <div className={cx('library')} ref={libraryRef}>
                <div className={cx('library-control')} ref={libraryHeaderRef}>
                    <div className={cx('collapse')}>
                        <button className={cx('tooltip', 'collapse-btn')} onClick={() => handleCollapse()}>
                            <div className={cx('collapse-btn-icon')}>{SIDEBAR_ITEMS[3].icon}</div>
                            {collapse ? (
                                <span className={cx('tooltiptext', 'collapse-tooltiptext')}>Expand Your Library</span>
                            ) : (
                                <>
                                    <span className={cx('tooltiptext')}>Collapse Your Library</span>
                                    <span>{SIDEBAR_ITEMS[3].title}</span>
                                </>
                            )}
                        </button>
                        {collapse && !existPlaylist && <CreatePlaylist collapse />}
                    </div>
                    {!collapse && (
                    <div className={cx('library-control-icons')}>
                        <CreatePlaylist />
                        {width - resizeData.enlarge.min - gap >= 416 && (
                        <ButtonPrimary
                            rounded
                            dark
                            icon
                            className={cx('tooltip')}
                            style={{ marginLeft: '8px' }}
                            onClick={() => handleEnlarge()} 
                        >
                            {enlarge ? <HiOutlineArrowLeft /> : <HiOutlineArrowRight />}
                            <span className={cx('tooltiptext')}>
                                {enlarge ? 'Reduce Your Library' : 'Enlarge Your Library'}
                            </span>
                        </ButtonPrimary>)}
                    </div>)}
                </div>
                {!collapse && existPlaylist && (
                    <div className={cx(enlarge && 'wrapper-library-interact')} 
                        ref={preEndRef}
                    >
                        <div className={cx('library-creator')}>
                            {filterType && (
                                <button
                                    className={cx('library-creator-btn')}
                                    onClick={() => {
                                        setFilterType(false);
                                        setIsPlaylist(false);
                                        setIsArtist(false);
                                        setIsAlbum(false);
                                        setPlaylistCreatorByYou(false);
                                    }}
                                >
                                    <VscChromeClose />
                                </button>
                            )}
                            {(myPlaylistsData.length > 0 || libraryPlaylistIds.length > 0 || savedTracks.length > 0) 
                            && ((filterType && isPlaylist) || !filterType) 
                            && !playlistCreatorByYou 
                            && (
                                <>
                                    {renderButton(
                                        {
                                            text: 'Playlists',
                                            active: isPlaylist
                                        },
                                        () => {
                                            setIsPlaylist(!isPlaylist);
                                            setFilterType(!filterType);
                                        }
                                    )}
                                    {isPlaylist && <ButtonPrimary 
                                        smaller 
                                        onClick={() => setPlaylistCreatorByYou(true)}
                                    >
                                        By you
                                    </ButtonPrimary>}
                                </>
                            )}
                            {libraryArtistIds && libraryArtistIds.length > 0 
                            && ((filterType && isArtist) || !filterType) 
                            && renderButton(
                                {
                                    text: 'Artists',
                                    active: isArtist
                                },
                                () => {
                                    setIsArtist(!isArtist);
                                    setFilterType(!filterType);
                                }
                            )}
                            {libraryAlbumIds && libraryAlbumIds.length > 0 
                            && ((filterType && isAlbum) || !filterType) 
                            && renderButton(
                                {
                                    text: 'Albums',
                                    active: isAlbum
                                },
                                () => {
                                    setIsAlbum(!isAlbum);
                                    setFilterType(!filterType);
                                }
                            )}
                            {isPlaylist && playlistCreatorByYou && (
                                <button className={cx('active-by-you')}>
                                    <span
                                        onClick={() => {
                                            setPlaylistCreatorByYou(false);
                                        }}
                                    >
                                        Playlists
                                    </span>
                                    <p onClick={() => setPlaylistCreatorByYou(false)}>By you</p>
                                </button>
                            )}
                        </div>
                        <div className={cx('library-interact')}>
                            <div className={cx('library-search')}>
                                <ButtonPrimary
                                    rounded
                                    dark
                                    icon
                                    className={cx('tooltip', 'library-search-btn', renderSearchBar ? 'hide' : null)}
                                    onClick={() => setRenderSearchBar(true)}
                                >
                                    <BiSearch />
                                    <span className={cx('tooltiptext')}>Search in Your Library</span>
                                </ButtonPrimary>
                                <SearchForm
                                    placeholder="Search in Your Library"
                                    renderSearchBar={renderSearchBar}
                                    renderSearchBarFunc={setRenderSearchBar}
                                    setFunc={setSearchLibraryInputValue}
                                    inputValue={searchLibraryInputValue}
                                    sidebar
                                />
                            </div>
                            <button
                                className={cx('library-sort-dropdown')}
                                onClick={() => setIsComponentVisible(!isComponentVisible)}
                                ref={ref}
                            >
                                <span className={cx('dropdown-title')}>
                                    {SORT_SUB_MENU.map((item) => {
                                        if (item.active && item.sort) {
                                            return item.title;
                                        }
                                    })}
                                </span>
                                <span className={cx('dropdown-icon')}>
                                    {compactLibrary ? <CompactIcon /> : gridLibrary ? <GridIcon /> : <ListIcon />}
                                </span>
                                {isComponentVisible && (
                                    <SubMenu
                                        className={cx('submenu')}
                                        menu={SORT_SUB_MENU}
                                        handleCloseSubMenu={() => setIsComponentVisible(false)}
                                        right={
                                            ref &&
                                            ref.current.getBoundingClientRect().left - ref.current.offsetWidth - 18
                                        }
                                        bottom={window.innerHeight - sortRect.y}
                                        pointY={sortRect.y + sortRect.height + 8}
                                        sidebar
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                )}
                <Library
                    all={isAlbum ? false : isArtist ? false : isPlaylist ? false : true}
                    isAlbum={isAlbum}
                    isArtist={isArtist}
                    isPlaylist={isPlaylist}
                    isMyPlaylist={playlistCreatorByYou}
                    top={rect && rect.bottom}
                    bottom={sidebarPanel.current && sidebarPanel.current.clientHeight}
                    height={libraryContentHeight}
                />
            </div>

            <div className={cx('dragger', 'login')} 
                onMouseDown={() => setStartDrag(true)} 
            />
        </nav>
    ) : (
        <nav className={cx('navbar')} ref={sidebarPanel} style={{ width: `${resizeData.currentWidth}px` }}>
            <Link to={config.routes.home}>
                <img loading="lazy" src={images.logo} alt="Spotify logo" className={cx('logo-img')} />
            </Link>
            <ul className={cx('navigation')}>
                <Item item={SIDEBAR_ITEMS[0]} />
                <Item item={SIDEBAR_ITEMS[1]} />
                <Item item={SIDEBAR_ITEMS[2]} />
                <Item item={SIDEBAR_ITEMS[3]} />
            </ul>

            <ul className={cx('interact-song')}>
                <Item item={SIDEBAR_ITEMS[4]} classNames="create-playlist" />
                <Item item={SIDEBAR_ITEMS[5]} classNames="liked-songs" />
            </ul>

            <a className={cx('cookies-link')} href={config.externalLink.cookies} target="_blank">
                Cookies
            </a>
            <ButtonPrimary outline lefticon={<LanguageIcon />} onClick={() => renderModal()}>
                English
            </ButtonPrimary>

            <div className={cx('dragger')} 
                onMouseDown={() => setStartDrag(true)}
            />
        </nav>
    );
}

export default Sidebar;
