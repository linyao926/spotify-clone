import { useRef, useState, useEffect, useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link } from 'react-router-dom';
import images from '~/assets/images';
import { PlayIcon, HeartIcon, FillHeartIcon, DotsIcon } from '~/assets/icons';
import classNames from 'classnames/bind';
import styles from './TrackItem.module.scss';

const cx = classNames.bind(styles);

function TrackItem({
    col5,
    col4,
    col3,
    col2,
    isAlbum,
    isArtist,
    index,
    title,
    img,
    artist,
    album,
    durationMs,
    dateRelease,
    children,
    className,
    onClick,
    ...passProps
}) {
    const { msToMinAndSeconds } = useContext(AppContext);
    const ref = useRef(null);
    const date = new Date(dateRelease);
    const year = date.getFullYear();
    const month = date.toLocaleDateString('en-GB', { month: 'short' });
    const day = date.getDate();

    useEffect(() => {
        if (col5) {
            ref.current.style.gridTemplateColumns =
                '[index] 16px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(120px,1fr)';
        }
        if (col4) {
            ref.current.style.gridTemplateColumns = '[index] 16px [first] 4fr [var1] 2fr [last] minmax(120px,1fr)';
        }
        if (col2) {
            ref.current.style.gridTemplateColumns = '[first] 4fr [last] minmax(120px,1fr)';
        }
        if (col3) {
            ref.current.style.gridTemplateColumns = '[index] 16px [first] 4fr [last] minmax(120px,1fr)';
        }
    }, [ref.current]);

    return (
        <div className={cx('wrapper')} ref={ref}>
            {!col2 && (
                <div className={cx('wrapper-index')}>
                    <span className={cx('index')}>{index}</span>
                    <span className={cx('play-icon', 'tooltip')}>
                        <PlayIcon />
                        <span className={cx('tooltiptext')}>Play {title}</span>
                    </span>
                </div>
            )}
            <div className={cx('intro', 'first')}>
                {!isAlbum && (
                    <div className={cx('wrapper-img', col2 && 'opacity-img')}>
                        <img src={img} alt={title} className={cx('img')} />
                        {col2 && (
                            <span className={cx('play-icon', 'tooltip')}>
                                <PlayIcon />
                                <span className={cx('tooltiptext')}>Play {title}</span>
                            </span>
                        )}
                    </div>
                )}
                <div className={cx('title')}>
                    <Link className={cx('song-name')}>{title}</Link>
                    {!isArtist ? <Link className={cx('song-artist')}>{artist}</Link> : null}
                </div>
            </div>
            {!col2 && !isAlbum && <Link className={cx('album-title', 'var1')}>{album}</Link>}
            {col5 && !isAlbum && <span className={cx('date', 'var2')}>{`${month} ${day}, ${year}`}</span>}
            <div className={cx('duration', 'last')}>
                {/* <HeartIcon /> */}
                <span className={cx('interact-icon', 'tooltip')}>
                    <FillHeartIcon />
                    <span className={cx('tooltiptext')}>Remove from Your Library</span>
                </span>
                <span className={cx('duration-text')}>{msToMinAndSeconds(durationMs, true)}</span>
                <span className={cx('interact-icon', 'option-icon', 'tooltip')}>
                    <DotsIcon />
                    <span className={cx('tooltiptext')}>
                        More option for {title} by {artist}
                    </span>
                </span>
            </div>
        </div>
    );
}

export default TrackItem;
