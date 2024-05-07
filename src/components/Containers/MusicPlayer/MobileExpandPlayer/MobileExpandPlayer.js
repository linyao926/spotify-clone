import { useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link } from 'react-router-dom';
import {
    VolumeIcon,
    VolumeMuteIcon,
    DotsIcon,
    AlbumFallbackIcon,
    HeartIcon,
    FillHeartIcon,
} from '~/assets/icons';
import { VscChevronDown } from 'react-icons/vsc';
import classNames from 'classnames/bind';
import styles from './MobileExpandPlayer.module.scss';

const cx = classNames.bind(styles);

function MobileExpandPlayer(props) {
    const {
        expand,
        mute,
        setMute,
        volume,
        setVolume,
        volumeRef,
        bgColor,
        isSavedTrack,
        setIsSavedTrack,
        collapse,
        albumId,
        albumName = '',
        img = '',
        trackName = '',
        trackId,
        artists = [],
        onClick,
    } = props;

    const {
        savedTracks,
        setSavedTracks,
        handleRemoveData,
        handleSaveItemToList,
        nowPlayingId,
    } = useContext(AppContext);

    if (volumeRef?.current) {
        volumeRef.current.style.setProperty('--range-progress', `${volume}%`);
    }

    return (
        <div className={cx('wrapper')}
            style={{
                background: `linear-gradient(${bgColor} 0, var(--backgroundColorShade, transparent) 100%), ${bgColor}`,
                visibility: expand ? 'visible' : 'hidden',
                opacity: expand ? '1' : '0',
            }}
        >
            <header className={cx('header')}>
                <span className={cx('close-icon')}
                    onClick={() => collapse(false)}
                >
                    <VscChevronDown />
                </span>
                <Link className={cx('album-title')} to={`/album/${albumId}`}>
                    {albumName}
                </Link>
                <span
                    className={cx('dots-icon')}
                    onClick={(e) => {
                        if(e && e.stopPropagation) e.stopPropagation(); 
                        e.preventDefault();
                        onClick && onClick();
                    }}
                >
                    <DotsIcon />
                </span>
            </header>

            <div className={cx('info')}>
                <div className={cx('wrapper-img')}>
                    {img ? (
                        <img
                            src={img}
                            alt={`Image of ${trackName}`}
                            className={cx('intro-img')}
                        />
                    ) : (
                        <div className={cx('intro-img')}>
                            <AlbumFallbackIcon />
                        </div>
                    )}
                </div>
                <div 
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div className={cx('track-description')}>
                        <Link className={cx('track-name')} to={`/track/${trackId}`}>
                            {trackName}
                        </Link>
                        <div className={cx('track-artists')}>
                            {artists.map((artist, index) => (
                                <div
                                    key={artist.id}
                                    style={{
                                        marginRight: '2px',
                                    }}
                                    className={cx('wrapper-track-artist')}
                                >
                                    <Link className={cx('track-artist')} to={`/artist/${artist.id}`}>
                                        {artist.name}
                                    </Link>
                                    {index !== artists.length - 1 && ', '}
                                </div>
                            ))}
                        </div>
                    </div>
                    <span
                        className={cx('save-btn', isSavedTrack && 'active')}
                        onClick={() => {
                            if (isSavedTrack) {
                                handleRemoveData(savedTracks, null, setSavedTracks, nowPlayingId.toString());
                                setIsSavedTrack(false);
                            } else {
                                const date = new Date();
                                handleSaveItemToList(savedTracks, nowPlayingId.toString(), date, setSavedTracks);
                                setIsSavedTrack(true);
                            }
                        }}
                    >
                        {!isSavedTrack ? <HeartIcon /> : <FillHeartIcon />}
                    </span>
                </div>
            </div>

            <div className={cx('wrapper-progress-bar')} />

            <div className={cx('wrapper-player-control')} />

            <div className={cx('volume-wrapper')}>
                <span className={cx('volume-icon')} onClick={() => setMute(!mute)}>
                    {mute ? <VolumeMuteIcon /> : <VolumeIcon />}
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
    )
}

export default MobileExpandPlayer;
