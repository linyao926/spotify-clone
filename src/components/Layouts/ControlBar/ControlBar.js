import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useLocation } from 'react-router-dom';
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
} from '~/assets/icons';
import config from '~/config';
import Button from '~/components/Button';
import classNames from "classnames/bind";
import styles from "./ControlBar.module.scss";

const cx = classNames.bind(styles);

function ControlBar({
    active = true, 
    repeat, 
    repeatOne, 
    saveTrack
}) {
    const { isLogin, spotifyApi } = useContext(AppContext);

    // const [id, setId] = useState(null);
    const [trackData, setTrackData] = useState(null);
    const [hasData, setHasData] = useState(false);
    const [mute, setMute] = useState(false);

    const {pathname} = useLocation();

    const id = '4uUG5RXrOk84mYEfFvj3cK';

    // useEffect(() => {
    //     const indexStart = pathname.indexOf('/', 1) + 1;
    //     setId(pathname.slice(indexStart));
    //     setHasData(false);
    // }, [pathname]);

    useEffect(() => {
        let isMounted = true;

        if (id) {
            async function loadData () {
                const track = await spotifyApi.getTrack(id);
                if (isMounted) {
                    setHasData(true);
                    setTrackData(track);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [id]);

    return ( 
        isLogin 
        ? hasData && (
            <div className={cx('wrapper', 'login')}>
                <div className={cx('intro')}>
                    {trackData.album.images.length > 0 
                        ? <img src={trackData.album.images[0].url} alt={`Image of ${trackData.name}`} className={cx('intro-img')} /> 
                        : <div className={cx('intro-img')}>
                            <ArtistIcon />
                        </div>
                    }
                    <div className={cx('track-description')}>
                        <Link className={cx('track-album')}
                            to={`/album/${trackData.album.id}`}
                        >
                            {trackData.album.name}
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
                    <span className={cx('save-btn', 'tooltip', 'svg-icon', (!saveTrack && 'active'))}>
                        {saveTrack ? <HeartIcon /> : <FillHeartIcon />}
                        {saveTrack 
                            ? <span className={cx('tooltiptext')}>Save to Your Library</span>
                            : <span className={cx('tooltiptext')}>Remove from Your Library</span>
                        }
                    </span>
                </div>

                <div className={cx('wrapper-player-control')}>
                    <div className={cx('player-control')}>
                        <span className={cx('tooltip', 'svg-icon', (active && 'active'))}>
                            <ShuffleIcon />
                            {active 
                                ? <span className={cx('tooltiptext')}>Disable shuffle</span>
                                : <span className={cx('tooltiptext')}>Enable shuffle</span>
                            }
                        </span>
                        <span className={cx('tooltip', 'svg-icon')}>
                            <PreviousIcon />
                            <span className={cx('tooltiptext')}>Previous</span>
                        </span>
                        <Button rounded icon className={cx('tooltip', 'play-btn')}>
                            <PlayIcon />
                            <span className={cx('tooltiptext')}>Play</span>
                        </Button>
                        <span className={cx('tooltip', 'svg-icon')}>
                            <NextIcon />
                            <span className={cx('tooltiptext')}>Next</span>
                        </span>
                        <span className={cx('tooltip', 'svg-icon', (repeat && 'active'))}>
                            {repeatOne ? <RepeatOneIcon /> : <RepeatIcon />}
                            {!repeat 
                                ? <span className={cx('tooltiptext')}>Enable repeat</span>
                                : repeatOne 
                                    ? <span className={cx('tooltiptext')}>Disable repeat</span>
                                    : <span className={cx('tooltiptext')}>Enable repeat one</span>
                            }
                        </span>
                    </div>
                    <div className={cx('track-progress')}>
                        <span className={cx('track-duration')}>0:00</span>
                        <div className={cx('progress-bar')}>
                            <div className={cx('bg')} 
                                style={{
                                    width: '20%',
                                }}
                            />
                        </div>
                        <span className={cx('track-duration')}>2:55</span>
                    </div>
                </div>

                <div className={cx('track-render')}>
                    <span className={cx('tooltip', 'svg-icon')}>
                        <PlayingViewIcon />
                        <span className={cx('tooltiptext')}>Now Playing View</span>
                    </span>
                    <span className={cx('tooltip', 'svg-icon')}>
                        <QueueIcon />
                        <span className={cx('tooltiptext')}>Queue</span>
                    </span>
                    <span className={cx('tooltip', 'svg-icon')}
                        onClick={() => setMute(!mute)}
                    >
                        {mute ? <VolumeMuteIcon /> : <VolumeIcon />}
                        {mute 
                            ? <span className={cx('tooltiptext')}>Unmute</span>
                            : <span className={cx('tooltiptext')}>Mute</span>
                        }
                    </span>
                    <div className={cx('volume-slider')}>
                        <div className={cx('bg')} 
                            style={{
                               width: '20%',
                            }}
                        />
                    </div>
                </div>
            </div>
        )
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