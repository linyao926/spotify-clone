import { extractColors } from 'extract-colors';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { PauseIcon, PlayIcon } from '~/assets/icons';
import { CloseIcon, ArtistIcon, CardImgFallbackIcon, TickIcon } from '~/assets/icons/icons';
import SubMenu from '../SubMenu';
import ButtonPrimary from '../Buttons/ButtonPrimary';
import classNames from 'classnames/bind';
import styles from './CardItem.module.scss';

const cx = classNames.bind(styles);

function CardItem(props) {
    const {
        toId,
        toAlbumId,
        toArtistId,
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
        playlistFollowers,
        isMyPlaylist = false,
        notSwip = false,
        isSwiping = false,
    } = props;

    const { ref, isComponentVisible, setIsComponentVisible, points, setPoints } = useContextMenu();

    const {
        nowPlayingPanel,
        widthNavbar,
        setShowPlayingView,
        setNowPlayingId,
        setNextQueueId,
        nextFromId,
        setNextFromId,
        setWaitingMusicList,
        setCurrentPlayingIndex,
        playing,
        setPlaying,
        smallerWidth,
        libraryItemPlayedList,
        setLibraryItemPlayedList,
        savedTracks,
        collapse,
        setCollapse,
    } = useContext(AppContext);

    const navigate = useNavigate();

    const [bgItemColor, setBgItemColor] = useState(null);
    const [colors, setColors] = useState(null);

    const categoryRef = useRef(null);

    const date = new Date(releaseDate);
    const year = date.getFullYear();

    useEffect(() => {
        if (kind && img) {
            extractColors(img, { crossOrigin: 'Anonymous' }).then(setColors).catch(console.error);
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
        };
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

        const date = new Date();
        let temp;

        if (nextFromId?.id === toId) {
            setPlaying(!playing);
        } else {
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
                    temp = { ...libraryItemPlayedList };
                    temp[type].filter((item, index) => {
                        if (item.id === toId) {
                            temp[type][index].played = date;
                        } else return;
                    });
                    setLibraryItemPlayedList(temp);
                    break;
                case 'artist':
                    setNextFromId({
                        id: toId,
                        type: 'artist',
                        title: title,
                    });
                    temp = { ...libraryItemPlayedList };
                    temp[type].filter((item, index) => {
                        if (item.id === toId) {
                            temp[type][index].played = date;
                        } else return;
                    });
                    setLibraryItemPlayedList(temp);
                    break;
                case 'playlist':
                    setNextFromId({
                        id: toId,
                        type: 'playlist',
                        title: title,
                    });
                    temp = { ...libraryItemPlayedList };
                    temp[type].filter((item, index) => {
                        if (item.id === toId) {
                            temp[type][index].played = date;
                        } else return;
                    });
                    setLibraryItemPlayedList(temp);
                    break;
                case 'myPlaylist':
                    temp = { ...libraryItemPlayedList };
                    temp['myPlaylist'].filter((item, index) => {
                        if (item.id === toId) {
                            temp['myPlaylist'][index].played = date;
                        } else return;
                    });
                    setLibraryItemPlayedList(temp);
                    setNextFromId({
                        id: toId,
                        type: 'myPlaylist',
                        title: title,
                    });
            }
            setPlaying(true);
            if (nowPlayingPanel) {
                if (collapse) {
                    if (window.innerWidth - (widthNavbar + 280 + 8 * 4) >= 416) {
                        setShowPlayingView(true);
                    }
                } else {
                    if (window.innerWidth - (72 + 280 + 8 * 4) >= 416) {
                        setShowPlayingView(true);
                        setCollapse(true);
                    }
                }
            }
        }
    };

    const handleCloseSubMenu = () => setIsComponentVisible(false);

    const styles = {
        textTransform: {
            textTransform: type !== 'playlist' && 'capitalize',
        },
    };

    const artistNamesMenu = (artists) =>
        artists.map((artist) => ({
            title: artist.name,
            to: `/artist/${artist.id}`,
        }));

    const checkInLibrary = (id, type) => {
        let result = false;
        if (type === 'album' || type === 'playlist' || type === 'artist') {
            libraryItemPlayedList[type].filter((item) => {
                if (item.id === id) {
                    result = true;
                }
                return;
            });
        } else if (type === 'track') {
            savedTracks.filter((item) => {
                if (item.id === id) {
                    result = true;
                }
                return;
            });
        }
        return result;
    };

    if (kind) {
        return (
            <Link ref={categoryRef} to={`/genre/${toId}`} className={cx('kind-card')}>
                <span className={cx('kind-title')}>{title}</span>
                <img loading="lazy" src={img} alt={title} className={cx('kind-img', type === 'artist' && 'rounded')} />
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
                onClick={() => {
                    if (isSwiping) {
                        return;
                    } else {
                        navigate(`/${type}/${toId}`);
                    }
                }}
                ref={ref}
            >
                <img
                    loading="lazy"
                    src={img}
                    alt={title}
                    className={cx('img', 'top-result', topResultType === 'artist' && 'rounded')}
                />
                <div className={cx('description', 'top-result')}>
                    <h4>
                        <b>{title}</b>
                    </h4>
                    <span className={cx('sub-title')}>
                        <p>{`${topResultType}${topResultType !== 'artist' ? ' • ' : ''}`}</p>
                        {subTitle ? <span>{subTitle}</span> : ''}
                    </span>
                </div>
                <div
                    className={cx('wrapper-btn', 'top-result', nextFromId?.id === toId && playing && 'active')}
                    onClick={(e) => {
                        handleClickPlayTrack(e);
                    }}
                >
                    <ButtonPrimary primary rounded large className={cx('play-btn')}>
                        {nextFromId?.id === toId && playing ? <PauseIcon /> : <PlayIcon />}
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
                        queueId={toId}
                        toId={toId}
                        handleCloseSubMenu={handleCloseSubMenu}
                        artistSubmenu={artistData && artistData.length > 1 && artistNamesMenu(artistData)}
                        isTrack={type === 'track'}
                        isAlbum={type === 'album'}
                        isPlaylist={type === 'playlist'}
                        isRemove={checkInLibrary(toId, type)}
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
        return !smallerWidth ? (
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
                onClick={() => navigate(`/${isMyPlaylist ? 'my-playlist' : type}/${toId}`)}
                ref={ref}
            >
                <div className={cx('wrapper-img')}>
                    {img ? (
                        <img
                            loading="lazy"
                            src={img}
                            alt={`Image of ${title}`}
                            className={cx('img', type === 'artist' && 'rounded')}
                        />
                    ) : (
                        <div className={cx('img', type === 'artist' && 'rounded')}>
                            {!(type === 'artist') ? <CardImgFallbackIcon /> : <ArtistIcon />}
                        </div>
                    )}

                    <div
                        className={cx('wrapper-btn', 'normal', nextFromId?.id === toId && playing && 'active')}
                        onClick={(e) => {
                            handleClickPlayTrack(e);
                        }}
                    >
                        <ButtonPrimary primary rounded large className={cx('play-btn')}>
                            {nextFromId?.id === toId && playing ? <PauseIcon /> : <PlayIcon />}
                        </ButtonPrimary>
                    </div>
                </div>
                <div className={cx('description')}>
                    <h4>
                        <b>{title}</b>
                    </h4>
                    <p style={styles.textTransform}>
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
                        handleCloseSubMenu={handleCloseSubMenu}
                        artistSubmenu={artistData && artistData.length > 1 && artistNamesMenu(artistData)}
                        toAlbumId={toAlbumId}
                        toArtistId={toArtistId}
                        isMyPlaylist={isMyPlaylist}
                        isRemove={checkInLibrary(toId, type)}
                    />
                )}
                {hasRemove && (
                    <ButtonPrimary icon className={cx('remove-btn')}>
                        <CloseIcon />
                    </ButtonPrimary>
                )}
            </div>
        ) : (
            <div
                className={cx('card')}
                onClick={() => navigate(`/${isMyPlaylist ? 'my-playlist' : type}/${toId}`)}
                ref={ref}
                style={{
                    width: notSwip ? '100%' : 'none',
                }}
            >
                <div className={cx('wrapper-img')}>
                    {img ? (
                        <img
                            loading="lazy"
                            src={img}
                            alt={`Image of ${title}`}
                            className={cx('img', type === 'artist' && 'rounded')}
                        />
                    ) : (
                        <div className={cx('img', type === 'artist' && 'rounded')}>
                            {!(type === 'artist') ? <CardImgFallbackIcon /> : <ArtistIcon />}
                        </div>
                    )}
                </div>
                <div className={cx('description')}>
                    <h4>
                        <b>{title}</b>
                    </h4>
                    {playlistFollowers && <span>{`${Intl.NumberFormat().format(playlistFollowers)} followers`}</span>}
                </div>
            </div>
        );
    }
}

export default CardItem;
