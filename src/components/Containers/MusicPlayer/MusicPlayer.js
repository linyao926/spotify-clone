import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams, NavLink } from 'react-router-dom';
import {
    ArtistIcon,
    HeartIcon,
    FillHeartIcon,
    PlayingViewIcon,
    QueueIcon,
    VolumeIcon,
    VolumeMuteIcon,
} from '~/assets/icons';
import config from '~/config';
import Information from './Information';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import ProgressBar from './ProgressBar';
import Player from './Player';
import PlayerControls from './PlayerControls';
import classNames from 'classnames/bind';
import styles from './MusicPlayer.module.scss';

const cx = classNames.bind(styles);

function MusicPlayer() {
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
        playing,
        setPlaying,
        waitingMusicList,
        setWaitingMusicList,
        savedTracks,
        setSavedTracks,
        checkItemLiked,
        handleRemoveData,
        handleSaveItemToList,
        currentPlayingIndex,
        setCurrentPlayingIndex,
        getInitialCondition,
        getInitialRelatedNumber,
    } = useContext(AppContext);
    
    const [musicList, setMusicList] = useState([]);
    const [trackData, setTrackData] = useState(null);
    const [trackNextFromIds, setTrackNextFromIds] = useState(null);
    const [mute, setMute] = useState(getInitialCondition('CONTROL_CONDITION').mute);
    const [repeat, setRepeat] = useState(getInitialCondition('CONTROL_CONDITION').repeat);
    const [repeatOne, setRepeatOne] = useState(getInitialCondition('CONTROL_CONDITION')['repeat_one']);
    const [shuffle, setShuffle] = useState(getInitialCondition('CONTROL_CONDITION').shuffle);
    const [isSavedTrack, setIsSavedTrack] = useState(false);
    const [duration, setDuration] = useState(0);
    const [clickNext, setClickNext] = useState(false);
    const [timeProgress, setTimeProgress] = useState(
        getInitialRelatedNumber('PROGRESS') ? getInitialRelatedNumber('PROGRESS')['time_progress'] : 0,
    );
    const [volume, setVolume] = useState(
        getInitialRelatedNumber('PROGRESS') ? getInitialRelatedNumber('PROGRESS')['volume_value'] : 20,
    );
    const [nextPlay, setNextPlay] = useState(false);

    const progressBarRef = useRef(null);
    const volumeRef = useRef(null);
    const playAnimationRef = useRef();
    const playerRef = useRef(null);

    // console.log(nowPlayingId)

    const relatedProgress = useCallback(() => {
        if (playerRef.current) {
            const currentTime = playerRef.current.state.progressMs;
            setTimeProgress(currentTime);
            progressBarRef.current.value = currentTime;
            progressBarRef.current.style.setProperty(
                '--range-progress',
                `${(progressBarRef.current.value / duration) * 100}%`,
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
        
        if (nextFromId && isLogin) {
            async function loadData() {
                let list;

                switch (nextFromId.type) {
                    case 'artist':
                        list = await spotifyApi
                            .getArtistTopTracks(nextFromId.id, 'VN')
                            .then((data) => data.tracks.map((item) => item.id))
                            .catch((error) => console.log('Error', error));
                        break;
                    case 'album':
                        list = await spotifyApi
                            .getAlbumTracks(nextFromId.id, {
                                limit: 50,
                            })
                            .then((data) => {
                                return data.items.map((item) => item.id);
                            })
                            .catch((error) => console.log('Error', error));
                        break;
                    case 'playlist':
                        list = await spotifyApi
                            .getPlaylistTracks(nextFromId.id)
                            .then((data) => data.items.map((item) => item.track.id))
                            .catch((error) => console.log('Error', error));
                        break;
                    case 'likedTracks':
                        list = savedTracks.filter((item) => item.id);
                        break;
                    case 'myPlaylist':
                        list = [];
                        nextFromId.id.map((item) => list.push(item.id));
                        break;
                }

                if (isMounted) {
                    setTrackNextFromIds(list);
                    handleMusicList(nextFromId, list, setMusicList);
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, [nextFromId, isLogin]);

    useEffect(() => {
        if (repeat) {
            if (musicList) {
                if (currentPlayingIndex > musicList.length - 1) {
                    setCurrentPlayingIndex(Number(currentPlayingIndex) - Number(musicList.length));
                }
            }
        }
    }, [nowPlayingId, repeat]);

    useEffect(() => {
        if (!nextQueueId) {
            const temp = [];
            if (musicList) {
                temp.push(...musicList);
            }
            // console.log(nextFromId)

            if (musicList?.length > 1) {
                setNowPlayingId(musicList[currentPlayingIndex]);
                temp.splice(0, currentPlayingIndex + 1);
            }

            if (repeat && musicList) {
                if (musicList.length > 1) {
                    temp.push(...musicList);
                } 
            }

            // console.log(waitingMusicList)
            if (temp.length > 0) {
                setWaitingMusicList(temp);
            } else {
                setWaitingMusicList(null);
            }
        } else if (clickNext) {
            if (nextQueueId.length > 0) {
                if (nextQueueId[0] === nowPlayingId) {
                    setNowPlayingId(nextQueueId[0]);
                    playerRef.current.handleChangeRange(0);
                } else {
                    setNowPlayingId(nextQueueId[0]);
                }
                handleNextQueueList(nextQueueId, setNextQueueId);
                setClickNext(false);
            } else {
                setNextQueueId(null);
            }
        }
    }, [musicList, nextQueueId, currentPlayingIndex, clickNext, repeat]);

    useEffect(() => {
        if (nowPlayingId && nowPlayingId.length > 0) {
            checkItemLiked(savedTracks, nowPlayingId.toString(), setIsSavedTrack);
        }
    }, [savedTracks, nowPlayingId]);

    useEffect(() => {
        if (trackData && progressBarRef.current) {
            setDuration(trackData.duration_ms);
            progressBarRef.current.max = trackData.duration_ms;
        }
    }, [trackData]);

    useEffect(() => {
        let arr;
        if (shuffle) {
            if (musicList) {
                arr = [...musicList];
                const temp = arr.splice(0, currentPlayingIndex + 1);
                const result = handleShuffle(arr);

                if (temp && temp.length > 0) {
                    result.unshift(...temp);
                }
                setMusicList(result);
            }
        } else if (musicList) {
            handleMusicList(nextFromId, trackNextFromIds, setMusicList);
        }
    }, [shuffle]);

    useEffect(() => {
        if (trackData && playerRef.current) {
            if (playing) {
                playAnimationRef.current = requestAnimationFrame(relatedProgress);
            } else {
                cancelAnimationFrame(playAnimationRef.current);
                progressBarRef.current.style.setProperty(
                    '--range-progress',
                    `${(playerRef.current.state.progressMs / duration) * 100}%`,
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
        if (repeatOne && !playing && playerRef.current && playerRef.current.state.position === 0) {
            setPlaying(true);
        }
    }, [repeatOne, playing, playerRef.current]);

    // console.log(trackData)

    useEffect(() => {
        if (playerRef.current && !playing) {
            if (playerRef.current.state.progressMs == 0 && timeProgress > 0) {
                setTimeProgress(0);
                progressBarRef.current.style.setProperty('--range-progress', `0%`);
                progressBarRef.current.value = 0;
            }
        }
    }, [timeProgress, playing, playerRef.current]);

    // Handle volume
    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.setVolume(parseFloat(volume / 100));
        }
    }, [playerRef.current, volume]);

    useEffect(() => {
        if (playerRef.current) {
            if (mute) {
                playerRef.current.setVolume(0);
            } else {
                playerRef.current.setVolume(parseFloat(volume / 100));
            }
        }
    }, [mute, playerRef.current]);

    if (volumeRef.current) {
        volumeRef.current.style.setProperty('--range-progress', `${volume}%`);
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

    function handleMusicList(source, idList, setFunc) {
        const arr = [];

        if (source) {
            if (source.type === 'track') {
                arr.push(source.id);
            } else if (idList) {
                arr.push(...idList);
            } else if (source.ids) {
                arr.push(...source.ids);
            }
            setFunc(arr);
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

    // console.log(playerRef.current)

    return isLogin ? (
        <div className={cx('wrapper', 'login')}>
            <div
                style={{
                    visibility: 'hidden',
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                }}
            >
                {trackData && <Player
                    token={spotifyApi.getAccessToken()}
                    playerRef={playerRef}
                    trackUri={[`spotify:track:${trackData.id}`]}
                    playing={playing}
                    volume={volume}
                />}
            </div>

            <Information 
                setTrackData={setTrackData}
                trackData={trackData}
                isSavedTrack={isSavedTrack}
                setIsSavedTrack={setIsSavedTrack}
            />

            <div className={cx('wrapper-player-control')}>
                <PlayerControls 
                    trackData={trackData} 
                    currentPlayingIndex={currentPlayingIndex} 
                    musicList={musicList} 
                    playerRef={playerRef}
                    repeat={repeat}
                    setRepeat={setRepeat}
                    repeatOne={repeatOne}
                    setRepeatOne={setRepeatOne}
                    shuffle={shuffle}
                    setShuffle={setShuffle}
                    setCurrentPlayingIndex={setCurrentPlayingIndex}
                    setPlaying={setPlaying}
                    playing={playing}
                    nextQueueId={nextQueueId}
                    setClickNext={setClickNext}
                    waitingMusicList={waitingMusicList}
                    nowPlayingId={nowPlayingId}
                />
                <div className={cx('wrapper-progress-bar')}>
                    <ProgressBar
                        trackData={trackData}
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
                <span
                    className={cx('tooltip', 'svg-icon', showPlayingView && 'active', !trackData && 'disable')}
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
                    onChange={(e) => setVolume(e.target.value)}
                    ref={volumeRef}
                />
            </div>
        </div>
    ) : (
        <div className={cx('wrapper')}>
            <div className={cx('text')}>
                <h5>preview of spotify</h5>
                <p>Sign up to get unlimited songs and podcasts with occasional ads. No credit card needed</p>
            </div>
            <ButtonPrimary href={config.routes.login}>Login</ButtonPrimary>
        </div>
    );
}

export default MusicPlayer;
