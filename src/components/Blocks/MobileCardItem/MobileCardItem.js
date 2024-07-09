import { useContext, useEffect, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { useNavigate } from 'react-router-dom';
import {
    ArtistIcon,
    CardImgFallbackIcon,
    DotsIcon,
    TickIcon,
    AddIcon,
    MusicalNoteIcon,
    AlbumFallbackIcon,
    FillHeartIcon,
} from '~/assets/icons/icons';
import MobileContext from '../MobileContext';
import classNames from 'classnames/bind';
import styles from './MobileCardItem.module.scss';

const cx = classNames.bind(styles);

function MobileCardItem(props) {
    const {
        toId,
        albumId,
        type,
        title,
        img,
        artistsData,
        toPlaylistId,
        toArtistId,
        albumIdToList,
        titleForNextFrom,
        isTrack = false,
        isPlaylistPage = false,
        isMyPlaylist = false,
        isClickPlay = false,
        isLikedTracks = false,
        isAlbum = false,
        inQueue = false,
        inWaitList = false,
        index,
    } = props;

    const { ref, isComponentVisible, setIsComponentVisible } = useContextMenu();
    const {
        checkItemLiked,
        savedTracks,
        setSavedTracks,
        handleRemoveData,
        playing,
        setPlaying,
        nowPlayingId,
        setNowPlayingId,
        nextQueueId,
        setNextQueueId,
        nextFromId,
        setNextFromId,
        setWaitingMusicList,
        waitingMusicList,
        currentPlayingIndex,
        setCurrentPlayingIndex,
    } = useContext(AppContext);

    const navigate = useNavigate();

    const [isSavedTrack, setIsSavedTrack] = useState(false);
    const [isNowPlay, setIsNowPlay] = useState(false);
    const [renderSubmenu, setRenderSubmenu] = useState(false);

    useEffect(() => {
        checkItemLiked(savedTracks, toId, setIsSavedTrack);
    }, [savedTracks]);

    useEffect(() => {
        if (nowPlayingId) {
            if (nowPlayingId.id) {
                if (nowPlayingId.id === toId) {
                    setIsNowPlay(true);
                } else {
                    setIsNowPlay(false);
                }
            } else {
                if (nowPlayingId === toId) {
                    setIsNowPlay(true);
                } else {
                    setIsNowPlay(false);
                }
            }
        }
    }, [nowPlayingId, toId, inQueue, inWaitList]);

    const trackSubMenu = [
        {
            title: isSavedTrack ? 'Remove from your Liked Songs' : 'Save to Your Liked Songs',
            'handle-remove-in-liked': isSavedTrack,
            'handle-save': !isSavedTrack,
            lefticon: isSavedTrack ? <TickIcon /> : <AddIcon />,
            active: isSavedTrack,
        },
        {
            lefticon: <MusicalNoteIcon />,
            title: 'Go to track',
            to: `/track/${toId}`,
        },
        {
            title: 'Go to album',
            to: `/album/${albumId}`,
            lefticon: <AlbumFallbackIcon />,
        },
    ];

    const handleClickPlayTrack = (e) => {
        e.preventDefault();

        if (inWaitList) {
            const index = waitingMusicList.indexOf(toId);

            if (index > -1) {
                setNowPlayingId(toId);
                setCurrentPlayingIndex(currentPlayingIndex + index + 1);
            }
        } else if (isAlbum) {
            setNextQueueId(null);
            setNowPlayingId(null);
            setWaitingMusicList(null);
            setCurrentPlayingIndex(index);
            setNextFromId({
                trackId: toId,
                id: albumIdToList,
                type: 'album',
                title: titleForNextFrom,
            });
        } else if (!isMyPlaylist && toPlaylistId) {
            setNextQueueId(null);
            setNowPlayingId(null);
            setWaitingMusicList(null);
            setCurrentPlayingIndex(index);
            setNextFromId({
                trackId: toId,
                id: toPlaylistId,
                type: 'playlist',
                title: titleForNextFrom,
            });
        } else if (toArtistId) {
            setNextQueueId(null);
            setNowPlayingId(null);
            setWaitingMusicList(null);
            setCurrentPlayingIndex(index);
            setNextFromId({
                trackId: toId,
                id: toArtistId,
                type: 'artist',
                title: titleForNextFrom,
            });
        } else if (inQueue) {
            setNowPlayingId(toId);
            const arr = [...nextQueueId];
            arr.splice(0, 1);
            if (arr.length > 0) {
                setNextQueueId(arr);
            } else {
                setNextQueueId([]);
            }
        } else if (isLikedTracks) {
            setNextQueueId(null);
            setNowPlayingId(null);
            setWaitingMusicList(null);
            setCurrentPlayingIndex(index);
            setNextFromId({
                trackId: toId,
                id: '/collection/tracks',
                type: 'likedTracks',
                title: 'Liked Songs',
            });
        }

        if (nextFromId?.id === toId) {
            setPlaying(!playing);
        } else if (nextFromId?.trackId === toId) {
            setPlaying(!playing);
        } else {
            setPlaying(true);
        }
    };

    return (
        <div
            className={cx('card')}
            onClick={(e) => {
                if (e) {
                    if (isClickPlay) {
                        handleClickPlayTrack(e);
                    } else {
                        return navigate(`/${isMyPlaylist ? 'my-playlist' : type}/${toId}`);
                    }
                }
            }}
            ref={ref}
        >
            <div className={cx('info')}>
                <div className={cx('wrapper-img')}>
                    {img ? (
                        <img
                            loading="lazy"
                            src={img}
                            alt={`Image of ${title}`}
                            className={cx('img', type === 'artist' && 'rounded')}
                        />
                    ) : (
                        <div className={cx('img-fallback', type === 'artist' && 'rounded')}>
                            {!(type === 'artist') ? <CardImgFallbackIcon /> : <ArtistIcon />}
                        </div>
                    )}
                </div>
                <div className={cx('description')}>
                    <h3
                        style={{
                            color: isNowPlay && 'var(--color-green)',
                        }}
                    >
                        {title}
                    </h3>
                    {artistsData ? (
                        <span className={cx('sub-title')}>
                            {!isPlaylistPage && `${type === 'track' ? 'song' : type} • `}
                            {artistsData.map((artist, index) => (
                                <div key={artist.id} className={cx('wrapper-song-artist')}>
                                    <span className={cx('song-artist')}>{artist.name}</span>
                                    {index !== artistsData.length - 1 && ' | '}
                                </div>
                            ))}
                        </span>
                    ) : (
                        <span className={cx('sub-title')}>{type === 'track' ? 'song' : type}</span>
                    )}
                </div>
            </div>
            <div style={{ minWidth: '88px' }}>
                {isSavedTrack && (
                    <span
                        className={cx('liked-icon')}
                        onClick={() => {
                            handleRemoveData(savedTracks, null, setSavedTracks, toId);
                            setIsSavedTrack(false);
                        }}
                    >
                        <FillHeartIcon />
                    </span>
                )}
                {isTrack && (
                    <span
                        className={cx('option-icon')}
                        onClick={(e) => {
                            if (e && e.stopPropagation) e.stopPropagation();
                            e.preventDefault();
                            setRenderSubmenu(true);
                        }}
                    >
                        <DotsIcon />
                        <MobileContext
                            items={trackSubMenu}
                            setRenderSubmenu={setRenderSubmenu}
                            img={img ? img : null}
                            fallbackIcon={<MusicalNoteIcon />}
                            myPlaylist={false}
                            title={title}
                            subTitle={'song'}
                            expand={true}
                            renderSubMenu={renderSubmenu}
                        />
                    </span>
                )}
            </div>
        </div>
    );
}

export default MobileCardItem;
