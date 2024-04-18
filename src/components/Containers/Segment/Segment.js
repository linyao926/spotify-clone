import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { useWindowSize } from 'react-use';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode } from 'swiper/modules';

import { ClockIcon } from '~/assets/icons';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import CardItem from '~/components/Blocks/CardItem';
import TrackItem from '~/components/Blocks/TrackItem';
import classNames from 'classnames/bind';
import styles from './Segment.module.scss';

const cx = classNames.bind(styles);

function Segment(props) {
    const {
        data,
        headerTitle,
        subHeaderTitle,
        toAll,
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
        songCol4 = false,
        showAll = false,
        currentUser = false,
        likedTracks = false,
        isMyPlaylist = false,
        columnHeader = false,
        colHeaderIndex = false,
        colHeaderTitle = false,
        colHeaderAlbum = false,
        colHeaderDate = false,
        colHeaderDuration = false,
        inWaitList = false,
        notSwip = false,
        isGenre = false,
        thisMyPlaylistData,
    } = props;

    const {
        columnCount,
        setColumnCount,
        contextMenu,
        userData,
        containerWidth,
        yPosScroll,
        savedTracks,
        bgHeaderColor,
        pickTextColorBasedOnBgColorAdvanced,
        smallerWidth,
    } = useContext(AppContext);

    const { width } = useWindowSize();

    const containerRef = useRef(null);
    const colHeaderRef = useRef(null);

    const [displayHeaderSongOnTop, setDisplayHeaderSongOnTop] = useState(false);
    const [isSwiping, setIsSwiping] = useState(false);

    const params = useParams();

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

            if (smallerWidth) {
                if (width - 24 <= 483) {
                    setColumnCount(2);
                }
                if (width - 24 <= 699 && width - 24 > 483) {
                    setColumnCount(3);
                }
                if (width - 24 <= 768 && width - 24 > 699) {
                    setColumnCount(4);
                }
            }
        }
    }, [containerWidth, width]);

    useEffect(() => {
        if (containerRef.current && containerWidth) {
            containerRef.current.style.setProperty('--column-count', columnCount);
        }
    }, [columnCount, containerWidth]);

    useEffect(() => {
        if (colHeaderRef.current && colHeaderRef.current.getBoundingClientRect().top < 0) {
            setDisplayHeaderSongOnTop(true);
            if (containerRef.current) {
                if (-colHeaderRef.current.getBoundingClientRect().y > containerRef.current.clientHeight - 186) {
                    setDisplayHeaderSongOnTop(false);
                }
            }
        } else {
            setDisplayHeaderSongOnTop(false);
        }
    }, [yPosScroll, containerWidth]);

    useEffect(() => {
        if (colHeaderRef.current) {
            if (isPlaylist && !searchAll) {
                if (containerWidth > 766) {
                    colHeaderRef.current.style.gridTemplateColumns =
                        '[index] 16px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(120px,1fr)';
                } else if (containerWidth > 535) {
                    colHeaderRef.current.style.gridTemplateColumns =
                        '[index] 16px [first] 4fr [var1] 2fr [last] minmax(120px,1fr)';
                } else {
                    colHeaderRef.current.style.gridTemplateColumns =
                        '[index] 16px [first] 4fr [last] minmax(120px,1fr)';
                }
            }
            if (!isPlaylist && !searchAll) {
                if (containerWidth > 535) {
                    colHeaderRef.current.style.gridTemplateColumns =
                        '[index] 16px [first] 4fr [var1] 2fr [last] minmax(120px,1fr)';
                } else {
                    colHeaderRef.current.style.gridTemplateColumns =
                        '[index] 16px [first] 4fr [last] minmax(120px,1fr)';
                }

                if (!colHeaderAlbum) {
                    colHeaderRef.current.style.gridTemplateColumns =
                        '[index] 16px [first] 4fr [last] minmax(120px,1fr)';
                }
            }
            if (searchAll) {
                colHeaderRef.current.style.gridTemplateColumns = '[first] 4fr [last] minmax(120px,1fr)';
            }
        }
    }, [colHeaderRef.current, containerWidth]);

    const displayName = (artistNames) =>
        artistNames.map((artist, index) => (
            <div key={artist.id} className={cx('wrapper-song-artist')}>
                <Link className={cx('song-artist')} to={`/artist/${artist.id}`}>
                    {artist.name}
                </Link>
                {index !== artistNames.length - 1 && ', '}
            </div>
        ));

    if (normal) {
        const templateData = (item) => {
            let toId, title, type, img, subTitle, releaseDate, subMenu, artistData, isMyPlaylist, playlistFollowers, albumId, artistId;

            toId = item.id;
            title = item.name;

            if (item.images) {
                img = item.images.length > 0 ? item.images[0].url : false;
                type = item.type;
                subMenu = contextMenu[item.type];

                switch (item.type) {
                    case 'playlist':
                        subTitle = !item.description ? `By ${item.owner.display_name}` : item.description;
                        if (isGenre) {
                            playlistFollowers = item.followers.total;
                        }
                        break;
                    case 'artist':
                        subTitle = item.type;
                        break;
                    case 'album':
                        subTitle = item.album_type;
                        artistData = item.artists;
                        releaseDate = item.release_date;
                        artistId = artistData.length == 1 ? artistData[0].id : false;
                        break;
                }
            } else if (item.album) {
                img = item.album.images.length > 0 ? item.album.images[0].url : false;
                subTitle = item.album.album_type;
                releaseDate = item.album.release_date;
                artistData = item.artists;
                subMenu = contextMenu['track'];
                type = 'track';
                artistId = artistData.length == 1 ? artistData[0].id : false;
                albumId = item.album.id;
            } else if (item.track?.album) {
                img = item.track.album.images.length > 0 ? item.track.album.images[0].url : false;
                subTitle = item.track.album.album_type;
                releaseDate = item.track.album.release_date;
                artistData = item.track.artists;
                subMenu = contextMenu['track'];
                type = 'track';
                artistId = artistData.length == 1 ? artistData[0].id : false;
                albumId = item.track.album.id;
            } else if (Object.keys(item).length > 0) {
                img = item.img?.name ? URL.createObjectURL(item.img) : item.fallbackImage ? item.fallbackImage : false;
                subTitle = !item.description ? `By ${userData?.display_name}` : item.description;
                type = 'playlist';
                subMenu = contextMenu['my-playlist'];
                isMyPlaylist = true;
            }

            if (smallerWidth && !notSwip) {
                const handleTouchStart = () => {
                    setIsSwiping(true);
                };
                
                const handleTouchEnd = () => {
                    setIsSwiping(false);
                };
                return (
                    <SwiperSlide 
                        key={toId}
                        style={{
                            width: '168px',
                            minHeight: 'max-content',
                            height: 'auto',
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >       
                        <CardItem
                            img={img}
                            title={title}
                            subTitle={subTitle}
                            type={type}
                            toId={toId}
                            subMenu={subMenu}
                            releaseDate={releaseDate && releaseDate}
                            artistData={artistData}
                            isMyPlaylist={isMyPlaylist}
                            isSwiping={isSwiping}
                        />
                    </SwiperSlide>
                )
            } else {
                return (
                    <CardItem
                        key={toId}
                        img={img}
                        title={title}
                        subTitle={subTitle}
                        type={type}
                        toId={toId}
                        subMenu={subMenu}
                        releaseDate={releaseDate && releaseDate}
                        artistData={artistData}
                        isMyPlaylist={isMyPlaylist}
                        notSwip={true}
                        playlistFollowers={isGenre ? playlistFollowers : null}
                        toAlbumId={albumId ? albumId : false}
                        toArtistId={artistId ? artistId : false}
                    />
                )
            }; 
        };

        return (
            <section
                className={cx('wrapper')}
                style={{
                    width: smallerWidth ? '100%' : `${containerWidth}px`,
                    padding: smallerWidth
                        ? '0 12px'
                        : `13px clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px) 27px`,
                }}
            >
                <header className={cx('header')}>
                    {showAll && !smallerWidth ? (
                        <>
                            <ButtonPrimary dark underline large to={type}>
                                {headerTitle}
                            </ButtonPrimary>
                            <ButtonPrimary dark underline small to={toAll ? toAll : type}>
                                {subHeaderTitle ? subHeaderTitle : 'Show all'}
                            </ButtonPrimary>
                        </>
                    ) : (
                        <ButtonPrimary dark underline large style={{ cursor: 'default' }}>
                            {headerTitle}
                        </ButtonPrimary>
                    )}
                </header>

                {smallerWidth ? (!notSwip ? (
                    <Swiper
                        slidesPerView={'auto'}
                        spaceBetween={12}
                        freeMode={true}
                        modules={[FreeMode]}
                        className="mySwiper"
                    >
                        {data && data.map((item) => templateData(item))}
                    </Swiper>
                ) : (
                    <div className={cx('container')} ref={containerRef}>
                        {data && data.map((item) => templateData(item))}
                    </div>
                )) : (
                    <div className={cx('container')} ref={containerRef}
                        style={{
                            gap: `clamp(16px,16px + (${containerWidth} - 600) / 424 * 8px, 24px)`
                        }}
                    >
                        {data && data.map((item) => templateData(item))}
                    </div>
                )}
            </section>
        );
    }

    if (browse) {
        return (
            <section
                className={cx('wrapper')}
                style={{
                    width: smallerWidth ? '100%' : `${containerWidth}px`,
                    padding: smallerWidth
                        ? '0'
                        : `13px clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px) 27px`,
                }}
            >
                <header className={cx('header')}
                    style={{
                        margin: smallerWidth ? '20px 0 32px' : '0 0 22px',
                        fontSize: !smallerWidth ? '2.4rem' : '1.8rem',
                    }}
                >Browse all</header>

                <div className={cx('container', 'kind-cards')} ref={containerRef}
                    style={{
                        gridTemplateColumns: smallerWidth ? '1fr 1fr' : 'repeat(var(--column-count), minmax(0, 1fr))',
                        gap: `clamp(16px,16px + (${containerWidth} - 600) / 424 * 8px, 24px)`
                    }}
                >
                    {data &&
                        data.map((element) => (
                            <CardItem
                                key={element.id}
                                img={element.icons[0].url}
                                title={element.name}
                                kind
                                toId={element.id}
                            />
                        ))
                    }
                </div>
            </section>
        );
    }

    // console.log(data)

    if (songs) {
        const templateSongsData = (item, index) => {
            if (item) {
                let toAlbumId, img, album, dateRelease, col3;
            
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

                if (likedTracks) {
                    if (savedTracks[index]) {
                        dateRelease = savedTracks[index]['date_added'];
                    } else {
                        dateRelease = false;
                    }
                }

                if (isMyPlaylist && thisMyPlaylistData.length > 0) {
                    if (thisMyPlaylistData[index]) {
                        dateRelease = thisMyPlaylistData[index]['date_added'];
                    } else {
                        dateRelease = false;
                    }
                }

                if (!colHeaderDate && !colHeaderAlbum && !searchAll) {
                    col3 = true;
                } else {
                    col3 = false;
                }

                return (
                    <TrackItem
                        col5={!searchAll && isPlaylist}
                        col4={!searchAll && !isPlaylist}
                        col2={searchAll}
                        col3={col3}
                        key={index}
                        img={img}
                        index={!searchAll && index + 1}
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
                        colHeaderIndex={colHeaderIndex}
                        colHeaderTitle={colHeaderTitle}
                        colHeaderAlbum={colHeaderAlbum}
                        colHeaderDate={colHeaderDate}
                        colHeaderDuration={colHeaderDuration}
                        indexOfItem={index}
                    />
                );
            }
        };

        return (
            <section className={cx('container', 'songs')} ref={containerRef}>
                {headerTitle && (
                    <header
                        className={cx('header', 'songs')}
                        style={{
                            padding: smallerWidth
                                ? '0 12px'
                                : `0 clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px)`,
                        }}
                    >
                        {showAll && !smallerWidth ? (
                            <>
                                <div className={cx('header-title')}>
                                    <ButtonPrimary dark underline large to={type}>
                                        {headerTitle}
                                    </ButtonPrimary>
                                    {currentUser && <span className={cx('sub-header-title')}>Only visible to you</span>}
                                </div>
                                <ButtonPrimary dark underline small to={type}>
                                    Show all
                                </ButtonPrimary>
                            </>
                        ) : (
                            <div
                                className={cx('header-title')}
                                style={{
                                    paddingTop: searchAll ? '13px' : '24px',
                                    marginBottom: searchAll ? '4px' : '0',
                                }}
                            >
                                <span>{headerTitle}</span>
                                {currentUser && <span className={cx('sub-header-title')}>Only visible to you</span>}
                            </div>
                        )}
                    </header>
                )}
                {columnHeader && (
                    <>
                        {!smallerWidth && <div
                            className={cx('songs-content-header', songCol4 && 'songs-search')}
                            style={{
                                width: smallerWidth ? '100%' : `${containerWidth}px`,
                                padding: smallerWidth
                                    ? '0 12px'
                                    : `0 clamp(32px,32px + (${containerWidth} - 600)/424 * 8px, 40px)`,
                                color: pickTextColorBasedOnBgColorAdvanced(bgHeaderColor, '#FFFFFF', '#000000'),
                            }}
                            ref={colHeaderRef}
                        >
                            {colHeaderIndex && <span className={cx('index')}>#</span>}
                            {colHeaderTitle && <span className={cx('first')}>Title</span>}
                            {colHeaderAlbum && containerWidth > 535 && <span className={cx('var1')}>Album</span>}
                            {colHeaderDate && containerWidth > 766 && <span className={cx('var2')}>Date added</span>}
                            {colHeaderDuration && (
                                <span
                                    className={cx('last')}
                                    style={{
                                        color: pickTextColorBasedOnBgColorAdvanced(bgHeaderColor, '#FFFFFF', '#000000'),
                                    }}
                                >
                                    <ClockIcon />
                                </span>
                            )}
                        </div>}
                        {displayHeaderSongOnTop && (
                            <div
                                className={cx('songs-content-header', songCol4 && 'songs-search', 'on-top')}
                                style={{
                                    width: smallerWidth ? '100%' : `${containerWidth}px`,
                                    padding: smallerWidth
                                    ? '0 12px 40px'
                                    : `0 clamp(32px,32px + (${containerWidth} - 600)/424 * 8px, 40px)`,
                                    color: pickTextColorBasedOnBgColorAdvanced(bgHeaderColor, '#FFFFFF', '#000000'),
                                }}
                            >
                                {colHeaderIndex && <span className={cx('index')}>#</span>}
                                {colHeaderTitle && <span className={cx('first')}>Title</span>}
                                {colHeaderAlbum && containerWidth > 535 && <span className={cx('var1')}>Album</span>}
                                {colHeaderDate && containerWidth > 766 && (
                                    <span className={cx('var2')}>Date added</span>
                                )}
                                {colHeaderDuration && (
                                    <span
                                        className={cx('last')}
                                        style={{
                                            color: pickTextColorBasedOnBgColorAdvanced(
                                                bgHeaderColor,
                                                '#FFFFFF',
                                                '#000000',
                                            ),
                                        }}
                                    >
                                        <ClockIcon />
                                    </span>
                                )}
                            </div>
                        )}
                    </>
                )}
                <div
                    className={cx('content', 'songs')}
                    style={{ padding: smallerWidth
                        ? '16px 12px 20px'
                        : `18px clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px) 44px` }}
                >
                    {data && data.map((item, index) => {
                        if (item) {
                            return templateSongsData(item, index);
                        } else return;
                    })}
                </div>
            </section>
        );
    }

    if (searchAll) {
        const dataForm = (data) => {
            const result = {};
            result.name = data.name;
            result.type = data.type;
            result.id = data.id;

            if (data.type === 'track') {
                result.images = data.album.images;
                result.type = 'song';
            } else {
                result.images = data.images;
            }

            if (data.type === 'track' || data.type === 'album') {
                result.subtitle = displayName(data.artists);
            }

            if (data.type === 'playlist') {
                result.subtitle = (
                    <Link className={cx('song-artist')} to={`/user/${data.owner.id}`}>
                        {data.owner.display_name}
                    </Link>
                );
            }

            return result;
        };

        const dataResult = dataForm(data);

        return (
            <section
                className={cx('wrapper', 'top-result')}
                style={{
                    padding: smallerWidth
                        ? '0 12px'
                        : `13px clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px) 27px`,
                }}
            >
                <header className={cx('header')}>{headerTitle}</header>

                <div className={cx('container', 'top-result')} ref={containerRef}>
                    <CardItem
                        topResult
                        title={dataResult.name}
                        img={dataResult.images.length > 0 ? dataResult.images[0].url : false}
                        subTitle={dataResult.subtitle && dataResult.subtitle}
                        topResultType={dataResult.type}
                        type={data.type}
                        toId={dataResult.id}
                        subMenu={contextMenu[data.type]}
                    />
                </div>
            </section>
        );
    }
}

export default Segment;
