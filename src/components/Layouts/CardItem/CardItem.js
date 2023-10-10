import { extractColors } from 'extract-colors';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { Link, useNavigate } from 'react-router-dom';
import SubMenu from '~/components/Layouts/SubMenu';
import Button from '~/components/Button';
import { PauseIcon, PlayIcon } from '~/assets/icons';
import { BsDeviceHdd } from 'react-icons/bs';
import { CloseIcon, ArtistIcon, CardImgFallbackIcon } from '~/assets/icons/icons';
import classNames from 'classnames/bind';
import styles from './CardItem.module.scss';

const cx = classNames.bind(styles);

function CardItem({
    isTrack = false,
    toId,
    type,
    kind,
    album,
    isPlaylist,
    isMyPlaylist,
    topResult,
    hasRemove,
    rounded,
    title,
    img,
    subTitle,
    releaseDate,
    artistData,
    subMenu,
    large,
    children,
    className,
    onClick,
    ...passProps
}) {
    const { ref, isComponentVisible, setIsComponentVisible, points, setPoints } = useContextMenu();
    const {nowPlayingPanel, widthNavbar, showPlayingView, setShowPlayingView, setNowPlayingId, setNextQueueId, nextFromId, setNextFromId, contextMenu,  setMusicList, setWaitingMusicList, setCurrentPlayingIndex, playing, setPlaying, itemIsPlaying, setItemIsPlaying} = useContext(AppContext);

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
        setMusicList(null);
        setWaitingMusicList(null);
        setCurrentPlayingIndex(0);

        if (isTrack) {
            setNextFromId({
                id: toId,
                type: 'track',
                title: title,
            });
        } else if (album) {
            setNextFromId({
                id: toId,
                type: 'album',
                title: title,
            });
        } else if (rounded) {
            setNextFromId({
                id: toId,
                type: 'artist',
                title: title,
            });
        } else if (isPlaylist) {
            setNextFromId({
                id: toId,
                type: 'playlist',
                title: title,
            });
        }

        if (nextFromId?.id === toId) {
            setPlaying(!playing);
        } else {
            setPlaying(true);
        }

        if (nowPlayingPanel && isTrack) {
            if (window.innerWidth - (widthNavbar + 320 + 8 * 24) < 372) {
                setShowPlayingView(false);
            } else {
                setShowPlayingView(true);
            }
        }
    };

    // const date = new Date(releaseDate)
    // const formattedDate = date.toLocaleDateString("en-GB", {
    //     day: "numeric",
    //     month: "long",
    //     year: "numeric"
    // });

    // console.log(releaseDate)

    // console.log(rect.top)

    const handleCloseSubMenu = () => {
        setIsComponentVisible(false);
    };

    const styles = {
        textTransform: {
            textTransform: (isTrack || rounded || album) && 'capitalize',
        }
    };

    const artistNamesMenu = (artists) => artists.map((artist) => ({
        title: artist.name,
        to: `/artist/${artist.id}`
    }));

    // console.log(artistNamesMenu(artistData))

    if (kind) {
        return (
            <Link ref={categoryRef} to={`/genre/${toId}`} className={cx('kind-card')}>
                <span className={cx('kind-title')}>{title}</span>
                <img src={img} alt={title} className={cx('kind-img', rounded && 'rounded')} />
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
                onClick={() => navigate(`/playlist/${toId}`)}
                ref={ref}
            >
                <img src={img} alt={title} className={cx('img', 'top-result')} />
                <div className={cx('description', 'top-result')}>
                    <h4>
                        <b>{title}</b>
                    </h4>
                    <div className={cx('sub-title')}>
                        <p>{subTitle}</p>
                        <Button smaller>Playlists</Button>
                    </div>
                </div>
                <div className={cx('wrapper-btn', 'top-result', nextFromId?.id === toId && (playing && 'active'))}
                    onClick={(e) => {
                        handleClickPlayTrack(e);
                        
                    }}
                >
                    <Button primary rounded large className={cx('play-btn')}>
                        {(nextFromId?.id === toId && playing) ? <PauseIcon /> : <PlayIcon />}
                    </Button>
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
                    <Button icon className={cx('remove-btn')}>
                        <CloseIcon />
                    </Button>
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
                        <img src={img} alt={`Image of ${title}`} className={cx('img', rounded && 'rounded')} />
                    ) : (
                        <div className={cx('img', rounded && 'rounded')}>
                            {!rounded ? <CardImgFallbackIcon /> : <ArtistIcon />}
                        </div>
                    )}

                    <div className={cx('wrapper-btn', nextFromId?.id === toId && (playing && 'active'))}
                        onClick={(e) => {
                            handleClickPlayTrack(e);
                        }}
                    >
                        <Button primary rounded large className={cx('play-btn')}>
                            {(nextFromId?.id === toId && playing) ? <PauseIcon /> : <PlayIcon />}
                        </Button>
                    </div>
                </div>
                <div className={cx('description')}>
                    <h4>
                        <b>{title}</b>
                    </h4>
                    <p
                        style={styles.textTransform}
                    >
                        {(album || isTrack) && `${year} • `}
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
                        isTrack={isTrack}
                        isAlbum={album}
                        isPlaylist={!isTrack && !album && !rounded && !kind}
                        queueId={toId}
                        toId={toId}
                        onClick={handleCloseSubMenu}
                        artistSubmenu={artistData && artistData.length > 1 && artistNamesMenu(artistData)}
                    />
                )}
                {hasRemove && (
                    <Button icon className={cx('remove-btn')}>
                        <CloseIcon />
                    </Button>
                )}
            </div>
        );
    }
}

export default CardItem;
