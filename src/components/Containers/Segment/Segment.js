import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams } from 'react-router-dom';
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
        columnHeader = false,
        colHeaderIndex = false,
        colHeaderTitle = false,
        colHeaderAlbum = false,
        colHeaderDate = false,
        colHeaderDuration = false,
        children,
        className,
        onClick,
        ...passProps
    } = props;

    const { columnCount, setColumnCount, widthNavbar, showPlayingView, contextMenu, userData, containerWidth, yPosScroll, savedTracks, myPlaylistsData, bgHeaderColor, pickTextColorBasedOnBgColorAdvanced} = useContext(AppContext);

    const containerRef = useRef(null);
    const colHeaderRef = useRef(null);

    const [displayHeaderSongOnTop, setDisplayHeaderSongOnTop] = useState(false);

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
        }
    }, [containerWidth]);

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
                    colHeaderRef.current.style.gridTemplateColumns = '[index] 16px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(120px,1fr)';
                } else if (containerWidth > 535) {
                    colHeaderRef.current.style.gridTemplateColumns = '[index] 16px [first] 4fr [var1] 2fr [last] minmax(120px,1fr)';
                } else {
                    colHeaderRef.current.style.gridTemplateColumns = '[index] 16px [first] 4fr [last] minmax(120px,1fr)';
                }
            } 
            if (!isPlaylist && !searchAll) {
                if (containerWidth > 535) {
                    colHeaderRef.current.style.gridTemplateColumns = '[index] 16px [first] 4fr [var1] 2fr [last] minmax(120px,1fr)';
                } else {
                    colHeaderRef.current.style.gridTemplateColumns = '[index] 16px [first] 4fr [last] minmax(120px,1fr)';
                }

                if (!colHeaderAlbum) {
                    colHeaderRef.current.style.gridTemplateColumns = '[index] 16px [first] 4fr [last] minmax(120px,1fr)';
                }
            }
            if (searchAll) {
                colHeaderRef.current.style.gridTemplateColumns = '[first] 4fr [last] minmax(120px,1fr)';
            }
        }
    }, [colHeaderRef.current, containerWidth]);

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

    if (normal) {
        const templateData = (item) => {
            let toId, title, type, img, subTitle, releaseDate, subMenu, artistData;

            toId = item.id;
            title = item.name;
            
            if (item.images) {
                img = item.images.length > 0 ? item.images[0].url : false;
                type = item.type;
                subMenu = contextMenu[item.type];

                switch (item.type) {
                    case 'playlist':
                        subTitle = !item.description ? `By ${item.owner.display_name}` : item.description;
                        break;
                    case 'artist':
                        subTitle = item.type;
                        break;
                    case 'album':
                        subTitle = item.album_type;
                        artistData = item.artists;
                        releaseDate = item.release_date;
                        
                        break; 

                }
            } else if (item.album) {
                img = item.album.images.length > 0 ? item.album.images[0].url : false;
                subTitle= item.album.album_type;
                releaseDate= item.album.release_date;
                artistData = item.artists;
                subMenu = contextMenu['track'];
                type = 'track';
            } else if (item.track?.album) {
                img = item.track.album.images.length > 0 ? item.track.album.images[0].url : false;
                subTitle= item.track.album.album_type;
                releaseDate= item.track.album.release_date;
                artistData = item.track.artists;
                subMenu = contextMenu['track'];
                type = 'track';
            } else if (Object.keys(item).length > 0) {
                img = item.img?.name ? URL.createObjectURL(item.img) : (item.fallbackImage ? item.fallbackImage : false);
                subTitle= !item.description ? `By ${userData?.display_name}` : item.description;
                type='playlist';
                subMenu= contextMenu['my-playlist'];
            }

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
                dateRelease = savedTracks[index]['date_added'];
            }

            if (isMyPlaylist) {
                dateRelease = myPlaylistsData[params.number - 1].tracks[index]['date_added']
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
                    colHeaderIndex={colHeaderIndex}
                    colHeaderTitle={colHeaderTitle}
                    colHeaderAlbum={colHeaderAlbum}
                    colHeaderDate={colHeaderDate}
                    colHeaderDuration={colHeaderDuration}
                />
            )

        };

        return (
            <section className={cx('container', 'songs')} ref={containerRef}>
                {headerTitle && <header className={cx('header', 'songs')}
                    style={{ padding: `0 clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px)` }}
                >
                    {showAll ? (
                        <>
                            <div className={cx('header-title')}>
                                <ButtonPrimary dark underline large to={type}>
                                    {headerTitle}
                                </ButtonPrimary>
                                {currentUser && <span className={cx('sub-header-title')}>
                                    Only visible to you
                                </span>}
                            </div>
                            <ButtonPrimary dark underline small to={type}>
                                Show all
                            </ButtonPrimary>
                        </>
                    ) : (
                        <div className={cx('header-title')}
                            style={{
                                paddingTop: searchAll ? '13px' : '24px',
                                marginBottom: searchAll ? '4px' : '0',
                            }}
                        >
                            <span>{headerTitle}</span>
                            {currentUser && <span className={cx('sub-header-title')}>
                                Only visible to you
                            </span>}
                        </div>
                    )}
                </header>}
                {columnHeader && (<>
                    <div 
                        className={cx('songs-content-header', songCol4 && 'songs-search')}
                        style={{
                            width: `${containerWidth}px`,
                            padding: `0 clamp(32px,32px + (${containerWidth} - 600)/424 * 8px, 40px)`,
                            color: pickTextColorBasedOnBgColorAdvanced(bgHeaderColor, '#FFFFFF', '#000000'),
                        }}
                        ref={colHeaderRef}
                    >
                        {colHeaderIndex && <span className={cx('index')}>#</span>}
                        {colHeaderTitle && <span className={cx('first')}>Title</span>}
                        {colHeaderAlbum && containerWidth > 535 && <span className={cx('var1')}>Album</span>}
                        {colHeaderDate && containerWidth > 766 && <span className={cx('var2')}>Date added</span>}
                        {colHeaderDuration && <span className={cx('last')}
                            style={{color: pickTextColorBasedOnBgColorAdvanced(bgHeaderColor, '#FFFFFF', '#000000'),}}
                        >
                            <ClockIcon />
                        </span>}
                    </div> 
                    {displayHeaderSongOnTop && <div 
                        className={cx('songs-content-header', songCol4 && 'songs-search', 'on-top')}
                        style={{
                            width: `${containerWidth}px`,
                            padding: `0 clamp(32px,32px + (${containerWidth} - 600)/424 * 8px, 40px)`,
                            color: pickTextColorBasedOnBgColorAdvanced(bgHeaderColor, '#FFFFFF', '#000000'),
                        }}
                    >
                        {colHeaderIndex && <span className={cx('index')}>#</span>}
                        {colHeaderTitle && <span className={cx('first')}>Title</span>}
                        {colHeaderAlbum && containerWidth > 535 && <span className={cx('var1')}>Album</span>}
                        {colHeaderDate && containerWidth > 766 && <span className={cx('var2')}>Date added</span>}
                        {colHeaderDuration && <span className={cx('last')}
                            style={{color: pickTextColorBasedOnBgColorAdvanced(bgHeaderColor, '#FFFFFF', '#000000'),}}
                        >
                            <ClockIcon />
                        </span>}
                    </div> }
                </>)}
                <div className={cx('content', 'songs')}
                    style={{ padding: `18px clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px) 44px` }}
                >
                    {data && data.map((item, index) => templateSongsData(item, index))}
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
                result.type = 'song'
            } else {
                result.images = data.images;
            }
            
            if (data.type === 'track' || data.type === 'album') {
                result.subtitle = displayName(data.artists);
            }

            if (data.type === 'playlist') {
                result.subtitle = <Link 
                    className={cx('song-artist')}
                    to={`/user/${data.owner.id}`}
                >
                    {data.owner.display_name}
                </Link>
            }

            return result;
        };

        const dataResult = dataForm(data);

        return (
            <section className={cx('wrapper', 'top-result')}
                style={{
                    padding: `13px clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px) 27px`,
                }}
            >
                <header className={cx('header')}>{headerTitle}</header>

                <div className={cx('container', 'top-result')} ref={containerRef} >
                    <CardItem topResult 
                        title={dataResult.name} 
                        img={dataResult.images.length > 0 
                            ? dataResult.images[0].url
                            : false} 
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
