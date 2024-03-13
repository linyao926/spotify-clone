import { extractColors } from 'extract-colors';
import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { Link, useParams, NavLink } from 'react-router-dom';
import { HeartIcon, DotsIcon, FillHeartIcon, EditIcon, PauseIcon, PlayIcon } from '~/assets/icons';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import MainFooter from '~/components/Blocks/MainFooter';
import SubMenu from '~/components/Blocks/SubMenu';
import classNames from 'classnames/bind';
import styles from './PageContentLayout.module.scss';

const cx = classNames.bind(styles);

function PageContentLayout(props) {
    const {
        imgUrl,
        title,
        subTitle,
        fallbackIcon,
        type,
        follow,
        children,
        contextMenu,
        toId,
        renderPlay = false,
        rounded = false,
        displayOption = true,
        isPlaylist = false,
        isAlbum = false,
        isTrack = false,
        myPlaylist = false,
        isLikedTracks = false,
    } = props;

    const {
        bgHeaderColor,
        setBgHeaderColor,
        setShowModal,
        containerWidth,
        resizeText,
        posHeaderNextBtn,
        yPosScroll,
        setNowPlayingId,
        setNextQueueId,
        nextFromId,
        setNextFromId,
        setWaitingMusicList,
        setCurrentPlayingIndex,
        playing,
        setPlaying,
        handleRemoveData,
        setSavedTracks,
        libraryAlbumIds,
        libraryPlaylistIds,
        libraryArtistIds,
        savedTracks,
        myPlaylistsData,
        handleSaveItemToList,
        setLibraryPlaylistIds,
        setLibraryAlbumIds,
        setLibraryArtistIds,
        checkItemLiked,
        widthNavbar,
        pickTextColorBasedOnBgColorAdvanced,
    } = useContext(AppContext);

    const { ref, isComponentVisible, setIsComponentVisible, points, setPoints } = useContextMenu();

    const [colors, setColors] = useState(null);
    const [marginLeft, setMarginLeft] = useState(0);
    const [displayPlayBtnInTop, setDisplayPlayBtnInTop] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const textRef = useRef(null);
    const params = useParams();

    useEffect(() => {
        if (imgUrl) {
            if (myPlaylist) {
                extractColors(typeof imgUrl == 'string' ? imgUrl : URL.createObjectURL(imgUrl), { crossOrigin: 'Anonymous' })
                    .then(setColors)
                    .catch(console.error);
            } else {
                extractColors(imgUrl, { crossOrigin: 'Anonymous' }).then(setColors).catch(console.error);
            }
        } else {
            if (isLikedTracks) {
                setBgHeaderColor('rgb(80, 56, 160');
            } else {
                setBgHeaderColor('rgb(83, 83, 83)');
            }
        }
    }, [imgUrl, params]);

    useEffect(() => {
        const filterColor = (arr) => {
            let temp = arr[0].intensity;
            let bgColor = arr[0].hex;
            for (let i = 1; i < arr.length; i++) {
                if (arr[i].intensity > temp) {
                    temp = arr[i].intensity;
                    bgColor = arr[i].hex;
                }
            }
            return bgColor;
        };
        if (colors) {
            const color = filterColor(colors);
            setBgHeaderColor(color);
        }
    }, [colors]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.style.setProperty('--background-noise', bgHeaderColor);
        }
    }, [containerRef.current, bgHeaderColor]);

    useEffect(() => {
        if (textRef.current) {
            resizeText({
                element: textRef.current,
                minSize: 3.2,
                maxSize: 9.3,
                step: 1,
                unit: 'rem',
            });
        }
    }, [textRef.current, containerWidth]);

    useEffect(() => {
        if (textRef.current) {
            const fontSize = parseFloat(textRef.current.style.fontSize);
            if (fontSize < 4.2) {
                setMarginLeft(0);
            } else if (fontSize < 6.2) {
                setMarginLeft('-1px');
            } else if (fontSize >= 6.2) {
                setMarginLeft('-2px');
            }
        }
    }, [textRef.current, containerWidth, marginLeft]);

    useEffect(() => {
        if (renderPlay) {
            if (yPosScroll > 400) {
                setDisplayPlayBtnInTop(true);
            } else {
                setDisplayPlayBtnInTop(false);
            }
        }
    }, [renderPlay, yPosScroll, containerWidth]);

    useEffect(() => {
        const result = condition();

        checkItemLiked(result.list, toId, setIsLiked);
    }, [libraryAlbumIds, libraryPlaylistIds, savedTracks]);

    let rect;

    if (ref.current) {
        rect = ref.current.getBoundingClientRect();
    }

    const handleCloseSubMenu = () => {
        setIsComponentVisible(false);
    };

    const handlePlayClick = () => {
        setNextQueueId(null);
        setNowPlayingId(null);
        setWaitingMusicList(null);
        setCurrentPlayingIndex(0);

        if (isTrack) {
            setNextFromId({
                id: toId,
                type: 'track',
                title: title,
            });
        } else if (isAlbum) {
            setNextFromId({
                id: toId,
                type: 'album',
                title: title,
            });
        } else if (rounded) {
            setNextFromId({
                id: toId,
                type: 'artist',
                title: title,
            });
        } else if (isLikedTracks) {
            setNextFromId({
                id: toId,
                type: 'likedTracks',
                title: title,
            });
        } else if (myPlaylist) {
            setNextFromId({
                id: toId,
                type: 'myPlaylist',
                title: title,
            });
        } else if (isPlaylist) {
            setNextFromId({
                id: toId,
                type: 'playlist',
                title: title,
            });
        } 

        if (nextFromId?.id === toId) {
            setPlaying(!playing);
        } else {
            setPlaying(true);
        }

        // if (nowPlayingPanel && isTrack) {
        //     if (window.innerWidth - (widthNavbar + 320 + 8 * 24) < 372) {
        //         setShowPlayingView(false);
        //     } else {
        //         setShowPlayingView(true);
        //     }
        // }
    };

    const condition = () => {
        if (isTrack || isLikedTracks) {
            return {
                list: savedTracks,
                setFunc: setSavedTracks,
            };
        } else if (isAlbum) {
            return {
                list: libraryAlbumIds,
                setFunc: setLibraryAlbumIds,
            };
        } else if (rounded) {
            return {
                list: libraryArtistIds,
                setFunc: setLibraryArtistIds,
            };
        } else if (isPlaylist && !myPlaylist) {
            return {
                list: libraryPlaylistIds,
                setFunc: setLibraryPlaylistIds,
            };
        } else if (myPlaylist) {
            return {
                list: myPlaylistsData,
            }
        }
    };

    const handleSavedClick = () => {
        const result = condition();

        if (isLiked) {
            handleRemoveData(result.list, null, result.setFunc, toId);
            setIsLiked(false);
        } else {
            const date = new Date();
            handleSaveItemToList(result.list, toId, date, result.setFunc);
            setIsLiked(true);
        }
    };

    const imgLengthStyle = {
        height: `clamp(128px, 128px + (${containerWidth} - 600) / 424 * 104px, 232px)`,
        width: `clamp(128px, 128px + (${containerWidth} - 600) / 424 * 104px, 232px)`,
    }

    const displayImg = () => {
        if (imgUrl) {
            return (
                <img
                    src={myPlaylist 
                        ? (typeof imgUrl == 'string' ? imgUrl : URL.createObjectURL(imgUrl))
                        : imgUrl}
                    alt={`Image of ${title} ${type}`}
                    className={cx('header-img', rounded && 'rounded')}
                    style={imgLengthStyle}
                />
            );
        } else {
            if (isLikedTracks) {
                return (
                    <div className={cx('icon-box')}
                        style={imgLengthStyle}
                    >
                        <FillHeartIcon />
                    </div>
                );
            } else {
                return <div className={cx('header-img', rounded && 'rounded')}
                    style={imgLengthStyle}
                >
                    {fallbackIcon}
                </div>;
            }
        }
    };

    // console.log(rect)

    return (
        <div className={cx('wrapper')} ref={containerRef}>
            <header
                className={cx('header')}
                ref={headerRef}
                style={{ padding: `60px clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px) 24px` }}
            >
                {myPlaylist ? (
                    <div
                        className={cx('my-playlist-img')}
                        onClick={() => {
                            setShowModal(true);
                        }}
                        style={imgLengthStyle}
                    >
                        {displayImg()}
                        <div className={cx('edit-wrapper')}>
                            <EditIcon />
                            <span style={{ color: 'white' }}>Choose photo</span>
                        </div>
                    </div>
                ) : (
                    displayImg()
                )}

                <div
                    className={cx('header-title')}
                    style={{
                        cursor: 'default',
                    }}
                >
                    <h5
                        style={{
                            marginBottom: '8px',
                        }}
                    >
                        {type}
                    </h5>
                    <div className={cx('header-text')}>
                        <h1
                            ref={textRef}
                            onClick={() => {
                                if (myPlaylist) {
                                    setShowModal(true);
                                }
                            }}
                            style={{
                                cursor: myPlaylist ? 'pointer' : 'default',
                                marginLeft: marginLeft,
                            }}
                        >
                            {title}
                        </h1>
                    </div>
                    <div
                        style={{
                            marginTop: '8px',
                        }}
                    >
                        {subTitle}
                    </div>
                </div>
            </header>
            <main>
                <div className={cx('sub-bg')} />
                <section
                    className={cx('interact')}
                    style={{ padding: `0 clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px)` }}
                >
                    {renderPlay && (
                        <ButtonPrimary primary rounded large className={cx('play-btn')} onClick={() => handlePlayClick()}>
                            {nextFromId?.id === toId && playing ? <PauseIcon /> : <PlayIcon />}
                        </ButtonPrimary>
                    )}

                    {renderPlay && displayPlayBtnInTop && (
                        <div
                            className={cx('wrapper-play-btn')}
                            style={{
                                left: `${posHeaderNextBtn.right + 8}px`,
                            }}
                        >
                            <ButtonPrimary
                                primary
                                rounded
                                large
                                className={cx('play-btn-on-top')}
                                onClick={() => handlePlayClick()}
                            >
                                {nextFromId?.id === toId && playing ? <PauseIcon /> : <PlayIcon />}
                            </ButtonPrimary>
                            <h2 style={{color: pickTextColorBasedOnBgColorAdvanced(bgHeaderColor, '#FFFFFF', '#000000')}}>
                                {title}
                            </h2>
                        </div>
                    )}

                    {!myPlaylist && !rounded && !isLikedTracks && (
                        <span className={cx('save-icon', 'tooltip', isLiked && 'active')} onClick={handleSavedClick}>
                            {!isLiked ? <HeartIcon /> : <FillHeartIcon />}
                            {!isLiked ? (
                                <span className={cx('tooltiptext')}>Save to Your Library</span>
                            ) : (
                                <span className={cx('tooltiptext')}>Remove from Your Library</span>
                            )}
                        </span>
                    )}

                    {rounded && <div onClick={handleSavedClick}>
                        {!follow ? (
                            <ButtonPrimary dark outline className={cx('follow-btn')}>
                                follow
                            </ButtonPrimary>
                        ) : (
                            <ButtonPrimary dark outline className={cx('follow-btn', 'following')}>
                                following
                            </ButtonPrimary>
                        )}
                    </div>}

                    {displayOption && (<>
                            <span
                                className={cx('option-icon', 'tooltip')}
                                ref={ref}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsComponentVisible(!isComponentVisible);
                                    setPoints({
                                        x: e.pageX,
                                        y: e.pageY,
                                    });
                                }}
                            >
                                <DotsIcon />
                                {!isComponentVisible && <span className={cx('tooltiptext')}>More option for {title}</span>}
                                
                            </span>
                            {isComponentVisible && (
                                <SubMenu
                                    menu={contextMenu}
                                    right={rect.x}
                                    bottom={window.innerHeight - rect.y}
                                    pointY={rect.y + rect.height}
                                    pointX={rect.x}
                                    onClick={handleCloseSubMenu}
                                    isTrack={isTrack}
                                    isAlbum={isAlbum}
                                    isPlaylist={isPlaylist}
                                    queueId={toId}
                                    toId={toId}
                                />
                            )}
                        </>
                    )}
                </section>
                {children}
            </main>
            <MainFooter />
        </div>
    );
}

export default PageContentLayout;
