import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { useWindowSize } from 'react-use';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '~/components/Containers/Header';
import Sidebar from '~/components/Containers/Sidebar';
import PlayingView from '~/components/Containers/PlayingView';
import MusicPlayer from '~/components/Containers/MusicPlayer';
import Languages from '~/components/Blocks/Languages';
import EditPlaylist from '~/components/Containers/EditPlaylist';
import Notification from '~/components/Blocks/Notification';
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars, ScrollbarsHidingPlugin, SizeObserverPlugin, ClickScrollPlugin } from 'overlayscrollbars';
import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);

function DefaultLayout() {
    const {
        widthNavbar,
        renderRequireLogin,
        showModal,
        showPlayingView,
        setIsHomePage,
        setMainContainer,
        setShowPlayingView,
        isLogin,
        showRemind,
        setShowRemind,
        myPlaylistId,
        containerWidth,
        setContainerWidth,
        remindText,
        setRemindText,
        yPosScroll, setYPosScroll,
    } = useContext(AppContext);
    const { width } = useWindowSize();
    const { pathname } = useLocation();

    const containerRef = useRef(null);

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
    }, [containerRef.current]);

    useEffect(() => {
       if (containerRef.current) {
            if (containerRef.current.children[2]) {
                containerRef.current.children[2].style.zIndex = '111';
            }
            
            if (containerRef.current.children[3]) {
                containerRef.current.children[3].style.zIndex = '111';
            }
       }
    }, [containerRef.current])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    }, [pathname]);

    useEffect(() => {
        if (pathname === '/') {
            setIsHomePage(true);
        } else {
            setIsHomePage(false);
        }
    }, [pathname]);

    useEffect(() => {
        const scrollbars = Array.from(document.getElementsByClassName('os-scrollbar-handle'));
        scrollbars.forEach((item) => {
            item.style.width = '12px';
            item.style.borderRadius = '0';
        });
    });

    useEffect(() => {
        if (showRemind) {
            const timer = setTimeout(() => {
                setShowRemind(false);
                setRemindText('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showRemind]);

    useEffect(() => {
        if (containerRef.current) {
            if (!showPlayingView) {
                setContainerWidth(width - widthNavbar - 24);
            } else {
                setContainerWidth(width - widthNavbar - 24 - 328);
            }
            containerRef.current.style.setProperty('--main-content-width', containerWidth);
        }
    }, [containerRef.current, showPlayingView, widthNavbar, width]);

    useEffect(() => {
        if (window.innerWidth - (widthNavbar + 320 + 8 * 24) < 372) {
            setShowPlayingView(false);
        }
    }, [widthNavbar]);

    useEffect(() => {
        if (containerRef.current) {
            setMainContainer({
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight,
            });
        }
    }, [containerWidth]);

    const handleScroll = event => {
        setYPosScroll(event.currentTarget.scrollTop);
    };

    const left = widthNavbar + 8;

    const handleClick = (e) => {
        renderRequireLogin(e);
    };

    return (
        <div className={cx('wrapper')} onClick={(e) => handleClick(e)}>
            <div className={cx('wrapper-container', showPlayingView && 'col-3')}>
                <Sidebar />
                <div
                    className={cx('container', 'login')}
                    style={{
                        left: `${left}px`,
                        right: showPlayingView ? '328px' : 0,
                        width: `${containerWidth}px`,
                    }}
                    ref={containerRef}
                    onScroll={handleScroll}
                >
                    {isLogin && <Header headerWidth={containerWidth} />}
                    <Outlet />
                    {showModal && (!isLogin ? <Languages /> : <EditPlaylist />)}
                </div>
                {showPlayingView && <PlayingView />}
                {showRemind && (
                    <Notification
                        text={remindText}
                        showIcon={false}
                        styles={{
                            position: 'fixed',
                            bottom: '90px',
                            left: '50%',
                            transform: 'translate(-50%, 0)',
                            zIndex: '999',
                            fontSize: '1.4rem',
                        }}
                    />
                )}
            </div>
            <MusicPlayer />
        </div>
    );
}

export default DefaultLayout;
