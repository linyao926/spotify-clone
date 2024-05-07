import { useState, useEffect, useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { Link, useParams } from 'react-router-dom';
import { 
    PlayIcon, 
    HeartIcon, 
    FillHeartIcon, 
    DotsIcon, 
    PauseIcon, 
    MusicalNoteIcon, 
    AddIcon, 
    TickIcon, 
    AlbumFallbackIcon 
} from '~/assets/icons';
import SubMenu from '../SubMenu';
import MobileContext from '../MobileContext';
import classNames from 'classnames/bind';
import styles from './TrackItem.module.scss';

const cx = classNames.bind(styles);

function TrackItem(props) {
    const {
        col5 = false,
        col4 = false,
        col2 = false,
        isLikedSongs = false,
        inSearchAll = false,
        isMyPlaylist = false,
        isAlbum = false,
        isArtist = false,
        artistData,
        toTrackId,
        toAlbumId,
        toArtistId,
        toPlaylistId,
        albumIdToList,
        titleForNextFrom,
        index,
        title,
        img,
        artists,
        album,
        durationMs,
        dateRelease,
        indexOfItem,
        nextTrackPlayingView = false,
        inQueue = false,
        inWaitList = false,
        colHeaderIndex = false,
        colHeaderAlbum = false,
        colHeaderDate = false,
        colHeaderDuration = false,
    } = props;

    const {
        spotifyApi, 
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
        setShowPlayingView,
        nowPlayingPanel,
        currentPlayingIndex,
        playingPanelWidth,
        widthNavbar,
        checkItemLiked,
        savedTracks,
        setWaitingMusicList,
        waitingMusicList,
        setCurrentPlayingIndex,
        handleRemoveData,
        setSavedTracks,
        handleSaveItemToList,
        containerWidth,
        smallerWidth,
        playlist,
        myPlaylistsData,
        setTokenError,
        libraryItemPlayedList,
        setLibraryItemPlayedList,
        collapse, setCollapse,
    } = useContext(AppContext);

    const [getAlbumId, setGetAlbumId] = useState(null);
    const [isSavedTrack, setIsSavedTrack] = useState(false);
    const [isNowPlay, setIsNowPlay] = useState(false);
    const [renderSubmenu, setRenderSubmenu] = useState(false);

    const { ref, isComponentVisible, setIsComponentVisible, points, setPoints } = useContextMenu();

    const params = useParams();
    
    const date = new Date(dateRelease);
    const year = date.getFullYear();
    const month = date.toLocaleDateString('en-GB', { month: 'short' });
    const day = date.getDate();

    // console.log(params)

    let rect;

    if (ref.current) {
        rect = ref.current.getBoundingClientRect();
    }

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
            ref.current.style.gridTemplateColumns = '[index] 16px [first] 4fr [last] minmax(120px,1fr)';
        }
    }, [ref.current, containerWidth]);

    useEffect(() => {
        checkItemLiked(savedTracks, toTrackId, setIsSavedTrack);
    }, [savedTracks]);

    useEffect(() => {
        let isMounted = true;

        if (toTrackId) {
            async function loadData () {
                const albumId =  await spotifyApi.getTrack(toTrackId)
                    .then((data) => data.album.id)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });

                if (isMounted) {
                    setGetAlbumId(albumId);
                    setTokenError(false);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [toTrackId]);

    const handleClickPlayTrack = (e) => {
        e.preventDefault();
        let type;
        let toId;

        if (inSearchAll) {
            setNextQueueId(null);
            setNowPlayingId(null);
            setWaitingMusicList(null);
            setCurrentPlayingIndex(0);
            setPlaying(false);

            setNextFromId({
                id: toTrackId,
                type: 'track',
                title: title,
            });
            type = false;
        } else if (inWaitList) {
            const index = waitingMusicList.indexOf(toTrackId);

            if (index > -1) {
                const i = playlist.indexOf(toTrackId);
                setNowPlayingId(toTrackId);
                setCurrentPlayingIndex(i);
            }
            type = false;
        } else if (inQueue) {
            setNowPlayingId(toTrackId);

            const arr = [...nextQueueId];
            arr.splice(0, 1);
            if (arr.length > 0) {
                setNextQueueId(arr);
            } else {
                setNextQueueId([]);
            }
            type = false;
        } else {
            setNextQueueId(null);
            setNowPlayingId(null);
            setWaitingMusicList(null);
            setCurrentPlayingIndex(indexOfItem);
            setPlaying(false);

            if (isAlbum) {
                setNextFromId({
                    trackId: toTrackId,
                    id: albumIdToList,
                    type: 'album',
                    title: titleForNextFrom,
                });
                type = 'album';
                toId = albumIdToList;
            } else if (isMyPlaylist) {
                setNextFromId({
                    id: myPlaylistsData[toPlaylistId].tracks,
                    type: 'myPlaylist',
                    title: title,
                });
                type = 'myPlaylist';
                toId = toPlaylistId + 1;
            } else if (toPlaylistId) {
                let page = 1;
                let limit = 30;
                if (params['*'].includes('page')) {
                    page = Number(params['*'].match(/\d+/)[0]);
                }
                const i = indexOfItem + limit * (page - 1);
                console.log(i)
                setNextFromId({
                    trackId: toTrackId,
                    id: toPlaylistId,
                    type: 'playlist',
                    title: titleForNextFrom,
                    index: i,
                });
                type = 'playlist';
                toId = toPlaylistId;
            } else if (toArtistId) {
                setNextFromId({
                    trackId: toTrackId,
                    id: toArtistId,
                    type: 'artist',
                    title: titleForNextFrom,
                });
                type = 'artist';
                toId = toArtistId;
            } else if (isLikedSongs) {
                setNextFromId({
                    id: '/collection/tracks',
                    type: 'likedTracks',
                    title: title,
                });
                type = 'likedTracks';
            } 

            if (nowPlayingPanel) {
                if (collapse) {
                    if (window.innerWidth - (widthNavbar + 280 + 8 * 4) >= 416) {
                        setShowPlayingView(true);
                    }
                } else {
                    if (window.innerWidth - (72 + 280 + 8 * 4) >= 416) {
                        setShowPlayingView(true);
                        setCollapse(true);
                    }
                }
            }
        }

        if (type) {
            const date = new Date();
            let temp = {...libraryItemPlayedList};
            if (type !== 'likedTracks') {
                temp[type].filter((item, index) => {
                    console.log(toId)
                    if (item.id === toId) {
                        temp[type][index].played = date;
                    } else return;
                })
            } else {
                temp[type][0].played = date;
            }
            setLibraryItemPlayedList(temp);
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
        if (nowPlayingId?.id) {
            if (nowPlayingId.id === toTrackId) {
                setIsNowPlay(true);
            } else {
                setIsNowPlay(false);
            }
        } else {
            if (nowPlayingId === toTrackId) {
                setIsNowPlay(true);
            } else {
                setIsNowPlay(false);
            }
        }
    }, [nowPlayingId, toTrackId, inQueue, inWaitList]);

    const submenu = () => {
        if (smallerWidth) {
            return [
                {
                    title: isSavedTrack ? 'Remove from your Liked Songs' : 'Save to Your Liked Songs',
                    'handle-remove-in-liked': isSavedTrack,
                    'handle-save': !isSavedTrack,
                    lefticon: isSavedTrack ? <TickIcon /> : <AddIcon />,
                    active: isSavedTrack,
                }, 
                {
                    lefticon: <MusicalNoteIcon />,
                    title: 'Go to track',
                    to: `/track/${toTrackId}`,
                },
                {
                    title: 'Go to album',
                    to: `/album/${getAlbumId}`,
                    lefticon: <AlbumFallbackIcon />,
                }
            ]
        } else {
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
        }
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
                            setRenderSubmenu(true);
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

            <MobileContext 
                items={submenu()}
                setRenderSubmenu={setRenderSubmenu}
                img={img ? img : null}
                fallbackIcon={<MusicalNoteIcon />}
                myPlaylist={false}
                title={title}
                subTitle={'song'}
                toAlbumId={getAlbumId}
                expand={smallerWidth}
                renderSubMenu={renderSubmenu}
            /> 

            {!smallerWidth && isComponentVisible && (
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
                    handleCloseSubMenu={() => setIsComponentVisible(false)}
                    artistSubmenu={artistData && artistData.length > 1 && artistNamesMenu(artistData)}
                    isRemove={isSavedTrack}
                    toAlbumId={getAlbumId}
                    toArtistId={artistData && artistData.length === 1 && artistData[0].id}
                />
            )}
        </div>
    );
}

export default TrackItem;
