import { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Outlet, useLocation } from 'react-router-dom';
import MusicPlayer from '~/components/Containers/MusicPlayer';
import HorizontalNavbar from '~/components/Containers/HorizontalNavbar';
import MobileProfileSubMenu from '~/components/Blocks/MobileProfileSubMenu';
import Languages from '~/components/Blocks/Languages';
import EditPlaylist from '~/components/Containers/EditPlaylist';
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import classNames from "classnames/bind";
import styles from "./MobileLayout.module.scss";

const cx = classNames.bind(styles);

function MobileLayout () {
    const {
        showModal,
        setIsHomePage,
        setSearchPage,
        isLogin,
        tokenError, 
        token,
    } = useContext(AppContext);
    
    const { pathname } = useLocation();

    const containerRef = useRef(null);

    const [visibleProfileMenu, setVisibleProfileMenu] = useState(false);
    const [visibleMusicPlayer, setVisibleMusicPlayer] = useState(false);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        if (tokenError) {
            setHasData(false);
        } else {
            setHasData(true);
        }
    }, [tokenError, token])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    }, [pathname, containerRef]);

    OverlayScrollbars.plugin(ClickScrollPlugin);
    useEffect(() => {
        if (containerRef.current) {
            OverlayScrollbars(
                {
                    target: containerRef.current,
                    elements: {
                        viewport: containerRef.current,
                    },
                },
                {
                    overflow: {
                        x: 'hidden',
                    },
                    scrollbars: {
                        theme: 'os-theme-light',
                        autoHide: 'move',
                        clickScroll: true,
                        autoHideSuspend: true,
                    },
                },
            );
        }
    }, []);

    
    useEffect(() => {
        if (containerRef.current) {
            if (containerRef.current.children[1]) {
                containerRef.current.children[1].style.zIndex = '1000';
            }
       }
    }, [pathname]);

    useEffect(() => {
        if (pathname === '/') {
            setIsHomePage(true);
            setSearchPage(false);
        } else {
            setIsHomePage(false);
            if (pathname.includes('search')) {
                setSearchPage(true);
            } else {
                setSearchPage(false);
            }
        }
    }, [pathname, setIsHomePage, setSearchPage]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('main-content')}
                ref={containerRef}
                style={{
                    height: visibleMusicPlayer 
                        ? 'calc(100vh - var(--height-side-bar) - var(--height-music-player))' 
                        : 'calc(100vh - var(--height-side-bar))',
                }}
            >
                {hasData && <Outlet context={[setVisibleProfileMenu]} />}
                {(showModal && !visibleProfileMenu) && (!isLogin ? <Languages /> : <EditPlaylist />)}
            </div>
            <div className={cx('fixed-position')}>
                <MusicPlayer 
                    setVisibleMusicPlayer={setVisibleMusicPlayer}
                />
                <HorizontalNavbar />
            </div>
            <MobileProfileSubMenu
                visible={visibleProfileMenu}
                setVisible={setVisibleProfileMenu}
            />
        </div>
    );
}

export default MobileLayout;