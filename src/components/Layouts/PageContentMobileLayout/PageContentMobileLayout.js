import { extractColors } from 'extract-colors';
import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { useParams } from 'react-router-dom';
import { HeartIcon, DotsIcon, FillHeartIcon, EditIcon, PauseIcon, PlayIcon } from '~/assets/icons';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import MobileContext from '~/components/Blocks/MobileContext';
import MainFooter from '~/components/Blocks/MainFooter';
import classNames from 'classnames/bind';
import styles from './PageContentMobileLayout.module.scss';

const cx = classNames.bind(styles);

export default function PageContentMobileLayout(props) {
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
        toAlbumId,
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
        tokenError,
        token,
        bgHeaderColor,
        setBgHeaderColor,
        setShowModal,
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
        libraryItemPlayedList,
        setLibraryItemPlayedList,
    } = useContext(AppContext);

    const { ref, isComponentVisible, setIsComponentVisible } = useContextMenu();

    const [colors, setColors] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [renderSubmenu, setRenderSubmenu] = useState(false);
    const [hasData, setHasData] = useState(false);

    const containerRef = useRef(null);
    const params = useParams();

    useEffect(() => {
        if (tokenError) {
            setHasData(false);
        } else {
            setHasData(true);
        }
    }, [tokenError, token]);

    useEffect(() => {
        if (imgUrl) {
            if (myPlaylist) {
                extractColors(typeof imgUrl == 'string' ? imgUrl : URL.createObjectURL(imgUrl), {
                    crossOrigin: 'Anonymous',
                })
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
        const result = condition();

        checkItemLiked(result.list, toId, setIsLiked);
    }, [libraryAlbumIds, libraryPlaylistIds, savedTracks]);

    const handleCloseSubMenu = () => {
        setIsComponentVisible(false);
    };

    const handlePlayClick = () => {
        if (nextFromId?.id === toId) {
            setPlaying(!playing);
        } else {
            setNextQueueId(null);
            setNowPlayingId(null);
            setWaitingMusicList(null);
            setCurrentPlayingIndex(0);

            let type;

            if (isTrack) {
                setNextFromId({
                    id: toId,
                    type: 'track',
                    title: title,
                });
                type = false;
            } else if (isAlbum) {
                setNextFromId({
                    id: toId,
                    type: 'album',
                    title: title,
                });
                type = 'album';
            } else if (rounded) {
                setNextFromId({
                    id: toId,
                    type: 'artist',
                    title: title,
                });
                type = 'artist';
            } else if (isLikedTracks) {
                setNextFromId({
                    id: toId,
                    type: 'likedTracks',
                    title: title,
                });
                type = 'likedTracks';
            } else if (myPlaylist) {
                setNextFromId({
                    id: toId,
                    type: 'myPlaylist',
                    title: title,
                });
                type = 'myPlaylist';
            } else if (isPlaylist) {
                setNextFromId({
                    id: toId,
                    type: 'playlist',
                    title: title,
                });
                type = 'playlist';
            }

            if (type) {
                const date = new Date();
                let temp = { ...libraryItemPlayedList };
                if (type !== 'likedTracks') {
                    temp[type].filter((item, index) => {
                        if (item.id === toId) {
                            temp[type][index].played = date;
                        } else return;
                    });
                } else {
                    temp[type][0].played = date;
                }
                setLibraryItemPlayedList(temp);
            }

            setPlaying(true);
        }
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
            };
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

    const checkInLibrary = (id, type) => {
        let result = false;
        if (type === 'album' || type === 'playlist') {
            libraryItemPlayedList[type].filter((item) => {
                if (item.id === id) {
                    result = true;
                }
                return;
            });
        } else if (type === 'track') {
            savedTracks.filter((item) => {
                if (item.id === id) {
                    result = true;
                }
                return;
            });
        }
        return result;
    };

    let typeItem;
    if (isAlbum) {
        typeItem = 'album';
    } else if (isPlaylist && !myPlaylist) {
        typeItem = 'playlist';
    } else if (isTrack) {
        typeItem = 'track';
    } else {
        typeItem = false;
    }

    const imgLengthStyle = {
        height: `clamp(144px, 40vw, 288px)`,
        width: `clamp(144px, 40vw, 288px)`,
    };

    const displayImg = () => {
        if (imgUrl) {
            return (
                <img
                    loading="lazy"
                    src={myPlaylist ? (typeof imgUrl == 'string' ? imgUrl : URL.createObjectURL(imgUrl)) : imgUrl}
                    alt={`Image of ${title} ${type}`}
                    className={cx('header-img', rounded && 'rounded')}
                    style={imgLengthStyle}
                />
            );
        } else {
            return (
                <div className={cx('header-img', rounded && 'rounded')} style={imgLengthStyle}>
                    {fallbackIcon}
                </div>
            );
        }
    };

    return (
        hasData && (
            <div className={cx('wrapper')} ref={containerRef}>
                <header
                    className={cx('header')}
                    style={{
                        background: isLikedTracks
                            ? 'linear-gradient(rgb(80, 56, 160) 0%, transparent 100%)'
                            : 'linear-gradient(var(--background-noise) 0,transparent 100%)',
                    }}
                >
                    {!isLikedTracks ? (
                        myPlaylist ? (
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
                        )
                    ) : null}

                    <div
                        className={cx('header-title')}
                        style={{
                            cursor: 'default',
                        }}
                    >
                        <div className={cx('header-text')}>
                            <h1
                                onClick={() => {
                                    if (myPlaylist) {
                                        setShowModal(true);
                                    }
                                }}
                                style={{
                                    cursor: myPlaylist ? 'pointer' : 'default',
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
                    <section className={cx('interact')}>
                        <div style={{ display: 'flex' }}>
                            {!myPlaylist && !rounded && !isLikedTracks && (
                                <span
                                    className={cx('save-icon', 'tooltip', isLiked && 'active')}
                                    onClick={handleSavedClick}
                                >
                                    {!isLiked ? <HeartIcon /> : <FillHeartIcon />}
                                    {!isLiked ? (
                                        <span className={cx('tooltiptext')}>Save to Your Library</span>
                                    ) : (
                                        <span className={cx('tooltiptext')}>Remove from Your Library</span>
                                    )}
                                </span>
                            )}

                            {rounded && (
                                <div onClick={handleSavedClick}>
                                    {!follow ? (
                                        <ButtonPrimary dark outline className={cx('follow-btn')}>
                                            follow
                                        </ButtonPrimary>
                                    ) : (
                                        <ButtonPrimary dark outline className={cx('follow-btn', 'following')}>
                                            following
                                        </ButtonPrimary>
                                    )}
                                </div>
                            )}

                            {displayOption && (
                                <>
                                    <span
                                        className={cx('option-icon', 'tooltip')}
                                        ref={ref}
                                        onClick={() => setRenderSubmenu(true)}
                                    >
                                        <DotsIcon />
                                    </span>
                                    <MobileContext
                                        items={contextMenu}
                                        setRenderSubmenu={setRenderSubmenu}
                                        img={imgUrl ? imgUrl : null}
                                        fallbackIcon={fallbackIcon}
                                        myPlaylist={myPlaylist ? true : false}
                                        title={title}
                                        subTitle={type}
                                        toId={toId}
                                        isRemove={typeItem ? checkInLibrary(toId, typeItem) : false}
                                        toAlbumId={toAlbumId}
                                        expand={true}
                                        renderSubMenu={renderSubmenu}
                                    />
                                </>
                            )}
                        </div>

                        {renderPlay && (
                            <ButtonPrimary
                                primary
                                rounded
                                large
                                className={cx('play-btn')}
                                onClick={() => {
                                    if (nextFromId?.id === toId) {
                                        setPlaying(!playing);
                                    } else {
                                        handlePlayClick();
                                    }
                                }}
                            >
                                {nextFromId?.id === toId && playing ? <PauseIcon /> : <PlayIcon />}
                            </ButtonPrimary>
                        )}
                    </section>
                </header>
                <main>{children}</main>
                <MainFooter />
            </div>
        )
    );
}
