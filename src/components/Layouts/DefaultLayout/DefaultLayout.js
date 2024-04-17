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
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);

function DefaultLayout() {
    const {
        widthNavbar,
        renderRequireLogin,
        showModal,
        showPlayingView,
        setShowPlayingView,
        setIsHomePage,
        setMainContainer,
        isLogin,
        showRemind,
        setShowRemind,
        containerWidth,
        setContainerWidth,
        remindText,
        setRemindText,
        setYPosScroll,
        remindAddToMyPlaylist, 
        setRemindAddToMyPlaylist,
        albumIsAllAdded,
        token,
        addNewOnesOfAlbum,
        idToMyPlaylist,
        myPlaylistsData,
        handleSaveItemToList,
        myPlaylistCurrentId, 
        setMyPlaylistsData,
        playingPanelWidth, setPlayingPanelWidth,
    } = useContext(AppContext);
    const { width } = useWindowSize();
    const { pathname } = useLocation();

    const containerRef = useRef(null);

    let root = document.documentElement;
    let style = getComputedStyle(root);
    // console.log(token)

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
                if (width - widthNavbar - 24 >= 416) {
                    setContainerWidth(width - widthNavbar - 24);
                } 
            } else {
                if (width - widthNavbar - 24 - playingPanelWidth - 8 >= 416) {
                    setContainerWidth(width - widthNavbar - 24 - playingPanelWidth - 8);
                } 
            }
            containerRef.current.style.setProperty('--main-content-width', containerWidth);
        }
    }, [containerRef.current, showPlayingView, widthNavbar, width, playingPanelWidth]);

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

    const handleClickAddData = (id) => {
        const items = [...myPlaylistsData];
        let temp = items[myPlaylistCurrentId];
        const date = new Date();
        temp.tracks = handleSaveItemToList(temp.tracks, id, date);
        items[myPlaylistCurrentId] = temp;
        setMyPlaylistsData(items);
        setShowRemind(true);
        setRemindText(`Added to ${remindText}`);
    }

    return (
        <div className={cx('wrapper')} onClick={(e) => handleClick(e)}>
            <div className={cx('wrapper-container', showPlayingView && 'col-3')}>
                <Sidebar />
                <div
                    className={cx('container', 'login')}
                    style={{
                        left: `${left}px`,
                        width: `${containerWidth}px`,
                    }}
                    ref={containerRef}
                    onScroll={handleScroll}
                >
                    {isLogin && <Header headerWidth={containerWidth} />}
                    <Outlet context={[]} />
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
                {remindAddToMyPlaylist &&(
                    <div className={cx('wrapper-remind')}
                        onClick={() => {
                            setRemindAddToMyPlaylist(false);
                        }}
                    >
                        <div className={cx('remind')}>
                            <h5>{albumIsAllAdded ? 'Already added' : 'Some already added'}</h5>
                            <p>{albumIsAllAdded ? 'This' : 'Some of these'} is already in your '{remindText}' playlist.</p>
                            <div className={cx('wrapper-btn')}>
                                <ButtonPrimary dark className={cx('yes-btn')}    
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleClickAddData(idToMyPlaylist);
                                        setRemindAddToMyPlaylist(false);
                                    }}
                                >
                                    {albumIsAllAdded ? 'Add anyway' : 'Add all'}
                                </ButtonPrimary>
                                <ButtonPrimary
                                    primary
                                    className={cx('cancel-btn')}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (!albumIsAllAdded) {
                                            handleClickAddData(addNewOnesOfAlbum);
                                        }
                                        setRemindAddToMyPlaylist(false);
                                    }}
                                >
                                    {albumIsAllAdded ? `Don't add` : 'Add new ones'}
                                </ButtonPrimary>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <MusicPlayer />
        </div>
    );
}

export default DefaultLayout;
