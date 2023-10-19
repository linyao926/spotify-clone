import { useRef, useState, useEffect, useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { Link } from 'react-router-dom';
import SubMenu from '~/components/Layouts/SubMenu';
import { PlayIcon, HeartIcon, FillHeartIcon, DotsIcon, PauseIcon } from '~/assets/icons';
import classNames from 'classnames/bind';
import styles from './TrackItem.module.scss';

const cx = classNames.bind(styles);

function TrackItem(props) {
    const {
        col5 = false,
        col4 = false,
        col3 = false,
        col2 = false,
        isLikedSongs = false,
        inSearchAll = false,
        isMyPlaylist = false,
        artistData,
        toTrackId,
        toAlbumId,
        isAlbum,
        isArtist,
        toArtistId,
        albumIdToList,
        toPlaylistId,
        titleForNextFrom,
        index,
        title,
        img,
        artists,
        album,
        durationMs,
        dateRelease,
        nextTrackPlayingView = false,
        inQueue = false,
        inWaitList = false,
        colHeaderIndex = false,
        colHeaderTitle = false,
        colHeaderAlbum = false,
        colHeaderDate = false,
        colHeaderDuration = false,
        children,
        className,
        onClick
    } = props;
    const [isSavedTrack, setIsSavedTrack] = useState(false);
    const [isNowPlay, setIsNowPlay] = useState(false);

    const {
        msToMinAndSeconds,
        contextMenu,
        nowPlayingId,
        playing,
        setPlaying,
        setNowPlayingId,
        nextQueueId,
        setNextQueueId,
        nextFromId,
        setNextFromId,
        showPlayingView,
        setShowPlayingView,
        nowPlayingPanel,
        widthNavbar,
        checkItemLiked,
        savedTracks,
        setWaitingMusicList,
        waitingMusicList,
        currentPlayingIndex,
        setCurrentPlayingIndex,
        setMusicList,
        handleRemoveData,
        setSavedTracks,
        handleSaveItemToList,
        containerWidth,
    } = useContext(AppContext);
    const { ref, isComponentVisible, setIsComponentVisible, points, setPoints } = useContextMenu();
    const date = new Date(dateRelease);
    const year = date.getFullYear();
    const month = date.toLocaleDateString('en-GB', { month: 'short' });
    const day = date.getDate();

    let rect;

    if (ref.current) {
        rect = ref.current.getBoundingClientRect();
    }

    const handleCloseSubMenu = () => {
        setIsComponentVisible(false);
    };

    const artistNamesMenu = (artists) =>
        artists.map((artist) => ({
            title: artist.name,
            to: `/artist/${artist.id}`,
        }));

    useEffect(() => {
        if (col2) {
            ref.current.style.gridTemplateColumns = '[first] 4fr [last] minmax(120px,1fr)';
        } 
        
        if (col5) {
            if (containerWidth > 766) {
                ref.current.style.gridTemplateColumns = '[index] 16px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(120px,1fr)';
            } else if (containerWidth > 535) {
                ref.current.style.gridTemplateColumns = '[index] 16px [first] 4fr [var1] 2fr [last] minmax(120px,1fr)';
            } else {
                ref.current.style.gridTemplateColumns = '[index] 16px [first] 4fr [last] minmax(120px,1fr)';
            }
        }
        
        if (col4) {
            if (containerWidth > 535) {
                ref.current.style.gridTemplateColumns = '[index] 16px [first] 4fr [var1] 2fr [last] minmax(120px,1fr)';
            } else {
                ref.current.style.gridTemplateColumns = '[index] 16px [first] 4fr [last] minmax(120px,1fr)';
            }
        }
        
        if (!colHeaderAlbum && !col2) {
            console.log(1)
            ref.current.style.gridTemplateColumns = '[index] 16px [first] 4fr [last] minmax(120px,1fr)';
        }
    }, [ref.current, containerWidth]);

    useEffect(() => {
        checkItemLiked(savedTracks, toTrackId, setIsSavedTrack);
    }, [savedTracks]);

    const handleClickPlayTrack = (e) => {
        e.preventDefault();

        if (toTrackId && inSearchAll) {
            setNextFromId({
                id: toTrackId,
                type: 'track',
                title: title,
            });
        }

        if (inWaitList) {
            const index = waitingMusicList.indexOf(toTrackId);

            if (index > -1) {
                setNowPlayingId(toTrackId);
                setCurrentPlayingIndex(currentPlayingIndex + index + 1);
            }
        } else if (isAlbum) {
            setNextQueueId(null);
            setNowPlayingId(null);
            setMusicList(null);
            setWaitingMusicList(null);
            setCurrentPlayingIndex(0);
            setNextFromId({
                trackId: toTrackId,
                id: albumIdToList,
                type: 'album',
                title: titleForNextFrom,
            });
        } else if (!isMyPlaylist && toPlaylistId) {
            setNextQueueId(null);
            setNowPlayingId(null);
            setMusicList(null);
            setWaitingMusicList(null);
            setCurrentPlayingIndex(0);
            setNextFromId({
                trackId: toTrackId,
                id: toPlaylistId,
                type: 'playlist',
                title: titleForNextFrom,
            });
        } else if (toArtistId) {
            setNextQueueId(null);
            setNowPlayingId(null);
            setMusicList(null);
            setWaitingMusicList(null);
            setCurrentPlayingIndex(0);
            setNextFromId({
                trackId: toTrackId,
                id: toArtistId,
                type: 'artist',
                title: titleForNextFrom,
            });
        } else if (inQueue) {
            setNowPlayingId(toTrackId);
            const arr = [...nextQueueId];
            arr.splice(0, 1);
            if (arr.length > 0) {
                setNextQueueId(arr);
            } else {
                setNextQueueId([]);
            }
        }

        if (nowPlayingPanel) {
            if (window.innerWidth - (widthNavbar + 320 + 8 * 24) < 372) {
                setShowPlayingView(false);
            } else {
                setShowPlayingView(true);
            }
        }

        if (nextFromId?.id === toTrackId) {
            setPlaying(!playing);
        } else if (nextFromId?.trackId === toTrackId) {
            setPlaying(!playing);
        } else {
            setPlaying(true);
        }
    };

    useEffect(() => {
        if (nowPlayingId) {
            if (nowPlayingId === toTrackId && !inWaitList && !inQueue) {
                setIsNowPlay(true);
            } else {
                setIsNowPlay(false);
            }
        }
    }, [nowPlayingId, toTrackId, inQueue, inWaitList]);

    const submenu = () => {
        if (isMyPlaylist) {
            return contextMenu['my-playlist-track'];
        }
        if (isLikedSongs) {
            return contextMenu['liked-songs'];
        }
        if (inQueue) {
            return contextMenu['queue-track'];
        }
        return contextMenu.track;
    };

    return (
        <div
            className={cx('wrapper', isComponentVisible && 'active', nextTrackPlayingView && 'next-queue')}
            ref={ref}
            onClick={() => {
                if (isComponentVisible) {
                    setIsComponentVisible(false);
                }
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                setIsComponentVisible(!isComponentVisible);
                setPoints({
                    x: e.pageX,
                    y: e.pageY,
                });
            }}
        >
            {colHeaderIndex && (
                <div className={cx('wrapper-index')} onClick={(e) => handleClickPlayTrack(e)}>
                    <span className={cx('index', isNowPlay && 'playing')}>
                        {isNowPlay && playing ? (
                            <img
                                width="14"
                                height="14"
                                alt=""
                                src="https://open.spotifycdn.com/cdn/images/equaliser-green.f8937a92.svg"
                            />
                        ) : (
                            index
                        )}
                    </span>
                    <span className={cx('play-icon', 'tooltip')}>
                        {isNowPlay && playing ? <PauseIcon /> : <PlayIcon />}
                        <span className={cx('tooltiptext')}>{isNowPlay && playing ? 'Pause' : `Play ${title}`}</span>
                    </span>
                </div>
            )}
            <div className={cx('intro', 'first')}>
                {!isAlbum && (
                    <div className={cx('wrapper-img', !colHeaderIndex && 'opacity-img')} onClick={(e) => handleClickPlayTrack(e)}>
                        <img src={img} alt={title} className={cx('img')} />
                        {!colHeaderIndex && (
                            <span className={cx('play-icon', 'tooltip')}>
                                {isNowPlay && playing ? <PauseIcon /> : <PlayIcon />}
                                <span className={cx('tooltiptext')}>
                                    {isNowPlay && playing ? 'Pause' : `Play ${title}`}
                                </span>
                            </span>
                        )}
                    </div>
                )}
                <div className={cx('title')}>
                    <Link
                        className={cx('song-name', isNowPlay && 'playing')}
                        onClick={(e) => {
                            isNowPlay && e.preventDefault();
                        }}
                        to={`/track/${toTrackId}`}
                    >
                        {title}
                    </Link>
                    {!isArtist ? <div className={cx('song-artists')}>{artists}</div> : null}
                </div>
            </div>
            {(colHeaderAlbum && containerWidth > 535) && (
                <Link className={cx('album-title', 'var1')} to={`/album/${toAlbumId}`}>
                    {album}
                </Link>
            )}
            {(colHeaderDate && containerWidth > 766) && (
                <span className={cx('date', 'var2')}>{`${month} ${day}, ${year}`}</span>
            )}
            {colHeaderDuration && (
                <div className={cx('duration', 'last')}>
                    {/* <HeartIcon /> */}
                    <span
                        className={cx('interact-icon', 'tooltip')}
                        onClick={() => {
                            if (isSavedTrack) {
                                handleRemoveData(savedTracks, null, setSavedTracks, toTrackId);
                                setIsSavedTrack(false);
                            } else {
                                const date = new Date();
                                handleSaveItemToList(savedTracks, toTrackId, date, setSavedTracks);
                                setIsSavedTrack(true);
                            }
                        }}
                    >
                        {isSavedTrack ? <FillHeartIcon /> : <HeartIcon />}
                        {!isSavedTrack ? (
                            <span className={cx('tooltiptext')}>Save to Your Library</span>
                        ) : (
                            <span className={cx('tooltiptext')}>Remove from Your Library</span>
                        )}
                    </span>
                    <span className={cx('duration-text')}>{msToMinAndSeconds(durationMs, true)}</span>
                    <span
                        className={cx('interact-icon', 'option-icon', 'tooltip')}
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
                        <span className={cx('tooltiptext')}>
                            More option for {title} by {artists}
                        </span>
                    </span>
                </div>
            )}

            {isComponentVisible && (
                <SubMenu
                    menu={submenu()}
                    left={points.x - rect.left}
                    right={ref.current.clientWidth - points.x + rect.left}
                    top={points.y - rect.top}
                    bottom={ref.current.clientHeight - points.y + rect.top}
                    pointY={points.y}
                    pointX={points.x}
                    isTrack
                    toId={toTrackId}
                    onClick={() => setIsComponentVisible(false)}
                    artistSubmenu={artistData && artistData.length > 1 && artistNamesMenu(artistData)}
                />
            )}
        </div>
    );
}

export default TrackItem;
