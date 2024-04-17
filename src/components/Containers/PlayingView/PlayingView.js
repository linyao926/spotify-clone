import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { useWindowSize } from 'react-use';
import { Link } from 'react-router-dom';
import { HeartIcon, FillHeartIcon, DotsIcon, CloseIcon, MusicalNoteIcon } from '~/assets/icons';
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import SubMenu from '~/components/Blocks/SubMenu';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import TrackItem from '~/components/Blocks/TrackItem';
import classNames from 'classnames/bind';
import styles from './PlayingView.module.scss';

const cx = classNames.bind(styles);

function PlayingView({ saveTrack }) {
    const {
        spotifyApi,
        setTokenError,
        setShowPlayingView,
        nextQueueId,
        nowPlayingId,
        nextFromId,
        waitingMusicList,
        contextMenu,
        checkItemLiked,
        savedTracks,
        widthNavbar,
        setPlayingPanelWidth,
    } = useContext(AppContext);

    const { ref, isComponentVisible, setIsComponentVisible, points, setPoints } = useContextMenu();

    const optionRef = useRef(null);

    const [trackData, setTrackData] = useState(null);
    const [artistData, setArtistData] = useState(null);
    const [trackNextQueue, setTrackNextQueue] = useState(null);
    const [hasData, setHasData] = useState(false);
    const [isSavedTrack, setIsSavedTrack] = useState(false);

    const { width } = useWindowSize();
    const gap = 8 * 4;

    OverlayScrollbars.plugin(ClickScrollPlugin);
    useEffect(() => {
        if (ref.current) {
            OverlayScrollbars(
                {
                    target: ref.current,
                    elements: {
                        viewport: ref.current,
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
                    },
                },
            );
    
            ref.current.children[2].style.zIndex = '101';
        }
    }, [ref.current])

    useEffect(() => {
        let isMounted = true;
        setHasData(false);
        if (nowPlayingId) {
            if (nowPlayingId.id) {
                async function loadData() {
                    const [track, artist] = await Promise.all([
                        spotifyApi
                            .getTrack(nowPlayingId.id)
                            .then((data) => data)
                            .catch((error) => {
                                console.log('Error', error)
                                if (error.status === 401) {
                                    setTokenError(true);
                                }
                            }),
    
                        spotifyApi
                            .getTrack(nowPlayingId.id)
                            .then((data) => data.artists[0].id)
                            .then((id) => spotifyApi.getArtist(id))
                            .catch((error) => {
                                console.log('Error', error)
                                if (error.status === 401) {
                                    setTokenError(true);
                                }
                            }),
                    ]);
    
                    if (isMounted) {
                        setHasData(true);
                        setTrackData(track);
                        setArtistData(artist);
                    }
                }
                loadData();
            } else {
                async function loadData() {
                    const [track, artist] = await Promise.all([
                        spotifyApi
                            .getTrack(nowPlayingId)
                            .then((data) => data)
                            .catch((error) => {
                                console.log('Error', error)
                                if (error.status === 401) {
                                    setTokenError(true);
                                }
                            }),
    
                        spotifyApi
                            .getTrack(nowPlayingId)
                            .then((data) => data.artists[0].id)
                            .then((id) => spotifyApi.getArtist(id))
                            .catch((error) => {
                                console.log('Error', error)
                                if (error.status === 401) {
                                    setTokenError(true);
                                }
                            }),
                    ]);
    
                    if (isMounted) {
                        setHasData(true);
                        setTrackData(track);
                        setArtistData(artist);
                    }
                }
                loadData();
            }
        }

        return () => (isMounted = false);
    }, [nowPlayingId]);

    useEffect(() => {
        let isMounted = true;
        setHasData(false);

        if (nextQueueId) {
            async function loadData() {
                const track = await spotifyApi
                .getTrack(nextQueueId[0])
                .then((data) => data)
                .catch((error) => {
                    console.log('Error', error)
                    if (error.status === 401) {
                        setTokenError(true);
                    }
                });
                if (isMounted) {
                    setTrackNextQueue(track);
                    setHasData(true);
                }
            }
            loadData();
        } else if (waitingMusicList) {
            async function loadData() {
                const track = await spotifyApi
                .getTrack(waitingMusicList[0])
                .then((data) => data)
                .catch((error) => {
                    console.log('Error', error)
                    if (error.status === 401) {
                        setTokenError(true);
                    }
                });
                if (isMounted) {
                    setTrackNextQueue(track);
                    setHasData(true);
                }
            }
            loadData();
        } else {
            setTrackNextQueue(null);
        }

        return () => (isMounted = false);
    }, [waitingMusicList, nextQueueId]);

    useEffect(() => {
        if (nowPlayingId) {
            if (nowPlayingId.id) {
                checkItemLiked(savedTracks, nowPlayingId.id, setIsSavedTrack);
            } else {
                checkItemLiked(savedTracks, nowPlayingId, setIsSavedTrack);
            }
        }
    }, [savedTracks, nowPlayingId]);

    useEffect(() => {
        if (ref.current && widthNavbar === 72) {
            if (width - ref.current.offsetWidth - gap - widthNavbar < 416) {
                let panelWidth = width - 416 - gap - widthNavbar;
                if (panelWidth < 280) {
                    setShowPlayingView(false);
                } else if (panelWidth <= 328) {
                    ref.current.style.setProperty('--playing-panel', `${panelWidth}px`);
                    setPlayingPanelWidth(panelWidth);
                } else {
                    ref.current.style.setProperty('--playing-panel', `328px`);
                    setPlayingPanelWidth(328);
                }
            }
        }
    }, [width, ref.current?.offsetWidth, widthNavbar])

    let rect;
    if (optionRef.current) {
        rect = optionRef.current.getBoundingClientRect();
    }

    const artistNamesMenu = (artists) =>
        artists.map((artist) => ({
            title: artist.name,
            to: `/artist/${artist.id}`,
        }));

    if (hasData) {
        let styles;

        if (artistData) {
            styles = {
                background: {
                    backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4="), url(${artistData?.images[0].url})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                },
            };
        }

        return (
            <div className={cx('wrapper')} ref={ref}>
                {trackData && (<>
                    <header>
                        <div className={cx('header-title')}>
                            {trackData?.album ? trackData?.album.name : trackData.name}
                        </div>
                        <div>
                            <>
                                <span className={cx('option-icon', 'tooltip', 'svg-icon')}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsComponentVisible(!isComponentVisible);
                                    }}
                                    ref={optionRef}
                                >
                                    <DotsIcon />
                                    <span className={cx('tooltiptext')}>More options for {trackData.name}</span>
                                </span>
                                {isComponentVisible && (
                                    <SubMenu
                                        menu={contextMenu.track}
                                        pointY={rect.y + rect.height}
                                        pointX={rect.x - 2}
                                        right={60}
                                        isTrack
                                        toId={nowPlayingId.id ? nowPlayingId.id : nowPlayingId}
                                        handleCloseSubMenu={() => setIsComponentVisible(false)}
                                        artistSubmenu={artistData && artistData.length > 1 && artistNamesMenu(artistData)}
                                        isRemove={isSavedTrack}
                                        dots
                                        toArtistId={artistData && artistData.length === 1 && artistData[0].id}
                                        toAlbumId={trackData?.album.id}
                                    />
                                )}
                            </>
                            <ButtonPrimary rounded dark icon className={cx('close-btn')} onClick={() => setShowPlayingView(false)}>
                                <CloseIcon />
                            </ButtonPrimary>
                        </div>
                    </header>
                    <section className={cx('track')}>
                        <img
                            src={
                                trackData?.album && trackData?.album.images[0].url 
                            }
                            alt={`Image of ${trackData?.album ? trackData?.album.name : trackData.name} album`}
                        />
                        <div className={cx('track-content')}>
                            <div className={cx('track-title')}>
                                <Link className={cx('track-name')} to={`track/${trackData.id}`}>
                                    {trackData.name}
                                </Link>
                                <div className={cx('track-artists')}>
                                    {trackData.artists.map((artist, index) => (
                                        <>
                                            <Link
                                                key={artist.id}
                                                className={cx('track-artist')}
                                                to={`/artist/${artist.id}`}
                                            >
                                                {artist.name}
                                            </Link>
                                            {index !== trackData.artists.length - 1 && ', '}
                                        </>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className={cx('save-btn', 'tooltip', 'svg-icon', !saveTrack && 'active')}>
                                    {saveTrack ? <HeartIcon /> : <FillHeartIcon />}
                                    {saveTrack ? (
                                        <span className={cx('tooltiptext')}>Save to Your Library</span>
                                    ) : (
                                        <span className={cx('tooltiptext')}>Remove from Your Library</span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </section>
                </>)}

                {artistData && <div className={cx('wrapper-artist')}>
                    <div className={cx('item-bg')} 
                        style={styles.background}
                    />
                    <Link className={cx('artist')} to={`artist/${artistData?.id}`}>
                        <h5>{artistData?.type}</h5>
                        <div>
                            <h3 className={cx('artist-name')}>{artistData?.name}</h3>
                            <span className={cx('artist-follow')}>{`${Intl.NumberFormat().format(
                                artistData?.followers.total,
                            )} Follower`}</span>
                        </div>
                    </Link>
                </div>}

                {/* Queue section */}
                {trackNextQueue ? (
                    <section className={cx('queue-container')}>
                        <header className={cx('queue-header')}>
                            <h5>Next in queue</h5>
                            <ButtonPrimary underline dark className={cx('queue-btn')} to="/queue">
                                Open queue
                            </ButtonPrimary>
                        </header>
                        <TrackItem
                            nextTrackPlayingView
                            index={<MusicalNoteIcon />}
                            img={trackNextQueue.album.images.length > 0 && trackNextQueue.album.images[0].url}
                            title={trackNextQueue.name}
                            artists={trackNextQueue.artists.map((artist, index) => (
                                <div key={artist.id} className={cx('wrapper-song-artist')}>
                                    <Link className={cx('song-artist')} to={`/artist/${artist.id}`}>
                                        {artist.name}
                                    </Link>
                                    {index !== trackNextQueue.artists.length - 1 && ', '}
                                </div>
                            ))}
                            inQueue={nextQueueId}
                            inWaitList={!nextQueueId && nextFromId}
                            toTrackId={trackNextQueue.id}
                            colHeaderIndex
                            colHeaderAlbum
                        />
                    </section>
                ) : <section className={cx('queue-container', 'not-track')}>
                        <header className={cx('queue-header')}>
                            <h5>Your queue is empty</h5>
                        </header>
                        <ButtonPrimary outline dark className={cx('queue-btn')} to="/search">
                            Search for something new
                        </ButtonPrimary>
                </section>}
            </div>
        );
    }
}

export default PlayingView;
