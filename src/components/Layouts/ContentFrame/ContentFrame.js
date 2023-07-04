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
    children,
    className,
    onClick,
    ...passProps
}) {
    const { columnCount, setColumnCount, widthNavbar, showPlayingView } = useContext(AppContext);
    const containerRef = useRef(null);
    const { width } = useWindowSize();
    let containerWidth = showPlayingView ? (width - widthNavbar - 24 - 328) : (width - widthNavbar - 24);

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
        if (containerRef.current) {
            containerRef.current.style.setProperty('--column-count', columnCount);
        }
    }, [columnCount]);

    if (normal) {
        return (
            <section className={cx('wrapper')}>
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
                    {isPlaylist && data && data.map((element) => {
                            return (
                                <CardItem
                                    key={element.id}
                                    img={element.images.length > 0 
                                        ? element.images[0].url
                                        : false}
                                    title={element.name}
                                    subTitle={element.description === '' 
                                        ? `By ${element.owner.display_name}`
                                        : element.description
                                    }
                                    playlist
                                    type='playlist'
                                    toId={element.id}
                                />
                            );
                    })}

                    {isAlbum && data && data.map((element) => {
                            return (
                                <CardItem
                                    key={element.id}
                                    img={element.images.length > 0 
                                        ? element.images[0].url
                                        : false}
                                    title={element.name}
                                    subTitle={element.album_type}
                                    releaseDate={element.release_date}
                                    album
                                    type='album'
                                    toId={element.id}
                                />
                            );
                    })}

                    {isArtist && data && data.map((element) => {
                            return (
                                <CardItem
                                    key={element.id}
                                    img={element.images.length > 0 
                                        ? element.images[0].url
                                        : false}
                                    title={element.name}
                                    subTitle={element.type}
                                    rounded
                                    type='artist'
                                    toId={element.id}
                                />
                            );
                    })}

                    {isTrack && data && data.map((element) => {
                            return (
                                <CardItem
                                    key={element.track.id}
                                    img={element.track.album.images.length > 0 
                                        ? element.track.album.images[0].url
                                        : false}
                                    title={element.track.name}
                                    subTitle={element.track.album.album_type}
                                    releaseDate={element.track.album.release_date}
                                    type='track'
                                    toId={element.track.id}
                                    album
                                />
                            );
                    })} 
                </div>
            </section>
        );
    }

    // if (recentSearches) {
    //     return (
    //         <div className={cx('wrapper')}>
    //             <header className={cx('header')}>
    //                 Recent searches
    //             </header>

    //             <div className={cx('container')}>
    //                 <CardItem hasRemove />
    //             </div>
    //         </div>
    //     )
    // };

    if (browse) {
        return (
            <section className={cx('wrapper')}>
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
        if (songCol4) {
            return (
                <section className={cx('container', 'songs')} ref={containerRef}>
                    {songSearch 
                    ? <div className={cx('songs-content-header', 'songs-search')}>
                        <span className={cx('index')}>#</span>
                        <span className={cx('first')}>Title</span>
                        <span className={cx('var1')}>Album</span>
                        <span className={cx('last')}>
                            <ClockIcon />
                        </span>
                    </div>
                    : <header className={cx('header', 'songs')}>
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
                        {data &&
                            data.map((item, index) => (
                                <TrackItem col4 
                                    key={index}
                                    img={item.album.images.length > 0 
                                        ? item.album.images[0].url
                                        : false}
                                    index={index + 1}
                                    title={item.name}
                                    toTrackId={item.id}
                                    toAlbumId={item.album.id}
                                    album={item.album.name}
                                    artists={item.artists.map((artist, index) => (
                                        <>
                                            <Link key={artist.id}
                                                className={cx('song-artist')}
                                                to={`/artist/${artist.id}`}
                                            >
                                                {artist.name}
                                            </Link>
                                            {index !== item.artists.length - 1 && ', '}
                                        </>
                                    ))}
                                    durationMs={item.duration_ms}
                                    id={item.id}
                                />
                            ))}
                    </div>
                </section>
            );
        }

        if (isAlbum) {
            return (
                <section className={cx('container', 'songs')} ref={containerRef}>
                    {existHeader && <div className={cx('songs-content-header')}>
                        <span className={cx('index')}>#</span>
                        <span className={cx('first')}>Title</span>
                        <span className={cx('last')}>
                            <ClockIcon />
                        </span>
                    </div>}
                    <div className={cx('content', 'songs')}>
                        {data &&
                            data.map((item, index) => (
                                <TrackItem
                                    col4
                                    isAlbum
                                    key={index}
                                    index={index + 1}
                                    title={item.name}
                                    artists={item.artists.map((artist, index) => (
                                        <>
                                            <Link key={artist.id}
                                                className={cx('song-artist')}
                                                to={`/artist/${artist.id}`}
                                            >
                                                {artist.name}
                                            </Link>
                                            {index !== item.artists.length - 1 && ', '}
                                        </>
                                    ))}
                                    durationMs={item.duration_ms}
                                    toTrackId={item.id}
                                    toArtistId={item.artists[0].id}
                                />
                            ))}
                    </div>
                </section>
            );
        }

        if (isPlaylist) {
            return (
                <section className={cx('container', 'songs')} ref={containerRef}>
                    <div className={cx('songs-content-header')}>
                        <span className={cx('index')}>#</span>
                        <span className={cx('first')}>Title</span>
                        <span className={cx('var1')}>Album</span>
                        <span className={cx('var2')}>Date added</span>
                        <span className={cx('last')}>
                            <ClockIcon />
                        </span>
                    </div>
                    <div className={cx('content', 'songs')}>
                        {data &&
                            data.map((item, index) => (
                                <TrackItem
                                    col5
                                    key={index}
                                    index={index + 1}
                                    title={item.track.name}
                                    img={item.track.album.images.length > 0 
                                        ? item.track.album.images[0].url
                                        : false}
                                    artists={item.track.artists.map((artist, index) => (
                                        <>
                                            <Link key={artist.id}
                                                className={cx('song-artist')}
                                                to={`/artist/${artist.id}`}
                                            >
                                                {artist.name}
                                            </Link>
                                            {index !== item.track.artists.length - 1 && ', '}
                                        </>
                                    ))}
                                    album={item.track.album.name}
                                    durationMs={item.track.duration_ms}
                                    dateRelease={item.added_at}
                                    toTrackId={item.track.id}
                                    toAlbumId={item.track.album.id}
                                    toArtistId={item.track.artists[0].id}
                                />
                            ))}
                    </div>
                </section>
            );
        }

        if (isArtist) {
            // console.log(data)
            return (
                <section className={cx('container', 'songs')} ref={containerRef}>
                    <header className={cx('header', 'songs')}>{headerTitle}</header>
                    <div className={cx('content', 'songs')}>
                        {data &&
                            data.map((item, index) => (
                                <TrackItem col4 isArtist
                                    key={index}
                                    img={item.album.images.length > 0 
                                        ? item.album.images[0].url
                                        : false}
                                    index={index + 1}
                                    title={item.name}
                                    toTrackId={item.id}
                                    artists={item.artists.map((artist, index) => (
                                        <>
                                            <Link key={artist.id}
                                                className={cx('song-artist')}
                                                to={`/artist/${artist.id}`}
                                            >
                                                {artist.name}
                                            </Link>
                                            {index !== item.artists.length - 1 && ', '}
                                        </>
                                    ))}
                                    durationMs={item.duration_ms}
                                    id={item.id}
                                />
                            ))}
                    </div>
                </section>
            );
        }

        if (searchAll) {
            return (
                <section className={cx('wrapper', 'songs')}>
                    {headerTitle && <header className={cx('header')}>{headerTitle}</header>}

                    <div className={cx('container', 'songs')} ref={containerRef}>
                        {data &&
                            data.map((item, index) => (
                                <TrackItem
                                    col2
                                    key={index}
                                    title={item.name}
                                    img={item.album.images.length > 0 
                                        ? item.album.images[0].url
                                        : false}
                                    artists={item.artists.map((artist, index) => (
                                        <>
                                            <Link key={artist.id}
                                                className={cx('song-artist')}
                                                to={`/artist/${artist.id}`}
                                            >
                                                {artist.name}
                                            </Link>
                                            {index !== item.artists.length - 1 && ', '}
                                        </>
                                    ))}
                                    durationMs={item.duration_ms}
                                />
                            ))}
                    </div>
                </section>
            );
        }
    }

    if (searchAll) {
        return (
            <section className={cx('wrapper', 'top-result')}>
                <header className={cx('header')}>{headerTitle}</header>

                <div className={cx('container', 'top-result')} ref={containerRef} >
                    <CardItem topResult 
                        title={data.name} 
                        img={data.images.length > 0 
                            ? data.images[0].url
                            : false} 
                        subTitle={data.owner.display_name} 
                        toId={data.id}
                    />
                </div>
            </section>
        );
    }
}

export default ContentFrame;
