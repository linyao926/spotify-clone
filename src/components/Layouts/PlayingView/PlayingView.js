import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { HeartIcon, FillHeartIcon, DotsIcon, CloseIcon } from '~/assets/icons';
import Button from '~/components/Button';
import 'overlayscrollbars/overlayscrollbars.css';
import { 
  OverlayScrollbars, 
  ScrollbarsHidingPlugin, 
  SizeObserverPlugin, 
  ClickScrollPlugin 
} from 'overlayscrollbars';
import classNames from 'classnames/bind';
import styles from './PlayingView.module.scss';

const cx = classNames.bind(styles);

function PlayingView({saveTrack}) {
    const { spotifyApi, setShowPlayingView } = useContext(AppContext);
    // const [id, setId] = useState(null);
    const [trackData, setTrackData] = useState([]);
    const [artistData, setArtistData] = useState([]);
    const [hasData, setHasData] = useState(false);
    
    const ref = useRef(null);
    const params = useParams();

    OverlayScrollbars.plugin(ClickScrollPlugin);
    if (ref.current) {
        OverlayScrollbars({ 
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
        });

        ref.current.children[2].style.zIndex = '101';
    };

    const id = '4uUG5RXrOk84mYEfFvj3cK';

    // const date = new Date(resultData.release_date);
    // const year = date.getFullYear();
    // const month = date.toLocaleDateString("en-GB", {month: 'long'});
    // const day = date.getDate();

    // useEffect(() => {
    //     setId(params.id);
    //     setHasData(false);
    // }, [params]);

    useEffect(() => {
        let isMounted = true;

        if (id) {
            async function loadData () {
                const [track, artist] =  await Promise.all([
                    spotifyApi.getTrack(id),
                    spotifyApi.getTrack(id)
                    .then(function (data) {
                        // console.log(data)
                        return spotifyApi.getArtist(data.artists[0].id);
                    })
                ]);
                if (isMounted) {
                    setHasData(true);
                    setTrackData(track);
                    setArtistData(artist);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [id]);

    // console.log('artistData', artistData)

    if (hasData) {
        const styles = {
            background: {
                backgroundImage: `url(${artistData.images[0].url})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            },
        };

        return ( 
            <div className={cx('wrapper')}
                ref={ref}
            >
                <header>
                    <Link className={cx('header-title')}>{trackData.album.name}</Link>
                    <Button rounded dark icon className={cx('close-btn')}
                        onClick={() => setShowPlayingView(false)}
                    >
                        <CloseIcon />
                    </Button>
                </header>
                <section className={cx('track')}>
                    <img src={trackData.album.images[0].url} 
                        alt={`Image of ${trackData.album.name} album`}
                    />
                    <div className={cx('track-content')}>
                        <div className={cx('track-title')}>
                            <Link className={cx('track-name')}
                                to={`track/${trackData.id}`}
                            >
                                {trackData.name}
                            </Link>
                            <div className={cx('track-artists')}>
                                {trackData.artists.map((artist, index) => (
                                    <>
                                        <Link key={artist.id}
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
                            <span className={cx('save-btn', 'tooltip', 'svg-icon', (!saveTrack && 'active'))}>
                                {saveTrack ? <HeartIcon /> : <FillHeartIcon />}
                                {saveTrack 
                                    ? <span className={cx('tooltiptext')}>Save to Your Library</span>
                                    : <span className={cx('tooltiptext')}>Remove from Your Library</span>
                                }
                            </span>
                            
                            <span className={cx('option-icon', 'tooltip', 'svg-icon')}>
                                <DotsIcon />
                                <span className={cx('tooltiptext')}>More options for {trackData.name}</span>
                            </span>
                        </div>
                    </div>
                </section>

                <Link className={cx('artist')}
                    style={styles.background}
                    to={`artist/${artistData.id}`}
                >
                    <h5>{artistData.type}</h5>
                    <div>
                        <h3 className={cx('artist-name')}>{artistData.name}</h3>
                        <span className={cx('artist-follow')}>{`${Intl.NumberFormat().format(artistData.followers.total)} Follower`}</span>
                    </div>
                </Link>

                {/* Queue section */}
            </div>
        );
    }
}

export default PlayingView;