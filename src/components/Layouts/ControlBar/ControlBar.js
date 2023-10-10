import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams, NavLink } from 'react-router-dom';
import { ArtistIcon, 
         HeartIcon, 
         FillHeartIcon, 
         ShuffleIcon, 
         PreviousIcon,
         PlayIcon,
         NextIcon,
         RepeatIcon,
         RepeatOneIcon,
         PlayingViewIcon,
         QueueIcon,
         VolumeIcon,
         VolumeMuteIcon,
         PauseIcon, 
} from '~/assets/icons';
import config from '~/config';
import Button from '~/components/Button';
import ProgressBar from './ProgressBar';
import classNames from "classnames/bind";
import styles from "./ControlBar.module.scss";
import Player from './Player';

const cx = classNames.bind(styles);

function ControlBar() {
    const { 
        isLogin,
        spotifyApi, 
        showPlayingView, 
        setShowPlayingView, 
        widthNavbar,  
        nextQueueId, 
        nowPlayingId,
        nextFromId,
        setNowPlayingId,
        setNextQueueId,
        playing, setPlaying,
        getData,
        musicList, setMusicList,
        waitingMusicList,
        setWaitingMusicList,
        savedTracks,
        setSavedTracks,
        checkTrackInLiked,
        handleRemoveData,
        handleSaveTrack,
        currentPlayingIndex, setCurrentPlayingIndex,
        getInitialCondition,
        getInitialRelatedNumber,
    } = useContext(AppContext);

    const [trackData, setTrackData] = useState(null);
    const [trackNextFromIds, setTrackNextFromIds] = useState(null);
    const [mute, setMute] = useState(getInitialCondition('CONTROL_CONDITION').mute);
    const [repeat, setRepeat] = useState(getInitialCondition('CONTROL_CONDITION').repeat);
    const [repeatOne, setRepeatOne] = useState(getInitialCondition('CONTROL_CONDITION')['repeat_one']);
    const [shuffle, setShuffle] = useState(getInitialCondition('CONTROL_CONDITION').shuffle);
    const [hasData, setHasData] = useState(false);
    const [isSavedTrack, setIsSavedTrack] = useState(false);
    const [duration, setDuration] = useState(0);
    const [clickNext, setClickNext] = useState(false);
    const [firstTrackId, setFirstTrackId] = useState(null);
    const [timeProgress, setTimeProgress] = useState(getInitialRelatedNumber('PROGRESS') ? getInitialRelatedNumber('PROGRESS')['time_progress'] : 0);
    const [volume, setVolume] = useState(getInitialRelatedNumber('PROGRESS') ? getInitialRelatedNumber('PROGRESS')['volume_value'] : 20);
    const [player, setPlayer] = useState(null);
    const [nextPlay, setNextPlay] = useState(false);
    const [position, setPosition] = useState(0);

    const progressBarRef = useRef(null);
    const volumeRef = useRef(null);
    const playAnimationRef = useRef();
    const playerRef = useRef(null);

    const relatedProgress = useCallback(() => {
        if (playerRef.current) {
            const currentTime = playerRef.current.state.progressMs;
            setTimeProgress(currentTime);
            setPosition(playerRef.current.state.position);
            progressBarRef.current.value = currentTime;
            progressBarRef.current.style.setProperty(
            '--range-progress',
            `${(progressBarRef.current.value / duration) * 100}%`
            );
        
            playAnimationRef.current = requestAnimationFrame(relatedProgress);
        }
    }, [playerRef, duration, progressBarRef, setTimeProgress]);

    // Handle local storage 
    useEffect(() => {
        const obj = {
            mute: mute,
            repeat: repeat,
            repeat_one: repeatOne,
            shuffle: shuffle,
        };

        localStorage.setItem('CONTROL_CONDITION', JSON.stringify(obj));
    }, [mute, repeat, repeatOne, shuffle]);

    useEffect(() => {
        const obj = {
            volume_value: volume,
            time_progress: timeProgress,
        };

        localStorage.setItem('PROGRESS', JSON.stringify(obj));
    }, [volume, timeProgress]);

    // Handle data of playlist 
    useEffect(() => {
        let isMounted = true;

        if (nowPlayingId && nowPlayingId.length > 0) {
            async function loadData() {
                const track = await spotifyApi
                    .getTrack(nowPlayingId)
                    .then((data) => data)
                    .catch((error) => console.log('Error', error));
                if (isMounted) {
                    setHasData(true);
                    setTrackData(track);
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, [nowPlayingId]);

    useEffect(() => {
        let isMounted = true;

        if (nextFromId) {
            async function loadData () {
                let list;

                switch (nextFromId.type) {
                    case 'artist':
                        list = await spotifyApi.getArtistTopTracks(nextFromId.id, 'VN')
                        .then((data) => data.tracks.map((item) => item.id))
                        .catch((error) => console.log('Error', error));
                        break;
                    case 'album':
                        list = await spotifyApi.getAlbumTracks(nextFromId.id, {
                            limit: 50,
                        })
                        .then((data) => {
                            return data.items.map((item) => item.id);
                        })
                        .catch((error) => console.log('Error', error));
                        break;
                    case 'playlist':
                        list = await spotifyApi.getPlaylistTracks(nextFromId.id)
                        .then((data) => data.items.map((item) => item.track.id))
                        .catch((error) => console.log('Error', error));
                        break;
                }

                // console.log('list', list)

                if (isMounted) {
                    setTrackNextFromIds(list);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [nextFromId]);
    
    useEffect(() => {
        handleMusicList(nextFromId, trackNextFromIds, setMusicList);
    }, [nextFromId, trackNextFromIds]);

    useEffect(() => {
        if (musicList) {
            setFirstTrackId(musicList[0]);
        }
    }, [musicList]);

    useEffect(() => {
        if (repeat) {
            if (musicList) {
                if (currentPlayingIndex > musicList.length - 1) {
                    setCurrentPlayingIndex(Number(currentPlayingIndex) - Number(musicList.length));
                }
            }
        } 
    }, [nowPlayingId, firstTrackId, repeat]);
    
    useEffect(() => {
        if (!nextQueueId) {
            const temp = [];

            if (musicList) {
                temp.push(...musicList);
            }
            
            if (musicList && currentPlayingIndex === 0) {
                let index = 0;
                if (nextFromId.trackId) {
                    index = musicList.indexOf(nextFromId.trackId);
                    if (index > -1) {
                        setNowPlayingId(musicList[index]);
                        setCurrentPlayingIndex(index);
                    }
                } else {
                    setNowPlayingId(musicList[0]);
                }
                temp.splice(0, index + 1);
            } else if (!nextQueueId && musicList?.length > 1) {
                setNowPlayingId(musicList[currentPlayingIndex]);
                temp.splice(0, currentPlayingIndex + 1);
            }
            
            if (repeat && musicList) {
                temp.push(...musicList);
            }

            // console.log(temp.length)
            if (temp.length > 0) {
                setWaitingMusicList(temp);
            } else {
                setWaitingMusicList(null);
            } 
        } else if (clickNext) {
            if (nextQueueId.length > 0) {
                setNowPlayingId(nextQueueId[0]);
                handleNextQueueList(nextQueueId, setNextQueueId);
                setClickNext(false);
            } else {
                setNextQueueId(null);
            }
        }
    }, [musicList, nextQueueId, currentPlayingIndex, clickNext, repeat]);

    useEffect(() => {
        if (nowPlayingId && nowPlayingId.length > 0) {
            checkTrackInLiked(savedTracks, nowPlayingId.toString(), setIsSavedTrack);
        }
    }, [savedTracks, nowPlayingId]);

    useEffect(() => {
        if (trackData) {
            setDuration(trackData.duration_ms);
            progressBarRef.current.max = trackData.duration_ms;
        }
    }, [trackData]);

    // console.log(trackData)

    useEffect(() => {
        let arr;
        if (shuffle) {
            if (musicList) {
                arr = [...musicList];
                const temp = arr.splice(0, currentPlayingIndex + 1);
                const result = handleShuffle(arr);

                // console.log(result)

                if (temp) {
                    result.unshift(...temp);
                }
                setMusicList(result);
            }
        
        } else if (musicList) {
            handleMusicList(nextFromId, trackNextFromIds, setMusicList);
        };
    }, [shuffle]);

    useEffect(() => {
        if (trackData && playerRef.current) {
            if (playing) {
                playAnimationRef.current = requestAnimationFrame(relatedProgress);
            } else {
                cancelAnimationFrame(playAnimationRef.current);
                progressBarRef.current.style.setProperty(
                    '--range-progress',
                    `${(playerRef.current.state.progressMs / duration) * 100}%`
                );
            }
        }
    }, [playing, playerRef.current, trackData, relatedProgress]);

    useEffect(() => {
        if (playerRef.current && parseInt(playerRef.current.state.position, 10) == 100) {
            setNextPlay(true);
        }
    });
    
    useEffect(() => {
        const timer = setTimeout(() => {
            if (nextPlay) {
                if (repeatOne) {
                    setPlaying(false);
                } else if (nextQueueId) {
                    setClickNext(true);
                    if (nextQueueId.length === 0) {
                        setCurrentPlayingIndex(currentPlayingIndex + 1);
                    }
                } else if (waitingMusicList && waitingMusicList.length > 0) {
                    if (currentPlayingIndex < musicList.length - 1) {
                        setCurrentPlayingIndex(currentPlayingIndex + 1);
                    } 
                    if (repeat) {
                        if (currentPlayingIndex >= musicList.length - 1) {
                            setCurrentPlayingIndex(Number(currentPlayingIndex) - Number(musicList.length - 1));
                        }
                    }
                } else {
                    setPlaying(false);
                }
                setNextPlay(false);
            }
        }, 400);

        return () => {
            clearTimeout(timer);
        };
    }, [nextPlay]);

    useEffect(() => {
        if (trackData) {
            setPlayer(handleLoadPlayer(trackData.uri, volume))
        }
    }, [trackData, playing]);

    useEffect(() => {
        if (repeatOne && !playing && playerRef.current && playerRef.current.state.position === 0) {
            setPlaying(true)
        }
    }, [repeatOne, playing, playerRef.current]);

    useEffect(() => {
        if (playerRef.current && !playing) {
            if (playerRef.current.state.progressMs == 0 && timeProgress > 0) {
                setTimeProgress(0);
                progressBarRef.current.style.setProperty(
                    '--range-progress',
                    `0%`
                );
                progressBarRef.current.value = 0;
            }
        }
    }, [timeProgress, playing, playerRef.current]);

    // Handle volume
    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.setVolume(parseFloat(volume / 100))
        };
    }, [playerRef.current, volume])

    useEffect(() => {
        if (playerRef.current) {
            if (mute) {
                playerRef.current.setVolume(0)
            } else {
                playerRef.current.setVolume(parseFloat(volume / 100));
            }
        }
    }, [mute, playerRef.current]);

    // console.log(nextFromId)

    if (volumeRef.current) {
        volumeRef.current.style.setProperty(
            '--range-progress',
            `${volume}%`
        );
    };

    function handleShuffle (arr) {
        const n = arr.length;
        if (n > 0) {
            const result = [...arr];

            for (let i = 0; i < n; i++) {
                let r = Math.floor(Math.random() *(n - 1))
                let temp = result[i];
                result[i] = result[r];
                result[r] = temp;
            }
            
            return result;
        }
    };

    function handleMusicList (source, idList, setFunc) {
        const arr = [];
        
        if (source) {
            if (source.type === 'track') {
                arr.push(source.id)
            } else if (idList) {
                arr.push(...idList);
            } else if (source.ids) {
                arr.push(...source.ids);
            }
            setFunc(arr);
        }
    };

    function handleNextQueueList (list, setFunc) {
        if (list) {
            const arr = [...list];
            arr.splice(0, 1);
            if (arr.length > 0) {
                setFunc(arr);
            } else {
                setFunc([]);
            }
        }
    };

    function handleLoadPlayer (trackUri, volume) {
        return (
            <Player 
                token={spotifyApi.getAccessToken()} 
                playerRef={playerRef}
                trackUri={trackUri}
                playing={playing}
                volume={volume}
            />
        )
    }

    return ( 
        isLogin 
        ? <div className={cx('wrapper', 'login')}>
                <div style={{
                    visibility: 'hidden',
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                }}>
                    {player}
                </div>
                <div className={cx('intro')}>
                    {trackData ? (<>
                        {trackData?.album && trackData?.album.images.length > 0
                        ? <img src={trackData.album.images[0].url} alt={`Image of ${trackData.name}`} className={cx('intro-img')} /> 
                        : <div className={cx('intro-img')}>
                            <ArtistIcon />
                        </div>}
                        <div className={cx('track-description')}>
                            <div className={cx('track-credits')}>
                                <Link className={cx('track-name')}
                                    to={`/track/${trackData?.id}`}
                                >
                                    {trackData?.name}
                                </Link>
                                <span>-</span>
                                <Link className={cx('track-album')}
                                    to={`/album/${trackData?.album.id}`}
                                >
                                    {trackData?.album.name}
                                </Link>
                            </div>
                            <div className={cx('track-artists')}>
                                {trackData.artists.map((artist, index) => (
                                    <div key={artist.id}
                                        style={{
                                            marginRight: '2px'
                                        }}
                                    >
                                        <Link 
                                            className={cx('track-artist')}
                                            to={`/artist/${artist.id}`}
                                        >
                                            {artist.name}
                                        </Link>
                                        {index !== trackData.artists.length - 1 && ', '}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <span className={cx('save-btn', 'tooltip', 'svg-icon', 
                            (isSavedTrack && 'active'))}
                            onClick={() => {
                                if (isSavedTrack) {
                                    handleRemoveData(savedTracks, null, setSavedTracks, nowPlayingId.toString());
                                    setIsSavedTrack(false);
                                } else {
                                    setSavedTracks(handleSaveTrack(savedTracks, nowPlayingId.toString()));
                                    setIsSavedTrack(true);
                                }
                            }}
                        >
                            {!isSavedTrack ? <HeartIcon /> : <FillHeartIcon />}
                            {!isSavedTrack 
                                ? <span className={cx('tooltiptext')}>Save to Your Library</span>
                                : <span className={cx('tooltiptext')}>Remove from Your Library</span>
                            }
                        </span>
                    </>) : null}
                </div>

                <div className={cx('wrapper-player-control')}>
                    <div className={cx('player-control', (!trackData && 'disable'))}>
                        <span className={cx('tooltip', 'svg-icon', 'shuffle-icon', ((trackData && shuffle) && 'active'))}
                            onClick={() => setShuffle(!shuffle)}
                        >
                            <ShuffleIcon />
                            {trackData && (shuffle 
                                ? <span className={cx('tooltiptext')}>Disable shuffle</span>
                                : <span className={cx('tooltiptext')}>Enable shuffle</span>)
                            }
                        </span>
                        <span className={cx('tooltip', 'svg-icon')}
                            onClick={() => {
                                if (playerRef.current && parseInt(playerRef.current.state.position, 10) > 2) {
                                    playerRef.current.handleChangeRange(0);
                                } else 
                                if (musicList) {
                                    if (currentPlayingIndex > 0) {
                                        setCurrentPlayingIndex(currentPlayingIndex - 1);
                                    }
                                }
                            }}
                        >
                            <PreviousIcon />
                            {trackData && currentPlayingIndex > 0 && <span className={cx('tooltiptext')}>Previous</span>}
                        </span>
                        <Button rounded icon className={cx('tooltip', 'play-btn')}
                            onClick={() => setPlaying(!playing)}
                        >
                            {!trackData 
                                ? <PauseIcon /> 
                                : (playing ? <PauseIcon /> : <PlayIcon />)
                            }
                        </Button>
                        <span className={cx('tooltip', 'svg-icon')}
                            onClick={() => {
                                if (nextQueueId) {
                                    setClickNext(true);
                                    if (nextQueueId.length === 0) {
                                        setCurrentPlayingIndex(currentPlayingIndex + 1);
                                    }
                                } else if (waitingMusicList && waitingMusicList.length > 0) {
                                    if (currentPlayingIndex < musicList.length - 1) {
                                        setCurrentPlayingIndex(currentPlayingIndex + 1);
                                    }
                                }
                            }}
                        >
                            <NextIcon />
                            {trackData && (musicList && currentPlayingIndex < musicList.length - 1) && <span className={cx('tooltiptext')}>Next</span>}
                        </span>
                        <span className={cx('tooltip', 'svg-icon', 'repeat-icon', ((repeat || repeatOne) && 'active'))}
                            onClick={() => {
                                if (repeat) {
                                    setRepeatOne(true);
                                    setRepeat(false);
                                } else if (repeatOne) {
                                    setRepeatOne(false);
                                } else {
                                    setRepeat(true);
                                }
                            }}
                        >
                            {repeatOne ? <RepeatOneIcon /> : <RepeatIcon />}
                            {trackData && (!repeat 
                                ? <span className={cx('tooltiptext')}>Enable repeat</span>
                                : repeatOne 
                                    ? <span className={cx('tooltiptext')}>Disable repeat</span>
                                    : <span className={cx('tooltiptext')}>Enable repeat one</span>)
                            }
                        </span>
                    </div>
                    <div className={cx('wrapper-progress-bar')}>
                        <ProgressBar trackData={trackData} 
                            audioRef={playerRef}
                            setDuration={setDuration}
                            progressBarRef={progressBarRef}
                            timeProgress={timeProgress} 
                            duration={duration} 
                            setTimeProgress={setTimeProgress}
                        />
                    </div>
                </div>

                <div className={cx('track-render')}>
                    <span className={cx('tooltip', 'svg-icon', (showPlayingView && 'active'), (!trackData && 'disable'))}
                        onClick={() => {
                            if (trackData) {
                                if (window.innerWidth - (widthNavbar + 320 + 8 * 24) < 372) {
                                    setShowPlayingView(false);
                                } else {
                                    setShowPlayingView(!showPlayingView);
                                }
                            }
                        }}
                    >
                        <PlayingViewIcon />
                        {trackData && <span className={cx('tooltiptext')}>Now Playing View</span>}
                    </span>
                    <NavLink className={({isActive}) => cx('tooltip', 'svg-icon', 'queue-btn', isActive && 'active')}
                        to='queue'
                    >
                        <QueueIcon />
                        <span className={cx('tooltiptext')}>Queue</span>
                    </NavLink>
                    <span className={cx('tooltip', 'svg-icon')}
                        onClick={() => setMute(!mute)}
                    >
                        {mute ? <VolumeMuteIcon /> : <VolumeIcon />}
                        {mute 
                            ? <span className={cx('tooltiptext')}>Unmute</span>
                            : <span className={cx('tooltiptext')}>Mute</span>
                        }
                    </span>
                    <input
                        className={cx('volume-slider', mute && 'disable')}
                        type="range"
                        min={0}
                        max={100}
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        ref={volumeRef}
                    />
                </div>
            </div>
        : <div className={cx('wrapper')}>
            <div className={cx('text')}>
                <h5>preview of spotify</h5>
                <p>Sign up to get unlimited songs and podcasts with occasional ads. No credit card needed</p>
            </div>
            <Button href={config.routes.login}>Login</Button>
        </div>
    );
}

export default ControlBar;