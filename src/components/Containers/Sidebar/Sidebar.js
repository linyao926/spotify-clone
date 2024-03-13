import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import { useContextMenu } from '~/hooks';
import { HiPlus, HiOutlineArrowRight, HiOutlineArrowLeft } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import { VscChromeClose } from 'react-icons/vsc';
import { LanguageIcon, DropDownIcon, DropUpIcon, GridIcon, ListIcon, CompactIcon } from '~/assets/icons/icons';
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
    
    const { SIDEBAR_ITEMS, 
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
        enlarge, setEnlarge,
    } = useContext(AppContext);

    const [resizeData, setResizeData] = useState({
        startCursorScreenX: null,
        minWidth: 130,
        maxWidth: 394,
        collapseWidth: 72,
        maxReduceWidth: 420,
        minEnlarge: 584,
        startWidth: getInitialRelatedNumber('SIDEBAR_CURRENT_WIDTH') || 282,
        startCursorScreenX: getInitialRelatedNumber('SIDEBAR_CURRENT_WIDTH') || 282,
        currentWidth: getInitialRelatedNumber('SIDEBAR_CURRENT_WIDTH') || 282,
    });
    const [renderSearchBar, setRenderSearchBar] = useState(false);
    const [filterType, setFilterType] = useState(false);
    const [isPlaylist, setIsPlaylist] = useState(false);
    const [isArtist, setIsArtist] = useState(false);
    const [isAlbum, setIsAlbum] = useState(false);
    const [playlistCreatorByYou, setPlaylistCreatorByYou] = useState(false);
    const [libraryContentHeight, setLibraryContentHeight] = useState(0);

    const { ref, isComponentVisible, setIsComponentVisible } = useContextMenu(false);

    const sidebarPanel = useRef('sidebarPanel');
    const preEndRef = useRef(null);
    const libraryHeaderRef = useRef(null);
    const libraryRef = useRef(null);

    const DEFAULT_SIDEBAR_WIDTH = 288;
    const { width } = useWindowSize();

    useEffect(() => {
        localStorage.setItem('SIDEBAR_CURRENT_WIDTH', JSON.stringify(resizeData.currentWidth));
    }, [resizeData.currentWidth]);

    useEffect(() => {
        if (isLogin) {
            setResizeData((prev) => ({
                ...prev,
                minWidth: 282,
                maxWidth: 922,
            }));

            setWidthNavbar(resizeData.currentWidth);
            sidebarPanel.current.style.width = resizeData.currentWidth + 'px';
        } else {
            setResizeData((prev) => ({
                ...prev,
                minWidth: 130,
                maxWidth: 394,
            }));

            setCollapse(false);
            setEnlarge(false);
            
            if (resizeData.currentWidth <= 394 && resizeData.currentWidth >= 130) {
                setWidthNavbar(resizeData.currentWidth);
                sidebarPanel.current.style.width = resizeData.currentWidth + 'px';
            } else {
                setWidthNavbar(DEFAULT_SIDEBAR_WIDTH);
                sidebarPanel.current.style.width = DEFAULT_SIDEBAR_WIDTH + 'px';
            }
        }
    }, [isLogin]);

    useEffect(() => {
        if (sidebarPanel.current) {
            setWidthNavbar(sidebarPanel.current.offsetWidth);
        }
    }, [sidebarPanel.current.offsetWidth]);

    useEffect(() => {
        if (collapse) {
            setResizeData((prev) => ({
                ...prev,
                currentWidth: resizeData.collapseWidth,
            }));
        }

        if (enlarge) {
            if (resizeData.currentWidth < resizeData.minEnlarge) {
                setResizeData((prev) => ({
                    ...prev,
                    currentWidth: resizeData.minEnlarge,
                }));
            }
        }
    }, [collapse, enlarge]);

    useEffect(() => {
        if (enlarge) {
            if (width - widthNavbar - 8 * 3 < 416) {
                setEnlarge(false);
            } 
        } 
    }, [widthNavbar]);

    useEffect (() => {
        setResizeData((prev) => ({
            ...prev,
            currentWidth: widthNavbar,
        }))
    }, [widthNavbar]);

    useEffect(() => {
        if (libraryRef.current && libraryHeaderRef.current) {
            if (preEndRef.current) {
                if (enlarge) {
                    if (gridLibrary) {
                        setLibraryContentHeight(libraryRef.current.getBoundingClientRect().height - libraryHeaderRef.current.getBoundingClientRect().height - preEndRef.current.getBoundingClientRect().height - 14*2 - 4);
                    } else {
                        setLibraryContentHeight(libraryRef.current.getBoundingClientRect().height - libraryHeaderRef.current.getBoundingClientRect().height - preEndRef.current.getBoundingClientRect().height - 14*2 - 26);
                    }
                } else {
                    setLibraryContentHeight(libraryRef.current.getBoundingClientRect().height - libraryHeaderRef.current.getBoundingClientRect().height - preEndRef.current.getBoundingClientRect().height - 14*2 - 11);
                }
            } else {
                setLibraryContentHeight(libraryRef.current.getBoundingClientRect().height - libraryHeaderRef.current.getBoundingClientRect().height - 14*2 - 4);
            }
        }
    }, [libraryRef.current?.getBoundingClientRect().height, libraryHeaderRef.current?.getBoundingClientRect().height, preEndRef?.current?.getBoundingClientRect().height, enlarge, widthNavbar, gridLibrary])

    function handleMousedown(e) {   
        setResizeData((prev) => ({
            ...prev,
            startWidth: sidebarPanel.current.offsetWidth,
            startCursorScreenX: e.screenX,
        }));
        document.addEventListener('mousemove', handleMousemove);
    }

    function handleMousemove(e) {
        sidebarPanel.current.style.cursor = 'grabbing';
        const cursorScreenXDelta = e.screenX - resizeData.startCursorScreenX;
        let newWidth = Math.min(resizeData.startWidth + cursorScreenXDelta, resizeData.maxWidth);
        // console.log(newWidth)
        if (isLogin) {
            if (newWidth < resizeData.collapseWidth) {
                newWidth = resizeData.collapseWidth;
                sidebarPanel.current.style.width = resizeData.collapseWidth + 'px';
            } else if (newWidth >= resizeData.collapseWidth * 2) {
                setCollapse(false);
                if (newWidth < resizeData.minWidth) {
                    newWidth = resizeData.minWidth;
                } else if (newWidth <= resizeData.maxReduceWidth) { 
                    newWidth = newWidth;
                } else if (newWidth >= resizeData.maxReduceWidth + 72) {
                    setEnlarge(true);
                    if (newWidth < resizeData.minEnlarge) {
                        newWidth = resizeData.minEnlarge;
                    } else if (newWidth > resizeData.maxWidth){
                        newWidth = resizeData.maxWidth;
                    }
                } else {
                    setEnlarge(false);
                    newWidth = resizeData.maxReduceWidth;
                }

                if (width - newWidth - 8 * 3 < 416) {
                    while (width - newWidth - 8 * 3 < 416) {
                        newWidth -= 1;
                        if (newWidth < resizeData.minEnlarge) {
                            setEnlarge(false);
                            newWidth = resizeData.maxReduceWidth;
                        }
                        if (newWidth < resizeData.minWidth) {
                            newWidth = resizeData.collapseWidth;
                            setCollapse(true);
                        }
                    }
                }
                sidebarPanel.current.style.width = newWidth + 'px';
            } else {
                sidebarPanel.current.style.width = resizeData.collapseWidth + 'px';
                setCollapse(true);
            }
        } else {
            newWidth = Math.max(resizeData.minWidth, newWidth);
            sidebarPanel.current.style.width = newWidth + 'px';
        }

        setWidthNavbar(sidebarPanel.current.offsetWidth);
        document.addEventListener('mouseup', handleMouseup);
    }

    function handleMouseup(e) {
        sidebarPanel.current.style.cursor = 'default'; 
        document.removeEventListener('mousemove', handleMousemove);
        document.removeEventListener('mouseup', handleMouseup);
    }

    function handleEnlarge() {
        if (enlarge) {
            setEnlarge(false);
            sidebarPanel.current.style.width = resizeData.maxReduceWidth + 'px';
        } else {
            if (width - resizeData.minEnlarge - 8 * 3 >= 416) {
                setEnlarge(true);
                sidebarPanel.current.style.width = resizeData.minEnlarge + 'px';
            }
        }
    }

    function handleCollapse() {
        if (collapse) {
            setCollapse(false);
            sidebarPanel.current.style.width = resizeData.minWidth + 'px';
        } else {
            setCollapse(true);
            sidebarPanel.current.style.width = resizeData.collapseWidth + 'px';
        }
    };

    let rect;

    if (preEndRef.current) {
        rect = preEndRef.current.getBoundingClientRect();
    }

    let sortRect;

    if (ref.current) {
        sortRect = ref.current.getBoundingClientRect();
    }

    return isLogin ? (
        <nav className={cx('navbar', 'login')} ref={sidebarPanel}>
            <ul className={cx('navigation', 'login')}>
                <Item item={SIDEBAR_ITEMS[0]} onClick={() => setShowSubContent(false)} />
                <Item item={SIDEBAR_ITEMS[1]} />
                <Item item={SIDEBAR_ITEMS[2]} /> 
            </ul>

            <div className={cx('library')}
                ref={libraryRef}
            >
                <div className={cx('library-control')}
                    ref={libraryHeaderRef}
                >
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
                            {width - resizeData.minEnlarge - 8 * 3 >= 416 && (enlarge ? (
                                <ButtonPrimary rounded dark icon className={cx('tooltip')}
                                    style={{marginLeft: '8px'}}
                                >
                                    <HiOutlineArrowLeft onClick={() => handleEnlarge()} />
                                    <span className={cx('tooltiptext')}>Reduce Your Library</span>
                                </ButtonPrimary>
                            ) : (
                                <ButtonPrimary rounded dark icon className={cx('tooltip')}
                                    style={{marginLeft: '8px'}}
                                >
                                    <HiOutlineArrowRight onClick={() => handleEnlarge()} />
                                    <span className={cx('tooltiptext')}>Enlarge Your Library</span>
                                </ButtonPrimary>
                            ))}
                        </div>
                    )}
                </div>
                {!collapse && existPlaylist && (
                    <div className={cx(enlarge && 'wrapper-library-interact')} ref={preEndRef}>
                        <div className={cx('library-creator')}>
                            {filterType ? (
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
                            )
                            :  <>
                                {(myPlaylistsData.length > 0 || libraryPlaylistIds || savedTracks.length > 0) && <ButtonPrimary
                                    smaller
                                    className={cx('type-btn', isPlaylist && 'active')}
                                    onClick={() => {
                                        setIsPlaylist(!isPlaylist);
                                        setFilterType(!filterType);
                                    }}
                                >
                                    Playlists
                                </ButtonPrimary>}
                                {libraryArtistIds && libraryArtistIds.length > 0 && <ButtonPrimary
                                    smaller
                                    className={cx('type-btn', isArtist && 'active')}
                                    onClick={() => {
                                        setIsArtist(!isArtist);
                                        setFilterType(!filterType);
                                    }}
                                >
                                    Artists
                                </ButtonPrimary>}
                                {libraryAlbumIds && libraryAlbumIds.length > 0 && <ButtonPrimary
                                    smaller
                                    className={cx('type-btn', isAlbum && 'active')}
                                    onClick={() => {
                                        setIsAlbum(!isAlbum);
                                        setFilterType(!filterType);
                                    }}
                                >
                                    Albums
                                </ButtonPrimary>}
                            </>}
                            {!playlistCreatorByYou && (
                                <>
                                    {isPlaylist && <>
                                        <ButtonPrimary
                                            smaller
                                            className={cx('type-btn', isPlaylist && 'active')}
                                            onClick={() => {
                                                setIsPlaylist(!isPlaylist);
                                                setFilterType(!filterType);
                                            }}
                                        >
                                            Playlists
                                        </ButtonPrimary>
                                        <ButtonPrimary smaller onClick={() => setPlaylistCreatorByYou(true)}>
                                            By you
                                        </ButtonPrimary>
                                    </>}
                                    {isArtist && <ButtonPrimary
                                        smaller
                                        className={cx('type-btn', isArtist && 'active')}
                                        onClick={() => {
                                            setIsArtist(!isArtist);
                                            setFilterType(!filterType);
                                        }}
                                    >
                                        Artists
                                    </ButtonPrimary>}
                                    {isAlbum && <ButtonPrimary
                                        smaller
                                        className={cx('type-btn', isAlbum && 'active')}
                                        onClick={() => {
                                            setIsAlbum(!isAlbum);
                                            setFilterType(!filterType);
                                        }}
                                    >
                                        Albums
                                    </ButtonPrimary>}
                                </>
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
                                    {compactLibrary ? <CompactIcon /> : (gridLibrary ? <GridIcon /> : <ListIcon />)}
                                </span>
                                {isComponentVisible && <SubMenu className={cx('submenu')} 
                                    menu={SORT_SUB_MENU} 
                                    onClick={() => setIsComponentVisible(false)} 
                                    right={ref && ref.current.getBoundingClientRect().left - ref.current.offsetWidth - 18}
                                    bottom={window.innerHeight - sortRect.y}
                                    pointY={sortRect.y + sortRect.height + 8}
                                    sidebar
                                />}
                            </button>
                        </div>
                    </div>
                )}
                <Library all={isAlbum ? false : 
                        (isArtist ? false : 
                            (isPlaylist ? false : true
                        ))} 
                    isAlbum={isAlbum}
                    isArtist={isArtist}
                    isPlaylist={isPlaylist}
                    isMyPlaylist={playlistCreatorByYou}
                    top={rect && rect.bottom }
                    bottom={sidebarPanel.current && sidebarPanel.current.clientHeight}
                    height={libraryContentHeight}
                />
            </div>

            <div className={cx('dragger', 'login')} onMouseDown={(e) => handleMousedown(e)} />
        </nav>
    ) : (
        <nav className={cx('navbar')} ref={sidebarPanel} style={{ width: `${resizeData.currentWidth}px` }}>
            <Link to={config.routes.home}>
                <img src={images.logo} alt="Spotify logo" className={cx('logo-img')} />
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

            <div className={cx('dragger')} onMouseDown={(e) => handleMousedown(e)} />
        </nav>
    );
}

export default Sidebar;
