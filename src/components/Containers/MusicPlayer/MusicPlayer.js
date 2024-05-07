import { extractColors } from 'extract-colors';
import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { AppContext } from '~/context/AppContext';
import { NavLink, useLocation } from 'react-router-dom';
import {
    MusicalNoteIcon,
    PlayingViewIcon,
    QueueIcon,
    VolumeIcon,
    VolumeMuteIcon,
    TickIcon,
    AddIcon,
    AlbumFallbackIcon,
} from '~/assets/icons';
import config from '~/config';
import Information from './Information';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import MobileContext from '~/components/Blocks/MobileContext';
import ProgressBar from './ProgressBar';
import Player from './Player';
import PlayerControls from './PlayerControls';
import MobileExpandPlayer from './MobileExpandPlayer';
import classNames from 'classnames/bind';
import styles from './MusicPlayer.module.scss';

const cx = classNames.bind(styles);

function MusicPlayer({setVisibleMusicPlayer}) {
    const {
        isLogin,
        spotifyApi,
        setTokenError,
        showPlayingView,
        setShowPlayingView,
        playingPanelWidth,
        widthNavbar,
        nextQueueId,
        nowPlayingId,
        nextFromId,
        setNextFromId,
        setNowPlayingId,
        setNextQueueId,
        playing,
        setPlaying,
        waitingMusicList,
        setWaitingMusicList,
        savedTracks,
        checkItemLiked,
        currentPlayingIndex,
        setCurrentPlayingIndex,
        getInitialCondition,
        getInitialRelatedNumber,
        smallerWidth,
        playlist, setPlaylist,
        token, tokenError,
        collapse, 
        setCollapse,
    } = useContext(AppContext);

    const [listAllTrackIds, setListAllTrackIds] = useState([]);

    const [trackNextFromIds, setTrackNextFromIds] = useState(null);
    const [hasData, setHasData] = useState(false);
    const [trackData, setTrackData] = useState(null);
    const [duration, setDuration] = useState(0);
    const [timeProgress, setTimeProgress] = useState(0);

    const [uri, setUri] = useState(false);

    const [repeat, setRepeat] = useState(getInitialCondition('CONTROL_CONDITION').repeat);
    const [repeatOne, setRepeatOne] = useState(getInitialCondition('CONTROL_CONDITION')['repeat_one']);
    const [shuffle, setShuffle] = useState(getInitialCondition('CONTROL_CONDITION').shuffle);
    const [clickNext, setClickNext] = useState(false);

    const [isSavedTrack, setIsSavedTrack] = useState(false);
    const [mute, setMute] = useState(getInitialCondition('CONTROL_CONDITION').mute);
    const [volume, setVolume] = useState(
        getInitialRelatedNumber('PROGRESS') ? getInitialRelatedNumber('PROGRESS')['volume_value'] : 10,
    );
    const [bgColor, setBgColor] = useState('rgb(83, 83, 83)');
    const [colors, setColors] = useState(null);

    const [expand, setExpand] = useState(false);
    const [renderSubMenu, setRenderSubMenu] = useState(false);

    const progressBarRef = useRef(null);
    const volumeRef = useRef(null);
    const playAnimationRef = useRef();
    const playerRef = useRef(null);

    const { pathname } = useLocation();

    useEffect(() => {
        setExpand(false);
    }, [pathname])

    useEffect(() => {
        if (tokenError || !trackData) {
            setHasData(false);
        }
    }, [tokenError, token, hasData]);

    // Handle local storage
    useEffect(() => {
        const controlCondition = {
            mute,
            repeat,
            repeat_one: repeatOne,
            shuffle,
        };
        localStorage.setItem('CONTROL_CONDITION', JSON.stringify(controlCondition));
    }, [mute, repeat, repeatOne, shuffle]);

    useEffect(() => {
        const obj = {
            volume_value: volume,
        };

        localStorage.setItem('PROGRESS', JSON.stringify(obj));
    }, [volume]);

    /* === Playlist === */ 
    useEffect(() => {
        let isMounted = true;

        let offset = 0;
        let totalTracks = Infinity; 
    
        if (nextFromId) {
            if (nextFromId?.type === 'playlist') {
                const fetchTrackIds = async () => {
                    const newTrackIds = [];
                    while (offset < totalTracks) {
                        try {
                            const playlistTracks = await spotifyApi.getPlaylistTracks(nextFromId.id, { offset, limit: 50 });
                            const trackItems = playlistTracks.items;
        
                            const trackIds = trackItems.map((item) => item.track.id);
                            newTrackIds.push(...trackIds);
        
                            if (totalTracks === Infinity) {
                                totalTracks = playlistTracks.total;
                            }
        
                            offset += 50;
                        } catch (error) {
                            console.log('Error', error);
                            if (error.status === 401) {
                                setTokenError(true);
                            }
                            break;
                        }
                    }
                    if (isMounted) {
                        setListAllTrackIds(newTrackIds);
                    }
                };
        
                fetchTrackIds();
            }
        }

        return () => (isMounted = false);
    }, [nextFromId]);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (nextFromId) {
                try {
                    let list;
                    switch (nextFromId.type) {
                        case 'artist':
                            list = await spotifyApi.getArtistTopTracks(nextFromId.id, 'VN');
                            list = list.tracks.map((item) => item.id);
                            break;
                        case 'album':
                            const albumTracks = await spotifyApi.getAlbumTracks(nextFromId.id, { limit: 50 });
                            list = albumTracks.items.map((item) => item.id);
                            break;
                        case 'playlist':
                            if (listAllTrackIds && listAllTrackIds.length > 0) {
                                list = listAllTrackIds;
                                if (nextFromId.index) {
                                    setCurrentPlayingIndex(Number(nextFromId.index));
                                    setNextFromId((prev) => ({
                                        ...prev,
                                        index: false,
                                    }))
                                }
                            }
                            break;
                        case 'likedTracks':
                            list = savedTracks.map((item) => item.id);
                            break;
                        case 'myPlaylist':
                            list = nextFromId.id.map((item) => item.id);
                            break;
                        default:
                            list = [nextFromId.id];
                            break;
                    }
                    if (isMounted) {
                        setTrackNextFromIds(list);
                        setPlaylist(handlePlaylist(nextFromId, list));
                    }
                } catch (error) {
                    console.log('Error', error);
                    if (error.status === 401) {
                        setTokenError(true);
                    }
                }
            }
        };
        loadData();

        return () => (isMounted = false);
    }, [nextFromId, savedTracks, listAllTrackIds]);

    useEffect(() => {
        let arr;
        if (shuffle) {
            if (playlist) {
                arr = [...playlist];
                const temp = arr.splice(0, currentPlayingIndex + 1);
                const result = handleShuffle(arr);

                if (temp && temp.length > 0) {
                    result.unshift(...temp);
                }
                setPlaylist(result);
            }
        } else if (playlist) {
            setPlaylist(handlePlaylist(nextFromId, trackNextFromIds));
        }
    }, [shuffle]);

    useEffect(() => {
        let temp = [];
        if (playlist && playlist.length > 0) {
            if (playlist.length < 31) {
                temp.push(...playlist);
            } else {
                if (currentPlayingIndex + 30 < playlist.length) {
                    temp = playlist.slice(currentPlayingIndex, currentPlayingIndex + 30);
                } else if (currentPlayingIndex < playlist.length) {
                    temp = playlist.slice(currentPlayingIndex, playlist.length)
                }
            }
        }

        if (repeat && playlist) {
            if (currentPlayingIndex === playlist.length - 1) {
                if (playlist.length < 31) {
                    temp.push(...playlist);
                } else {
                    temp = playlist.slice(playlist.length);
                    temp.push(...playlist.slice(0, 29));
                }
            }
        }

        if (!nextQueueId) {
            if (playlist?.length > 0 && playlist.length < 31) {
                setNowPlayingId(playlist[currentPlayingIndex]);
                temp.splice(0, currentPlayingIndex + 1);
            } else {
                if (currentPlayingIndex) {
                    setNowPlayingId(playlist[currentPlayingIndex]);
                    temp.splice(0, 1);
                }
            }
        } else if (clickNext) {
            setClickNext(false);
            if (nextQueueId.length > 0) {
                if (nextQueueId[0] === nowPlayingId) {
                    setNowPlayingId(nextQueueId[0]);
                    playerRef.current.handleChangeRange(0);
                } else {
                    setNowPlayingId(nextQueueId[0]);
                }
                handleNextQueueList(nextQueueId, setNextQueueId);
            } else {
                setNextQueueId(null);
            }
        }

        if (temp.length > 0) {
            setWaitingMusicList(temp);
        } else {
            setWaitingMusicList(null);
        }
    }, [playlist, nextQueueId, currentPlayingIndex, clickNext, repeat]);

    function handlePlaylist(source, idList) {
        const arr = [];

        if (source) {
            if (source.type === 'track') {
                arr.push(source.id);
            } else if (idList) {
                arr.push(...idList);
            } else if (source.ids) {
                arr.push(...source.ids);
            }
            return arr;
        }
    }

    function handleShuffle(arr) {
        const n = arr.length;
        if (n > 0) {
            const result = [...arr];

            for (let i = 0; i < n; i++) {
                let r = Math.floor(Math.random() * (n - 1));
                let temp = result[i];
                result[i] = result[r];
                result[r] = temp;
            }

            return result;
        }
    }

    function handleNextQueueList(list, setFunc) {
        if (list) {
            const arr = [...list];
            arr.splice(0, 1);
            if (arr.length > 0) {
                setFunc(arr);
            } else {
                setFunc([]);
            }
        }
    }
    /* === PlayerState === */ 
    useEffect(() => {
        const nextUri = nextQueueId 
          ? (nowPlayingId ? `spotify:track:${nowPlayingId?.id || nowPlayingId}` : currentPlayingIndex && `spotify:track:${(playlist[currentPlayingIndex]?.id ? playlist[currentPlayingIndex]?.id : playlist[currentPlayingIndex])}`)
          : currentPlayingIndex && `spotify:track:${(playlist[currentPlayingIndex]?.id ? playlist[currentPlayingIndex]?.id : playlist[currentPlayingIndex])}`;
        setUri(nextUri);
    }, [nextQueueId, nowPlayingId, playlist, currentPlayingIndex, uri]);

    useEffect(() => {
        let isMounted = true;
        
        if (currentPlayingIndex && playlist[currentPlayingIndex]) {
            async function loadData() {
                let track;
                if (playlist[currentPlayingIndex].id) {
                    track = await spotifyApi
                    .getTrack(playlist[currentPlayingIndex].id)
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });

                    if (isMounted) {
                        setTrackData(track)
                    }
                } else {
                    track = await spotifyApi
                    .getTrack(playlist[currentPlayingIndex])
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });

                    if (isMounted) {
                        setHasData(true);
                        setTrackData(track)
                    };
                }
            }
            loadData();
        } else if (nextQueueId && nowPlayingId) {
            async function loadData() {
                let track;
                if (nowPlayingId.id) {
                    track = await spotifyApi
                    .getTrack(nowPlayingId.id)
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });

                    if (isMounted) {
                        setTrackData(track)
                    }
                } else {
                    track = await spotifyApi
                    .getTrack(nowPlayingId)
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });

                    if (isMounted) {
                        setHasData(true);
                        setTrackData(track)
                    };
                }
            }
            
            loadData();
        }

        return () => (isMounted = false);
    }, [playlist, nextQueueId, nowPlayingId, currentPlayingIndex]);

    useEffect(() => {
        if (trackData && progressBarRef.current) {
            setDuration(trackData.duration_ms);
            progressBarRef.current.max = trackData.duration_ms;
        }
    }, [trackData]);

    const relatedProgress = useCallback(() => {
        if (playerRef.current) {
            const currentTime = playerRef.current.state.progressMs;
            setTimeProgress(currentTime);

            playAnimationRef.current = requestAnimationFrame(relatedProgress);
        }
    }, [playerRef, duration, progressBarRef, setTimeProgress]);

    useEffect(() => {
        if (trackData && playerRef.current) {
            if (playing) {
                playAnimationRef.current = requestAnimationFrame(relatedProgress);
            } else {
                cancelAnimationFrame(playAnimationRef.current);
            }
        }
    }, [playing, trackData, relatedProgress, playerRef]);

    /* === On current track ended === */ 
    useEffect(() => {
        if (playerRef.current && trackData.duration_ms - playerRef.current.state.progressMs <= 0) {
            if (repeatOne) {
                playerRef.current.handleChangeRange(0);
                setPlaying(true);
            } else if (nextQueueId) {
                setClickNext(true);
                if (nextQueueId.length === 0) {
                    setCurrentPlayingIndex(currentPlayingIndex + 1);
                }
            } else if (waitingMusicList && waitingMusicList.length > 0) {
                if (repeat) {
                    playerRef.current.handleChangeRange(0)
                    if (currentPlayingIndex >= playlist.length - 1) {
                        setCurrentPlayingIndex(0);
                    } else {
                        setCurrentPlayingIndex(currentPlayingIndex + 1);
                    }
                } else if (currentPlayingIndex < playlist.length - 1) {
                    playerRef.current.handleChangeRange(0)
                    setCurrentPlayingIndex(currentPlayingIndex + 1);
                } 
            } 
        }
    }, [playerRef, playerRef?.current?.state.progressMs]);
    
    /* === Controls === */
    function playNextTrack() {
        if (playerRef.current) {
            if (nextQueueId) {
                playerRef.current.handleChangeRange(0);
                setClickNext(true);
                if (nextQueueId.length === 0) {
                    setCurrentPlayingIndex(currentPlayingIndex + 1);
                }
            } else if (waitingMusicList && waitingMusicList.length > 0) {
                if (repeat) {
                    playerRef.current.handleChangeRange(0);
                    if (currentPlayingIndex >= playlist.length - 1) {
                        setCurrentPlayingIndex(0);
                    } else {
                        setCurrentPlayingIndex(currentPlayingIndex + 1);
                    }
                } else if (currentPlayingIndex < playlist.length - 1) {
                    playerRef.current.handleChangeRange(0);
                    setCurrentPlayingIndex(currentPlayingIndex + 1);
                } 
            }
        }
    };

    function playPreviousTrack() {
        if (playerRef.current && parseInt(playerRef.current.state.position, 10) > 2) {
            playerRef.current.handleChangeRange(0);
        } else if (playlist) {
            if (repeat) {
                playerRef.current.handleChangeRange(0);
                if (currentPlayingIndex === 0) {
                    setCurrentPlayingIndex(playlist.length - 1);
                } else {
                    setCurrentPlayingIndex(currentPlayingIndex - 1);
                }
            } else if (currentPlayingIndex > 0) {
                setCurrentPlayingIndex(currentPlayingIndex - 1);
                playerRef.current.handleChangeRange(0);
            }
        }
    }

    /* === Orther === */
    useEffect(() => {
        if (nowPlayingId) {
            if (nowPlayingId.id) {
                checkItemLiked(savedTracks, nowPlayingId.id, setIsSavedTrack);
            } else {
                checkItemLiked(savedTracks, nowPlayingId, setIsSavedTrack);
            }
        }
    }, [savedTracks, nowPlayingId]);

    // Volume
    useEffect(() => {
        if (volumeRef.current) {
            if (playerRef.current) {
                if (mute) {
                    playerRef.current.setVolume(0);
                } else {
                    playerRef.current.setVolume(parseFloat(volume / 100));
                }
            }
            volumeRef.current.style.setProperty('--range-progress', `${volume}%`);
        }
    }, [mute, playerRef, volume, volumeRef.current]);

    // Get bg color
    useEffect(() => {
        if (trackData?.album.images.length > 0) {
            extractColors(trackData.album.images[0].url, { crossOrigin: 'Anonymous' }).then(setColors).catch(console.error);
        } else {
            setBgColor('rgb(83, 83, 83)');
        }
    }, [trackData]);

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
            setBgColor(color);
        }
    }, [colors]);

    useEffect(() => {
        if (setVisibleMusicPlayer) {
            if (trackData) {
                setVisibleMusicPlayer(true);
            } else {
                setVisibleMusicPlayer(false);
            }
        }
    }, [trackData, setVisibleMusicPlayer]);

    const subMenuInExpand = [
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
            to: `/track/${trackData?.id}`,
        },
        {
            title: 'Go to album',
            to: `/album/${trackData?.album.id}`,
            lefticon: <AlbumFallbackIcon />,
        }
    ];    

    return isLogin ? (
        <>
            <div className={cx('wrapper', 'login', !expand && 'before-pseudo')}
                style={{
                    backgroundColor: smallerWidth ? (expand ? 'transparent' : bgColor) : 'var(--color-black-deepestest)',
                    cursor: smallerWidth ? 'pointer' : 'default',
                    zIndex: smallerWidth && '1000',
                    visibility: smallerWidth ? (trackData ? 'visible' : 'hidden') : 'visible',
                }}
                onClick={() => {
                    if (smallerWidth) {
                        setExpand(true)
                    }
                }}
            >
                <div
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        width: '0',
                    }}
                >
                    {trackData && <Player
                        token={spotifyApi.getAccessToken()}
                        playerRef={playerRef}
                        trackUri={uri}
                        playing={playing}
                        volume={volume}
                    />}
                </div>
                <div className={cx(!smallerWidth && 'wrapper-info')}>
                    {(trackData && !expand) && <Information 
                        setTrackData={setTrackData}
                        trackData={trackData}
                        isSavedTrack={isSavedTrack}
                        setIsSavedTrack={setIsSavedTrack}
                        bgColor={bgColor}
                        setBgColor={setBgColor}
                        smallerWidth={smallerWidth}
                        setPlaying={smallerWidth && setPlaying}
                        playing={smallerWidth && playing}
                        onClick={(e) => {
                            if(e && e.stopPropagation) e.stopPropagation(); 
                            e.preventDefault();
                        }}
                    />}
                </div>

                <div className={cx(smallerWidth ? '' : 'wrapper-player-control')}>
                    <div className={cx('wrapper-progress-bar')}>
                        <ProgressBar
                            trackData={trackData}
                            audioRef={playerRef}
                            setDuration={setDuration}
                            progressBarRef={progressBarRef}
                            timeProgress={timeProgress}
                            duration={duration}
                            setTimeProgress={setTimeProgress}
                            smallerWidth={smallerWidth}
                            isExpand={expand}
                        />
                    </div>
                    <PlayerControls 
                        trackData={trackData} 
                        currentPlayingIndex={currentPlayingIndex} 
                        playlist={playlist} 
                        repeat={repeat}
                        setRepeat={setRepeat}
                        repeatOne={repeatOne}
                        setRepeatOne={setRepeatOne}
                        shuffle={shuffle}
                        setShuffle={setShuffle}
                        playing={playing}
                        setPlaying={setPlaying}
                        isExpand={expand}
                        playNextTrack={playNextTrack}
                        playPreviousTrack={playPreviousTrack}
                    />
               </div>
               {!smallerWidth && <div className={cx('track-render')}>
                    <span
                        className={cx('tooltip', 'svg-icon', showPlayingView && 'active', !trackData && 'disable')}
                        onClick={() => {
                            if (trackData) {
                                if (collapse) {
                                    if (window.innerWidth - (widthNavbar + 280 + 8 * 4) < 416) {
                                        setShowPlayingView(false);
                                    } else {
                                        setShowPlayingView(!showPlayingView);
                                    }
                                } else {
                                    if (window.innerWidth - (72 + 280 + 8 * 4) < 416) {
                                        setShowPlayingView(false);
                                        setCollapse(true);
                                    } else {
                                        setShowPlayingView(!showPlayingView);
                                    }
                                }
                            }
                        }}
                    >
                        <PlayingViewIcon />
                        {trackData && <span className={cx('tooltiptext')}>Now Playing View</span>}
                    </span>
                    <NavLink
                        className={({ isActive }) => cx('tooltip', 'svg-icon', 'queue-btn', isActive && 'active')}
                        to="queue"
                    >
                        <QueueIcon />
                        <span className={cx('tooltiptext')}>Queue</span>
                    </NavLink>
                    <span className={cx('tooltip', 'svg-icon')} onClick={() => setMute(!mute)}>
                        {mute ? <VolumeMuteIcon /> : <VolumeIcon />}
                        {mute ? (
                            <span className={cx('tooltiptext')}>Unmute</span>
                        ) : (
                            <span className={cx('tooltiptext')}>Mute</span>
                        )}
                    </span>
                    <input
                        className={cx('volume-slider', mute && 'disable')}
                        type="range"
                        min={0}
                        max={100}
                        value={volume}
                        onChange={(e) => {
                            setVolume(e.target.value);
                        }}
                        ref={!smallerWidth ? volumeRef : null}
                    />
                </div>}
            </div> 
            <MobileExpandPlayer 
                collapse={setExpand}
                albumId={trackData?.album.id}
                albumName={trackData?.album.name}
                img={trackData?.album.images ? trackData?.album.images[0].url : false}
                trackName={trackData?.name}
                trackId={trackData?.id}
                artists={trackData?.artists}
                mute={mute}
                setMute={setMute}
                volume={volume}
                setVolume={setVolume}
                volumeRef={smallerWidth ? volumeRef : null}
                bgColor={bgColor}
                isSavedTrack={isSavedTrack}
                setIsSavedTrack={setIsSavedTrack}
                onClick={() => setRenderSubMenu(true)}
                expand={expand}
            />
            <MobileContext
                items={subMenuInExpand}
                setRenderSubmenu={setRenderSubMenu}
                img={trackData?.album.images ? trackData?.album.images[0].url : null}
                fallbackIcon={<MusicalNoteIcon />}
                myPlaylist={false}
                title={trackData?.name}
                subTitle={'song'}
                toAlbumId={trackData?.album.id}
                toId={trackData?.id}
                expand={expand}
                renderSubMenu={renderSubMenu}
            />
    </>) : (
        <div className={cx('wrapper')}
            style={{
                background: 'linear-gradient(90deg, #af2896, #509bf5)',
                padding: smallerWidth ? '0 12px' : '12px 32px 12px 22px'
            }}
        >
            <div className={cx('text')}>
                <h5>preview of spotify</h5>
                <p>Sign up to get unlimited songs with occasional ads.</p>
            </div>
            <ButtonPrimary className={cx('log-in-btn')} href={config.routes.login}>Login</ButtonPrimary>
        </div>
    );
}

export default MusicPlayer;
