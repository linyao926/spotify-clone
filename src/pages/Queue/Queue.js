import { useContext, useState, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { QueueIcon } from '~/assets/icons';
import TrackItem from '~/components/Blocks/TrackItem';
import MainFooter from '~/components/Blocks/MainFooter';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import classNames from 'classnames/bind';
import styles from './Queue.module.scss';

const cx = classNames.bind(styles);

function Queue() {
    const {
        spotifyApi,
        nextQueueId,
        nowPlayingId,
        nextFromId,
        setNextQueueId,
        getData,
        waitingMusicList,
    } = useContext(AppContext);

    const [trackNow, setTrackNow] = useState(null);
    const [tracksNextQueue, setTracksNextQueue] = useState(null);
    const [tracksNextFrom, setTracksNextFrom] = useState(null);
    const [hasData, setHasData] = useState(false);
    const [queueIndex, setQueueIndex] = useState(1);
    const [renderRemind, setRenderRemind] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        if (nowPlayingId) {
            async function loadData() {
                let track;
                if (nowPlayingId.id) {
                    track = await spotifyApi
                    .getTrack(nowPlayingId.id)
                    .then((data) => data)
                    .catch((error) => console.log('Error', error));
                } else {
                    track = await spotifyApi
                    .getTrack(nowPlayingId)
                    .then((data) => data)
                    .catch((error) => console.log('Error', error));
                }

                if (isMounted) {
                    setHasData(true);
                    setTrackNow(track);
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, [nowPlayingId]);

    // console.log(nowPlayingId.length)

    useEffect(() => {
        let isMounted = true;

        if (nextQueueId) {
            const temp = nextQueueId.filter((item, index) => index < 50);
            async function loadData() {
                const list = await Promise.all(temp.map((item) => getData(spotifyApi.getTrack, item.id)));

                if (isMounted) {
                    setHasData(true);
                    setTracksNextQueue(list);
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, [nextQueueId]);

    // console.log(tracksNextQueue)
    // console.log(nextQueueId)

    useEffect(() => {
        if (tracksNextQueue && tracksNextQueue.length > 0) {
            setQueueIndex(tracksNextQueue.length + 1);
        } else {
            setQueueIndex(1);
        }
    }, [tracksNextQueue]);

    useEffect(() => {
        let isMounted = true;

        if (waitingMusicList) {
            const temp = waitingMusicList.filter((item, index) => index < 50);

            async function loadData() {
                const list = await Promise.all(temp.map((item) => {
                    if (item.id) {
                        return getData(spotifyApi.getTrack, item.id)
                    } else {
                        return getData(spotifyApi.getTrack, item)
                    }
                }));

                if (isMounted) {
                    setHasData(true);
                    setTracksNextFrom(list);
                }
            }
            loadData();
        } else {
            if (isMounted) {
                setTracksNextFrom(null);
            }
        }

        return () => (isMounted = false);
    }, [waitingMusicList]);

    // console.log(tracksNextQueue)

    const renderItem = (item, index, inQueue = false, inWaitList = false) => {
        return (
            <TrackItem
                key={index}
                col4
                img={item?.album && item.album.images.length > 0 ? item.album.images[0].url : false}
                index={index}
                title={item?.name}
                toTrackId={item.id}
                toAlbumId={item.album.id}
                album={item.album.name}
                artists={item.artists.map((artist, index) => (
                    <div key={artist.id} className={cx('wrapper-song-artist')}>
                        <Link className={cx('song-artist')} to={`/artist/${artist.id}`}>
                            {artist.name}
                        </Link>
                        {index !== item.artists.length - 1 && ', '}
                    </div>
                ))}
                durationMs={item.duration_ms}
                inQueue={inQueue}
                inWaitList={inWaitList}
                columnHeader
                colHeaderIndex
                colHeaderTitle
                colHeaderAlbum
                colHeaderDuration
            />
        );
    };
    // console.log(waitingMusicList)

    if (hasData) {
        return (
            <>
                <div className={cx('wrapper')}>
                    <h3>Queue</h3>
                    <div className={cx('frame')}>
                        <h4 className={cx('frame-title')}>Now playing</h4>
                        {trackNow && renderItem(trackNow, 1)}
                    </div>

                    {tracksNextQueue && tracksNextQueue.length > 0 && (
                        <div className={cx('frame')}>
                            <header
                                className={cx('frame-header')}
                                style={{
                                    marginBottom: '8px',
                                }}
                            >
                                <h4 className={cx('frame-title')}>Next in queue</h4>
                                <ButtonPrimary dark outline className={cx('clear-btn')} onClick={() => setRenderRemind(true)}>
                                    Clear queue
                                </ButtonPrimary>
                            </header>
                            {tracksNextQueue.map((item, i) => {
                                return renderItem(item.track ? item.track : item, i + 2, true);
                            })}
                        </div>
                    )}

                    {tracksNextFrom && tracksNextFrom.length > 0 && (
                        <div className={cx('frame')}>
                            <header className={cx('frame-header')}>
                                <h4 className={cx('frame-title')}>
                                    Next from:
                                    <Link
                                        className={cx('frame-title-link')}
                                        to={nextFromId.path ? nextFromId.path : `/${nextFromId.type}/${nextFromId.id}`}
                                    >
                                        {nextFromId.title}
                                    </Link>
                                </h4>
                            </header>
                            {tracksNextFrom.map((item, index) =>
                                renderItem(item, index + queueIndex + 1, false, true),
                            )}
                        </div>
                    )}
                </div>
                <MainFooter />
                {renderRemind && (
                    <div className={cx('wrapper-remind')}>
                        <div className={cx('remind')}>
                            <h5>Clear these from your queue?</h5>
                            <p>This cannot be undone</p>
                            <div className={cx('wrapper-btn')}>
                                <ButtonPrimary dark className={cx('cancel-btn')} onClick={() => setRenderRemind(false)}>
                                    Cancel
                                </ButtonPrimary>
                                <ButtonPrimary
                                    primary
                                    className={cx('yes-btn')}
                                    onClick={() => {
                                        setRenderRemind(false);
                                        setNextQueueId(null);
                                        setTracksNextQueue(null);
                                    }}
                                >
                                    Yes
                                </ButtonPrimary>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    } else {
        return (
            <section className={cx('no-tracks-content')}>
                <span className={cx('content-icon')}>
                    <QueueIcon />
                </span>
                <h4 className={cx('content-title')}>Add to your queue</h4>
                <span className={cx('content-subtitle')}>Tap "Add to queue" from a track's menu to see it here.</span>
                <ButtonPrimary 
                    onClick={() => {
                        navigate(`/search`);
                    }}
                >Find something to play</ButtonPrimary>
            </section>
        )
    }
}

export default Queue;
