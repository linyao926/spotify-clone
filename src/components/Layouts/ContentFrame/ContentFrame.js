import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { useWindowSize } from 'react-use';
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
    isAlbum,
    isPlaylist,
    isArtist,
    browse,
    searchAll,
    songs,
    existHeader,
    showAll,
    children,
    className,
    onClick,
    ...passProps
}) {
    const { isLogin, searchPage, columnCount, setColumnCount, widthNavbar } = useContext(AppContext);
    const containerRef = useRef(null);
    const { width } = useWindowSize();
    const containerWidth = width - widthNavbar - 24;

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
                            <Button dark underline large to="/">
                                {headerTitle}
                            </Button>
                            <Button dark underline small to="/">
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
                                    subTitle={element.owner.display_name}
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
                                    subTitle={element.artists[0].name}
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
                            <CardItem key={element.id} img={element.icons[0].url} title={element.name} kind />
                        ))}
                </div>
            </section>
        );
    }

    if (songs) {
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
                                    artist={item.artists[0].name}
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
                                    img={item.track.album.images[0].url}
                                    artist={item.track.artists[0].name}
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
                                    img={item.album.images[0].url}
                                    index={index + 1}
                                    title={item.name}
                                    toTrackId={item.id}
                                    // artist={`${item.artists[0].name}`}
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
                                    img={item.album.images[0].url}
                                    artist={item.artists[0].name}
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

                <div className={cx('container', 'top-result')} ref={containerRef}>
                    <CardItem topResult 
                        title={data.name} 
                        img={data.images[0].url} 
                        subTitle={data.owner.display_name} 
                    />
                </div>
            </section>
        );
    }
}

export default ContentFrame;
