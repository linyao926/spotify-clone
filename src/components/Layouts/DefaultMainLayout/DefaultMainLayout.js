import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { useWindowSize } from 'react-use';
import Sidebar from '../Sidebar';
import HeaderHomePage from '../HeaderHomePage';
import PlayingView from '../PlayingView';
import ControlBar from '../ControlBar';
import Languages from '~/components/Languages';
import EditPlaylist from '~/pages/MyPlaylist/EditPlaylist';
import Notification from '~/components/Notification';
import classNames from 'classnames/bind';
import styles from './DefaultMainLayout.module.scss';
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars, ScrollbarsHidingPlugin, SizeObserverPlugin, ClickScrollPlugin } from 'overlayscrollbars';
import { Outlet, useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function DefaultMainLayout() {
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

            containerRef.current.children[2].style.zIndex = '101';
            if (containerRef.current.children[3]) {
                containerRef.current.children[3].style.zIndex = '101';
            }
        }
    }, [containerRef.current]);

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
                >
                    {isLogin && <HeaderHomePage headerWidth={containerWidth} />}
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
            <ControlBar />
        </div>
    );
}

export default DefaultMainLayout;
