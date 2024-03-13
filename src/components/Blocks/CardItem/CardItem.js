import { extractColors } from 'extract-colors';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { PauseIcon, PlayIcon } from '~/assets/icons';
import { CloseIcon, ArtistIcon, CardImgFallbackIcon } from '~/assets/icons/icons';
import SubMenu from '../SubMenu';
import ButtonPrimary from '../Buttons/ButtonPrimary';
import classNames from 'classnames/bind';
import styles from './CardItem.module.scss';

const cx = classNames.bind(styles);

function CardItem(props) {
    const {
        toId,
        type,
        kind,
        topResult,
        topResultType,
        hasRemove,
        title,
        img,
        subTitle,
        releaseDate,
        artistData,
        subMenu,
    } = props;

    const { ref, isComponentVisible, setIsComponentVisible, points, setPoints } = useContextMenu();
    const {nowPlayingPanel, widthNavbar, setShowPlayingView, setNowPlayingId, setNextQueueId, nextFromId, setNextFromId, setWaitingMusicList, setCurrentPlayingIndex, playing, setPlaying, } = useContext(AppContext);

    const navigate = useNavigate();
    
    const [bgItemColor, setBgItemColor] = useState(null);
    const [colors, setColors] = useState(null);

    const categoryRef = useRef(null);

    const date = new Date(releaseDate);
    const year = date.getFullYear();

    useEffect(() => {
        if (kind && img) {
            extractColors(img, {crossOrigin: 'Anonymous'})
            .then(setColors)
            .catch(console.error);
        } else {
          setBgItemColor('rgb(83, 83, 83)');
        }
    }, [kind, img]);

    // console.log(colors);

    useEffect(() => {
        const filterColor = (arr) => {
            let temp = arr[0].intensity;
            let bgColor = arr[0].hex;
            for (let i = 1; i < arr.length; i++) {
                if (arr[i].intensity > temp) {
                    temp = arr[i].intensity;
                    bgColor = arr[i].hex;
                }
            }
            return bgColor;
        }
        if (colors) {
            const color = filterColor(colors);
            setBgItemColor(color);
        }
    }, [colors]);

    useEffect(() => {
        if (categoryRef.current) {
            categoryRef.current.style.setProperty('--background-category', bgItemColor);
        }
    }, [categoryRef.current, bgItemColor]);

    let rect;

    if (ref.current) {
        rect = ref.current.getBoundingClientRect();
    }
 
    const handleClickPlayTrack = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setNextQueueId(null);
        setNowPlayingId(null);
        setWaitingMusicList(null);
        setCurrentPlayingIndex(0);

        switch (type) {
            case 'track': 
                setNextFromId({
                    id: toId,
                    type: 'track',
                    title: title,
                });
                break;
            case 'album': 
                setNextFromId({
                    id: toId,
                    type: 'album',
                    title: title,
                });
                break;
            case 'artist': 
                setNextFromId({
                    id: toId,
                    type: 'artist',
                    title: title,
                });
                break;
            case 'playlist': 
                setNextFromId({
                    id: toId,
                    type: 'playlist',
                    title: title,
                });
                break;
        }

        if (nextFromId?.id === toId) {
            setPlaying(!playing);
        } else {
            setPlaying(true);
        }

        if (nowPlayingPanel && type === 'track') {
            if (window.innerWidth - (widthNavbar + 320 + 8 * 24) < 372) {
                setShowPlayingView(false);
            } else {
                setShowPlayingView(true);
            }
        }
    };

    // console.log(rect.top)

    const handleCloseSubMenu = () => {
        setIsComponentVisible(false);
    };

    const styles = {
        textTransform: {
            textTransform: (type !== 'playlist') && 'capitalize',
        }
    };

    const artistNamesMenu = (artists) => artists.map((artist) => ({
        title: artist.name,
        to: `/artist/${artist.id}`
    }));

    // console.log(artistNamesMenu(artistData))
    // console.log(toId)

    if (kind) {
        return (
            <Link ref={categoryRef} to={`/genre/${toId}`} className={cx('kind-card')}>
                <span className={cx('kind-title')}>{title}</span>
                <img src={img} alt={title} className={cx('kind-img', type === 'artist' && 'rounded')} />
            </Link>
        );
    } else if (topResult) {
        return (
            <div
                className={cx('card', 'top-result')}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setIsComponentVisible(!isComponentVisible);
                    setPoints({
                        x: e.pageX,
                        y: e.pageY,
                    });
                }}
                onClick={() => navigate(`/${type}/${toId}`)}
                ref={ref}
            >
                <img src={img} alt={title} className={cx('img', 'top-result', topResultType === 'artist' && 'rounded')} />
                <div className={cx('description', 'top-result')}>
                    <h4>
                        <b>{title}</b>
                    </h4>
                    <span className={cx('sub-title')}>
                        <p>{`${topResultType}${topResultType !== 'artist' ? ' • ' : ''}`}</p>
                        {subTitle ? <span>{subTitle}</span> : ''}
                    </span>
                </div>
                <div className={cx('wrapper-btn', 'top-result', nextFromId?.id === toId && (playing && 'active'))}
                    onClick={(e) => {
                        handleClickPlayTrack(e);
                    }}
                >
                    <ButtonPrimary primary rounded large className={cx('play-btn')}>
                        {(nextFromId?.id === toId && playing) ? <PauseIcon /> : <PlayIcon />}
                    </ButtonPrimary>
                </div>
                {isComponentVisible && (
                    <SubMenu
                        menu={subMenu}
                        top={points.y - rect.top}
                        left={points.x - rect.left}
                        right={window.innerWidth - points.x}
                        bottom={window.innerHeight - points.y}
                        pointY={points.y}
                        pointX={points.x}
                        isPlaylist
                        queueId={toId}
                        toId={toId}
                        onclick={handleCloseSubMenu}
                        artistSubmenu={artistData && artistData.length > 1 && artistNamesMenu(artistData)}
                    />
                )}
                {hasRemove && (
                    <ButtonPrimary icon className={cx('remove-btn')}>
                        <CloseIcon />
                    </ButtonPrimary>
                )}
            </div>
        );
    } else {
        return (
            <div
                className={cx('card')}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setIsComponentVisible(!isComponentVisible);
                    setPoints({
                        x: e.pageX,
                        y: e.pageY,
                    });
                }}
                onClick={() => navigate(`/${type}/${toId}`)}
                ref={ref}
            >
                <div className={cx('wrapper-img')}>
                    {img ? (
                        <img src={img} alt={`Image of ${title}`} className={cx('img', type === 'artist' && 'rounded')} />
                    ) : (
                        <div className={cx('img', type === 'artist' && 'rounded')}>
                            {!(type === 'artist') ? <CardImgFallbackIcon /> : <ArtistIcon />}
                        </div>
                    )}

                    <div className={cx('wrapper-btn', 'normal',nextFromId?.id === toId && (playing && 'active'))}
                        onClick={(e) => {
                            handleClickPlayTrack(e);
                        }}
                    >
                        <ButtonPrimary primary rounded large className={cx('play-btn')}>
                            {(nextFromId?.id === toId && playing) ? <PauseIcon /> : <PlayIcon />}
                        </ButtonPrimary>
                    </div>
                </div>
                <div className={cx('description')}>
                    <h4>
                        <b>{title}</b>
                    </h4>
                    <p
                        style={styles.textTransform}
                    >
                        {(type === 'album' || type === 'track') && `${year} • `}
                        {subTitle}
                    </p>
                </div>
                {isComponentVisible && (
                    <SubMenu
                        menu={subMenu}
                        top={points.y - rect.top}
                        left={points.x - rect.left}
                        right={window.innerWidth - points.x}
                        bottom={window.innerHeight - points.y}
                        pointY={points.y}
                        pointX={points.x}
                        isTrack={type === 'track'}
                        isAlbum={type === 'album'}
                        isPlaylist={type === 'playlist'}
                        queueId={toId}
                        toId={toId}
                        onClick={handleCloseSubMenu}
                        artistSubmenu={artistData && artistData.length > 1 && artistNamesMenu(artistData)}
                    />
                )}
                {hasRemove && (
                    <ButtonPrimary icon className={cx('remove-btn')}>
                        <CloseIcon />
                    </ButtonPrimary>
                )}
            </div>
        );
    }
}

export default CardItem;
