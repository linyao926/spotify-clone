import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { useWindowSize } from 'react-use';
import { Link } from 'react-router-dom';
import Button from '~/components/Button';
import CardItem from '../CardItem';
import TrackItem from '../TrackItem';
import { ClockIcon } from '~/assets/icons';
import config from '~/config';
import classNames from 'classnames/bind';
import styles from './ContentFrame.module.scss';

const cx = classNames.bind(styles);

function ContentFrame({
    data,
    headerTitle,
    recentSearches,
    normal,
    browse,
    searchAll,
    songs,
    type,
    toPlaylistId,
    albumIdToList,
    toArtistId,
    titleForNextFrom,
    existHeader,
    isAlbum = false,
    isPlaylist = false,
    isArtist = false,
    isTrack = false,
    songSearch = false,
    songCol4 = false,
    showAll = false,
    myPlaylist = false,
    currentUser = false,
    likedTracks = false,
    isMyPlaylist = false,
    children,
    className,
    onClick,
    ...passProps
}) {
    const { columnCount, setColumnCount, widthNavbar, showPlayingView, contextMenu, userData, containerWidth } = useContext(AppContext);
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            if (containerWidth <= 483) {
                setColumnCount(2);
            }
            if (containerWidth <= 699 && containerWidth > 483) {
                setColumnCount(3);
            }
            if (containerWidth <= 981 && containerWidth > 699) {
                setColumnCount(4);
            }
            if (containerWidth > 981 && containerWidth < 1222) {
                setColumnCount(5);
            }
            if (containerWidth >= 1222) {
                setColumnCount(6);
            }
        }
    }, [containerWidth]);

    useEffect(() => {
        if (containerRef.current && containerWidth) {
            containerRef.current.style.setProperty('--column-count', columnCount);
        }
    }, [columnCount, containerWidth]);

    const displayName = (artistNames) => artistNames.map((artist, index) => (
        <div key={artist.id}
            className={cx('wrapper-song-artist')}
        >
            <Link 
                className={cx('song-artist')}
                to={`/artist/${artist.id}`}
            >
                {artist.name}
            </Link>
            {index !== artistNames.length - 1 && ', '}
        </div>
    ));
    

    // console.log(data)

    if (normal) {
        const templateData = (item) => {
            let toId, title, type, album, playlist, rounded, img, subTitle, releaseDate, subMenu, isTrack, artistData, isMyPlaylist;

            playlist = false;
            album = false;
            rounded = false;
            isTrack = false;

            toId = item.id;
            title = item.name;
            
            if (item.images) {
                img = item.images.length > 0 ? item.images[0].url : false;
                type = item.type;
                subMenu = contextMenu[item.type];

                switch (item.type) {
                    case 'playlist':
                        subTitle = !item.description ? `By ${item.owner.display_name}` : item.description;
                        playlist = true;
                        break;
                    case 'artist':
                        subTitle = item.type;
                        rounded = true;
                        break;
                    case 'album':
                        subTitle = item.album_type;
                        album = true;
                        artistData = item.artists;
                        releaseDate = item.release_date;
                        // console.log(item)
                        break; 

                }
            } else if (item.album) {
                img = item.album.images.length > 0 ? item.album.images[0].url : false;
                isTrack = true;
                subTitle= item.album.album_type;
                releaseDate= item.album.release_date;
                artistData = item.artists;
                subMenu = contextMenu['track'];
                type = 'track';
            } else if (item.track?.album) {
                img = item.track.album.images.length > 0 ? item.track.album.images[0].url : false;
                isTrack = true;
                subTitle= item.track.album.album_type;
                releaseDate= item.track.album.release_date;
                artistData = item.track.artists;
                subMenu = contextMenu['track'];
                type = 'track';
            } else if (Object.keys(item).length > 0) {
                img = item.img ? URL.createObjectURL(item.img) : false;
                subTitle= !item.description ? `By ${userData?.display_name}` : item.description;
                isMyPlaylist = true;
                type='playlist';
                subMenu= contextMenu['my-playlist'];
            }

            return (
                <CardItem
                    key={toId}
                    img={img}
                    title={title}
                    subTitle={subTitle}
                    isPlaylist={playlist}
                    album={album}
                    rounded={rounded}
                    isTrack={isTrack}
                    type={type}
                    toId={toId}
                    subMenu={subMenu}
                    releaseDate={releaseDate && releaseDate}
                    artistData={artistData}
                    isMyPlaylist={isMyPlaylist}
                />
            );
        };

        return (
            <section className={cx('wrapper')}
                style={{
                    width: `${containerWidth}px`,
                    padding: `13px clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px) 27px`,
                }}
            >
                <header className={cx('header')}>
                    {showAll ? (
                        <>
                            <Button dark underline large to={type}>
                                {headerTitle}
                            </Button>
                            <Button dark underline small to={type}>
                                Show all
                            </Button>
                        </>
                    ) : (
                        <Button dark underline large style={{ cursor: 'default' }}>
                            {headerTitle}
                        </Button>
                    )}
                </header>

                <div className={cx('container')} ref={containerRef}>
                    {data && data.map((item) => templateData(item))}
                </div>
            </section>
        );
    }

    if (browse) {
        return (
            <section className={cx('wrapper')}
                style={{
                    width: `${containerWidth}px`,
                    padding: `13px clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px) 27px`,
                }}
            >
                <header className={cx('header')}>Browse all</header>

                <div className={cx('container', 'kind-cards')} ref={containerRef}>
                    {data &&
                        data.map((element) => (
                            <CardItem key={element.id} 
                                img={element.icons[0].url} 
                                title={element.name} 
                                kind 
                                toId={element.id}
                            />
                    ))}
                </div>
            </section>
        );
    }

    if (songs) {
        const templateSongsData = (item, index) => {
            let toAlbumId, img, album, dateRelease;

            let temp;
            if (item?.track) {
                temp = item.track;
            } else {
                temp = item;
            }

            if (!isAlbum) {
                img = temp.album.images.length > 0 ? temp.album.images[0].url : false;
            }

            if (isPlaylist || songCol4) {
                album = temp.album.name;
                toAlbumId = temp.album.id;
            }

            if (isPlaylist) {
                dateRelease = item.album ? item.album.release_date : item.added_at;
            }

            return (
                <TrackItem 
                    col5={isPlaylist}
                    col4={!isPlaylist}
                    col2={searchAll}
                    key={index}
                    img={img}
                    index={!searchAll && (index + 1)}
                    title={temp.name}
                    toTrackId={temp.id}
                    toAlbumId={toAlbumId}
                    album={album}
                    toPlaylistId={isPlaylist ? toPlaylistId : false}
                    albumIdToList={albumIdToList ? albumIdToList : false}
                    toArtistId={toArtistId ? toArtistId : false}
                    artists={displayName(temp.artists)}
                    durationMs={temp.duration_ms}
                    dateRelease={dateRelease}
                    isAlbum={isAlbum}
                    isArtist={isArtist}
                    artistData={temp.artists}
                    isMyPlaylist={isMyPlaylist}
                    isLikedSongs={likedTracks}
                    inSearchAll={searchAll}
                    titleForNextFrom={titleForNextFrom ? titleForNextFrom : false}
                />
            )

        };

        return (
            <section className={cx('container', 'songs')} ref={containerRef}>
                {((songSearch || isPlaylist) || (!isArtist && !searchAll)) && <div className={cx('songs-content-header', songCol4 && 'songs-search')}>
                    <span className={cx('index')}>#</span>
                    <span className={cx('first')}>Title</span>
                    {!isAlbum && <span className={cx('var1')}>Album</span>}
                    {isPlaylist && <span className={cx('var2')}>Date added</span>}
                    <span className={cx('last')}>
                        <ClockIcon />
                    </span>
                </div>}
                {((songCol4 && !songSearch) || isArtist || searchAll ) && <header className={cx('header', 'songs')}>
                    {showAll ? (
                        <>
                            <div className={cx('header-title')}>
                                <Button dark underline large to={type}>
                                    {headerTitle}
                                </Button>
                                {currentUser && <span className={cx('sub-header-title')}>
                                    Only visible to you
                                </span>}
                            </div>
                            <Button dark underline small to={type}>
                                Show all
                            </Button>
                        </>
                    ) : (
                        <div className={cx('header-title')}>
                            <span>{headerTitle}</span>
                            {currentUser && <span className={cx('sub-header-title')}>
                                Only visible to you
                            </span>}
                        </div>
                    )}
                </header>}
                <div className={cx('content', 'songs')}>
                    {data && data.map((item, index) => templateSongsData(item, index))}
                </div>
            </section>
        );
    }

    if (searchAll) {
        return (
            <section className={cx('wrapper', 'top-result')}
                style={{
                    width: `${containerWidth}px`,
                    padding: `13px clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px) 27px`,
                }}
            >
                <header className={cx('header')}>{headerTitle}</header>

                <div className={cx('container', 'top-result')} ref={containerRef} >
                    <CardItem topResult 
                        title={data.name} 
                        img={data.images.length > 0 
                            ? data.images[0].url
                            : false} 
                        subTitle={data.owner.display_name} 
                        toId={data.id}
                        subMenu={contextMenu['playlist']}
                    />
                </div>
            </section>
        );
    }
}

export default ContentFrame;
