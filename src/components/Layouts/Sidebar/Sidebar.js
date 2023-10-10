import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link } from 'react-router-dom';
import { useContextMenu } from '~/hooks';
import { HiPlus, HiOutlineArrowRight, HiOutlineArrowLeft } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import { VscChromeClose } from 'react-icons/vsc';
import { LanguageIcon, DropDownIcon, DropUpIcon, GridIcon, ListIcon } from '~/assets/icons/icons';
import images from '~/assets/images';
import Library from './Library';
import SubMenu from '~/components/Layouts/SubMenu';
import Button from '~/components/Button';
import CreatePlaylist from './CreatePlaylist';
import Item from './Item';
import SearchForm from '~/components/SearchForm';
import config from '~/config';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

function Sidebar() {
    const [resizeData, setResizeData] = useState({
        tracking: false,
        startCursorScreenX: null,
        maxWidth: 394,
        minWidth: 130,
    });
    const [enlarge, setEnlarge] = useState(false);
    const [renderSearchBar, setRenderSearchBar] = useState(false);
    const [filterType, setFilterType] = useState(false);
    const [isPlaylist, setIsPlaylist] = useState(false);
    const [isArtist, setIsArtist] = useState(false);
    const [isAlbum, setIsAlbum] = useState(false);
    const [playlistCreatorByYou, setPlaylistCreatorByYou] = useState(false);

    const { SIDEBAR_ITEMS, 
        SORT_SUB_MENU, 
        isLogin, 
        renderModal, 
        widthNavbar, 
        setWidthNavbar, 
        collapse, 
        setCollapse,
        gridLibrary,
        setGridLibrary, 
        setShowSubContent,
        existPlaylist,
        myPlaylistsData,
        libraryPlaylistIds,
        libraryAlbumIds,
        libraryArtistIds,
        savedTracks,
        searchLibraryInputValue, 
        setSearchLibraryInputValue,
    } = useContext(AppContext);

    const { ref, isComponentVisible, setIsComponentVisible } = useContextMenu(false);

    const sidebarPanel = useRef('sidebarPanel');
    const preEndRef = useRef(null);

    const SIDEBAR_WIDTH = 282;

    useEffect(() => {
        if (isLogin) {
            setResizeData((prev) => ({
                ...prev,
                minWidth: 282,
                minEnlarge: 584,
                enlargeWidth: 824,
                maxReduceWidth: 420,
                collapseWidth: 72,
                maxWidth: 922,
            }));
        } else {
            setWidthNavbar(SIDEBAR_WIDTH);
            sidebarPanel.current.style.width = SIDEBAR_WIDTH + 'px';
        }
    }, [isLogin]);

    useEffect(() => {
        if (widthNavbar >= resizeData.minEnlarge) {
            setEnlarge(true);
        }
        if (widthNavbar <= resizeData.maxReduceWidth) {
            setEnlarge(false);
        }
        if (widthNavbar <= resizeData.collapseWidth) {
            setCollapse(true);
        }
        if (widthNavbar >= resizeData.minWidth) {
            setCollapse(false);
        }
    }, [widthNavbar]);

    setWidthNavbar(sidebarPanel.current.offsetWidth);

    function handleMousedown(e) {
        e.stopPropagation();
        e.preventDefault();
        setResizeData((prev) => ({
            ...prev,
            startWidth: sidebarPanel.current.offsetWidth,
            startCursorScreenX: e.screenX,
            tracking: true,
        }));

        document.addEventListener('mousemove', handleMousemove);
        document.addEventListener('mouseup', handleMouseup);
    }

    function handleMousemove(e) {
        if (resizeData.tracking) {
            const cursorScreenXDelta = e.screenX - resizeData.startCursorScreenX;
            let newWidth = Math.min(resizeData.startWidth + cursorScreenXDelta, resizeData.maxWidth);
            if (isLogin) {
                if (newWidth >= resizeData.minEnlarge) {
                    newWidth = Math.max(resizeData.minEnlarge, newWidth);
                }
                if (newWidth <= resizeData.maxReduceWidth && newWidth > resizeData.collapseWidth) {
                    newWidth = Math.min(resizeData.maxReduceWidth, newWidth);
                    newWidth = Math.max(resizeData.minWidth, newWidth);
                }
                if (newWidth < resizeData.minEnlarge && newWidth > resizeData.maxReduceWidth) {
                    newWidth = resizeData.maxReduceWidth;
                }
                if (collapse) {
                    if (newWidth < resizeData.minWidth) {
                        newWidth = resizeData.collapseWidth;
                    }
                } else {
                    if (newWidth <= resizeData.collapseWidth) {
                        newWidth = resizeData.collapseWidth;
                    }
                }
            } else {
                newWidth = Math.max(resizeData.minWidth, newWidth);
            }
            sidebarPanel.current.style.width = newWidth + 'px';
            setWidthNavbar(sidebarPanel.current.offsetWidth);
        }
    }

    function handleMouseup(e) {
        if (resizeData.tracking) {
            setResizeData((prev) => ({
                ...prev,
                tracking: false,
            }));
        }
        document.removeEventListener('mousemove', handleMousemove);
        document.removeEventListener('mouseup', handleMouseup);
    }

    function handleEnlarge() {
        if (enlarge) {
            setEnlarge(false);
            sidebarPanel.current.style.width = resizeData.maxReduceWidth + 'px';
        } else {
            setEnlarge(true);
            sidebarPanel.current.style.width = resizeData.minEnlarge + 'px';
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

    // console.log(sidebarPanel)

    // console.log(rect)

    return isLogin ? (
        <nav className={cx('navbar', 'login')} ref={sidebarPanel} style={{ width: `${SIDEBAR_WIDTH}px` }}>
            <ul className={cx('navigation', 'login')}>
                <Item item={SIDEBAR_ITEMS[0]} onClick={() => setShowSubContent(false)} />
                <Item item={SIDEBAR_ITEMS[1]} />
                <Item item={SIDEBAR_ITEMS[2]} /> 
            </ul>

            <div className={cx('playlist')}>
                <div className={cx('playlist-control')}>
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
                        <div className={cx('playlist-control-icons')}>
                            <CreatePlaylist />
                            {enlarge ? (
                                <div>
                                    <Button rounded dark icon className={cx('grid-btn', 'tooltip')}
                                        onClick={() => setGridLibrary(!gridLibrary)}
                                    >
                                        {gridLibrary ? <ListIcon /> : <GridIcon />}
                                        {gridLibrary 
                                            ? <span className={cx('tooltiptext')}>Switch to list view</span>
                                            : <span className={cx('tooltiptext')}>Switch to grid view</span>
                                        }
                                    </Button>
                                    <Button rounded dark icon className={cx('tooltip')}>
                                        <HiOutlineArrowLeft onClick={() => handleEnlarge()} />
                                        <span className={cx('tooltiptext')}>Reduce Your Library</span>
                                    </Button>
                                </div>
                            ) : (
                                <Button rounded dark icon className={cx('tooltip')}>
                                    <HiOutlineArrowRight onClick={() => handleEnlarge()} />
                                    <span className={cx('tooltiptext')}>Enlarge Your Library</span>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
                {!collapse && existPlaylist && (
                    <div className={cx(enlarge && 'wrapper-playlist-interact')} ref={preEndRef}>
                        <div className={cx('playlist-creator')}>
                            {filterType ? (
                                <button
                                    className={cx('playlist-creator-btn')}
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
                                {(myPlaylistsData.length > 0 || libraryPlaylistIds.length > 0 || savedTracks.length > 0) && <Button
                                    smaller
                                    className={cx('type-btn', isPlaylist && 'active')}
                                    onClick={() => {
                                        setIsPlaylist(!isPlaylist);
                                        setFilterType(!filterType);
                                    }}
                                >
                                    Playlists
                                </Button>}
                                {libraryArtistIds.length > 0 && <Button
                                    smaller
                                    className={cx('type-btn', isArtist && 'active')}
                                    onClick={() => {
                                        setIsArtist(!isArtist);
                                        setFilterType(!filterType);
                                    }}
                                >
                                    Artists
                                </Button>}
                                {libraryAlbumIds.length > 0 && <Button
                                    smaller
                                    className={cx('type-btn', isAlbum && 'active')}
                                    onClick={() => {
                                        setIsAlbum(!isAlbum);
                                        setFilterType(!filterType);
                                    }}
                                >
                                    Albums
                                </Button>}
                            </>}
                            {!playlistCreatorByYou && (
                                <>
                                    {isPlaylist && <>
                                        <Button
                                            smaller
                                            className={cx('type-btn', isPlaylist && 'active')}
                                            onClick={() => {
                                                setIsPlaylist(!isPlaylist);
                                                setFilterType(!filterType);
                                            }}
                                        >
                                            Playlists
                                        </Button>
                                        <Button smaller onClick={() => setPlaylistCreatorByYou(true)}>
                                            By you
                                        </Button>
                                    </>}
                                    {isArtist && <Button
                                        smaller
                                        className={cx('type-btn', isArtist && 'active')}
                                        onClick={() => {
                                            setIsArtist(!isArtist);
                                            setFilterType(!filterType);
                                        }}
                                    >
                                        Artists
                                    </Button>}
                                    {isAlbum && <Button
                                        smaller
                                        className={cx('type-btn', isAlbum && 'active')}
                                        onClick={() => {
                                            setIsAlbum(!isAlbum);
                                            setFilterType(!filterType);
                                        }}
                                    >
                                        Albums
                                    </Button>}
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
                        <div className={cx('playlist-interact')}>
                            <div className={cx('playlist-search')}>
                                <Button
                                    rounded
                                    dark
                                    icon
                                    className={cx('tooltip', 'playlist-search-btn', renderSearchBar ? 'hide' : null)}
                                    onClick={() => setRenderSearchBar(true)}
                                >
                                    <BiSearch />
                                    <span className={cx('tooltiptext')}>Search in Your Library</span>
                                </Button>
                                <SearchForm 
                                    placeholder="Search in Your Library"
                                    renderSearchBar={renderSearchBar}
                                    renderSearchBarFunc={setRenderSearchBar}
                                    setFunc={setSearchLibraryInputValue}
                                    inputValue={searchLibraryInputValue}
                                    sidebar
                                />
                            </div>
                            <div
                                className={cx('playlist-sort-dropdown')}
                                onClick={() => setIsComponentVisible(!isComponentVisible)}
                                ref={ref}
                            >
                                <button className={cx('dropbtn')}>
                                    {SORT_SUB_MENU.map((item) => {
                                        if (item.active) {
                                            return item.title;
                                        }
                                    })}
                                </button>
                                <span>{isComponentVisible ? <DropUpIcon /> : <DropDownIcon />}</span>
                                {isComponentVisible && <SubMenu className={cx('submenu')} menu={SORT_SUB_MENU} onClick={() => setIsComponentVisible(false)} posLeft />}
                            </div>
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
                />
            </div>

            <div className={cx('dragger', 'login')} onMouseDown={(e) => handleMousedown(e)} />
        </nav>
    ) : (
        <nav className={cx('navbar')} ref={sidebarPanel} style={{ width: `${SIDEBAR_WIDTH}px` }}>
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
            <Button outline lefticon={<LanguageIcon />} onClick={() => renderModal()}>
                English
            </Button>

            <div className={cx('dragger')} onMouseDown={(e) => handleMousedown(e)} />
        </nav>
    );
}

export default Sidebar;
