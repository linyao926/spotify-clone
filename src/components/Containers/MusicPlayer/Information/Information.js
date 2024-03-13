import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link } from 'react-router-dom';
import {
    ArtistIcon,
    HeartIcon,
    FillHeartIcon,
} from '~/assets/icons';
import classNames from 'classnames/bind';
import styles from '~/components/Containers/MusicPlayer/MusicPlayer.module.scss';

const cx = classNames.bind(styles);

function Information (props) {
    const {trackData, setIsSavedTrack, isSavedTrack, setTrackData} = props;

    const {
        nowPlayingId,
        savedTracks,
        setSavedTracks,
        handleRemoveData,
        handleSaveItemToList,
        spotifyApi,
    } = useContext(AppContext);

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
                    setTrackData(track);
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, [nowPlayingId]);

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
                            <ArtistIcon />
                        </div>
                    )}
                    <div className={cx('track-description')}>
                        <div className={cx('track-credits')}>
                            <Link className={cx('track-name')} to={`/track/${trackData?.id}`}>
                                {trackData?.name}
                            </Link>
                            <span>-</span>
                            <Link className={cx('track-album')} to={`/album/${trackData?.album.id}`}>
                                {trackData?.album.name}
                            </Link>
                        </div>
                        <div className={cx('track-artists')}>
                            {trackData.artists.map((artist, index) => (
                                <div
                                    key={artist.id}
                                    style={{
                                        marginRight: '2px',
                                    }}
                                >
                                    <Link className={cx('track-artist')} to={`/artist/${artist.id}`}>
                                        {artist.name}
                                    </Link>
                                    {index !== trackData.artists.length - 1 && ', '}
                                </div>
                            ))}
                        </div>
                    </div>
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
                </>
            ) : null}
        </div>
    );
}

export default Information