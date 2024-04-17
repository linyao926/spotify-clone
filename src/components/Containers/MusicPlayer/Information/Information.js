import { useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
    HeartIcon,
    FillHeartIcon,
    PlayIcon,
    PauseIcon,
    AlbumFallbackIcon,
} from '~/assets/icons';
import classNames from 'classnames/bind';
import styles from '~/components/Containers/MusicPlayer/MusicPlayer.module.scss';

const cx = classNames.bind(styles);

function Information (props) {
    const {
        trackData, 
        setIsSavedTrack, 
        isSavedTrack, 
        smallerWidth, 
        setPlaying, 
        playing, 
        onClick
    } = props;

    const {
        nowPlayingId,
        savedTracks,
        setSavedTracks,
        handleRemoveData,
        handleSaveItemToList,
    } = useContext(AppContext);

    const navigate = useNavigate();
    
    return (
        <div className={cx('intro')}>
            {trackData ? (
                <>
                    {trackData?.album && trackData?.album.images.length > 0 ? (
                        <img
                            src={trackData.album.images[0].url}
                            alt={`Image of ${trackData.name}`}
                            className={cx('intro-img')}
                        />
                    ) : (
                        <div className={cx('intro-img')}>
                            <AlbumFallbackIcon />
                        </div>
                    )}
                    <div className={cx('track-description')}>
                        <div className={cx('track-credits')}>
                            <div 
                                onClick={(e) => {
                                    onClick && onClick(e)
                                    navigate(`/track/${trackData?.id}`)
                                }} 
                                className={cx('track-name')} 
                            >
                                {trackData?.name}
                            </div>
                            <span>-</span>
                            <div 
                                onClick={(e) => {
                                    onClick && onClick(e)
                                    navigate(`/album/${trackData?.album.id}`)
                                }} 
                                className={cx('track-album')} 
                            >
                                {trackData?.album.name}
                            </div>
                        </div>
                        <div className={cx('track-artists')}>
                            {trackData.artists.map((artist, index) => (
                                <div
                                    key={artist.id}
                                    style={{
                                        marginRight: '2px',
                                    }}
                                    className={cx('wrapper-track-artist')}
                                >
                                    <div 
                                        onClick={(e) => {
                                            onClick && onClick(e)
                                            navigate(`/artist/${artist.id}`)
                                        }} 
                                        className={cx('track-artist')} 
                                    >
                                        {artist.name}
                                    </div>
                                    {index !== trackData.artists.length - 1 && ', '}
                                </div>
                            ))}
                        </div>
                    </div>
                    {smallerWidth ? (
                        <div className={cx('buttons')}>
                            <span
                                className={cx('save-btn', 'tooltip', 'svg-icon', isSavedTrack && 'active')}
                                onClick={(e) => {
                                    onClick && onClick(e)
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
                            <span 
                                className={cx('play-btn', 'play-btn-mobile-layout')}  
                                onClick={(e) => {
                                    onClick && onClick(e)
                                    setPlaying(!playing)
                                }}
                            >
                                {!trackData ? <PauseIcon /> : playing ? <PauseIcon /> : <PlayIcon />}
                            </span>  
                        </div>
                    ) : (
                        <span
                            className={cx('save-btn', 'tooltip', 'svg-icon', isSavedTrack && 'active')}
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
                            {!isSavedTrack ? (
                                <span className={cx('tooltiptext')}>Save to Your Library</span>
                            ) : (
                                <span className={cx('tooltiptext')}>Remove from Your Library</span>
                            )}
                        </span>
                    )}
                </>
            ) : null}
        </div>
    );
}

export default Information