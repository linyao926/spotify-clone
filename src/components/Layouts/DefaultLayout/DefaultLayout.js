import { useContext, useEffect, useRef, useState } from 'react';
import { MusicPlayerContextProvider } from '~/context/MusicPlayerContext';
import { useWindowSize } from 'react-use';
import { AppContext } from '~/context/AppContext';
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
        addNewOnesOfAlbum,
        idToMyPlaylist,
        myPlaylistsData,
        handleSaveItemToList,
        myPlaylistCurrentId, 
        setMyPlaylistsData,
        tokenError, 
        playingPanelWidth,
        token,
    } = useContext(AppContext);

    const { pathname } = useLocation();
    const { width } = useWindowSize();

    const [hasData, setHasData] = useState(false);

    const contentRef = useRef(null);

    useEffect(() => {
        if (tokenError) {
            setHasData(false);
        } else {
            setHasData(true);
        }
    }, [tokenError, token])

    OverlayScrollbars.plugin(ClickScrollPlugin);
    useEffect(() => {
        if (contentRef.current) {
            OverlayScrollbars(
                {
                    target: contentRef.current,
                    elements: {
                        viewport: contentRef.current,
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
    }, [contentRef.current]);

    useEffect(() => {
       if (contentRef.current) {
            if (contentRef.current.children[1]) {
                contentRef.current.children[1].style.zIndex = '111';
            }
            
            if (contentRef.current.children[2]) {
                contentRef.current.children[2].style.zIndex = '111';
            }
       }
    }, [contentRef.current]);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTo({
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
        if (contentRef.current) {
            let contentWidth = contentRef.current.clientWidth;
            if ( showPlayingView ) {
                contentWidth -= playingPanelWidth;
            }
            setContainerWidth(contentWidth);
            setMainContainer({
                width: contentWidth,
                height: contentRef.current.clientHeight,
            });
        }
    }, [showPlayingView, widthNavbar, contentRef, width]);

    useEffect(() => {
        if (showRemind) {
            const timer = setTimeout(() => {
                setShowRemind(false);
                setRemindText('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showRemind]);

    const handleScroll = event => {
        setYPosScroll(event.currentTarget.scrollTop);
    };

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
            <div className={cx('container')}>
                <Sidebar />
                <div
                    className={cx('content', 'login')}
                    ref={contentRef}
                    onScroll={handleScroll}
                >
                    {isLogin && <Header headerWidth={containerWidth} />}
                    {hasData && <Outlet context={[]} />}
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
            <MusicPlayerContextProvider>
                <MusicPlayer />
            </MusicPlayerContextProvider>
        </div>
    );
}

export default DefaultLayout;
