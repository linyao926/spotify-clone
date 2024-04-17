import { useContext, useState, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { MusicalNoteIcon, PersonIcon } from '~/assets/icons';
import PageContentLayout from '~/components/Layouts/PageContentLayout';
import PageContentMobileLayout from '~/components/Layouts/PageContentMobileLayout';
import Segment from '~/components/Containers/Segment';
import MobileCardItem from '~/components/Blocks/MobileCardItem';
import classNames from 'classnames/bind';
import styles from './Track.module.scss';

const cx = classNames.bind(styles);

function Track() {
    const { 
        spotifyApi, 
        setTokenError,
        columnCount, 
        msToMinAndSeconds,
        convertMsToHM, 
        contextMenu,
        containerWidth,
        smallerWidth,
    } = useContext(AppContext);

    const [id, setId] = useState(null);
    const [trackData, setTrackData] = useState(null);
    const [recommendTracks, setRecommendTracks] = useState(null);
    const [artistsData, setArtistsData] = useState(null);
    const [albumData, setAlbumData] = useState(null);
    const [artistAlbums, setArtistAlbums] = useState(null);
    const [topTracksOfArtist, setTopTracksOfArtist] = useState(null);
    const [relatedArtists, setRelatedArtists] = useState(null);
    const [hasData, setHasData] = useState(false);  

    const params = useParams();

    useEffect(() => {
        setId(params.id);
    }, [params]);

    useEffect(() => {
        setHasData(false);
    }, [id]);

    useEffect(() => {
        let isMounted = true;

        if (id) {
            async function loadData () {
                const [track, album, artistDiscography, tracks, related, artists] =  await Promise.all([
                    spotifyApi.getTrack(id)
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    }),

                    spotifyApi.getTrack(id)
                    .then(function (data) {
                        return data.album.id;
                    })
                    .then(function(albumId) {
                        return spotifyApi.getAlbum(albumId);
                    })
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    }),

                    spotifyApi.getTrack(id)
                    .then(function (data) {
                        return data.artists[0].id;
                    })
                    .then(function(id) {
                        return spotifyApi.getArtistAlbums(id, { 
                            include_groups: 'album,single',
                            limit: smallerWidth ? 10 : columnCount,
                        });
                    })
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    }),

                    spotifyApi.getTrack(id)
                    .then(function (data) {
                        return data.artists[0].id;
                    })
                    .then(function(id) {
                        return spotifyApi.getArtistTopTracks(id, 'VN');
                    })
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    }),

                    spotifyApi.getTrack(id)
                    .then(function (data) {
                        return data.artists[0].id;
                    })
                    .then(function(id) {
                        return spotifyApi.getArtistRelatedArtists(id);
                    })
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    }),

                    spotifyApi.getTrack(id)
                    .then(function (data) {
                        return data.artists;
                    })
                    .then(function(artists) {
                        const list = [];
                        artists.map((item) => list.push(item.id));
                        return list;
                    })
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    }),
                ]);

                const artistData = await Promise.all(
                    artists.map((id) => spotifyApi.getArtist(id)
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    }))
                );

                if (isMounted) {
                    setHasData(true);
                    setTrackData(track);
                    setArtistsData(artistData);
                    setAlbumData(album);
                    setArtistAlbums(artistDiscography);
                    setTopTracksOfArtist(tracks);
                    setRelatedArtists(related);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [id, columnCount, smallerWidth]);

    // useEffect(() => {
    //     let isMounted = true;

    //     if (trackData && artistsData && id) {
    //         let artistId, genres, recommend;
    //         genres = artistsData[0].genres.toString();
    //         artistId = artistsData[0].id;
    //         async function loadData () {
    //             recommend =  await spotifyApi.getRecommendations({
    //                 'seed_artists': artistId,
    //                 'seed_genres': genres, 
    //                 'seed_tracks': id
    //             })
    //             .then((data) => data)
    //             .catch((error) => console.log('Error', error));
            
                
    //             if (isMounted) {
    //                 setRecommendTracks(recommend)
    //             }
    //         }
    //         loadData();
    //     }
        
    //     return () => (isMounted = false);
    // }, [id, trackData, artists])

    if (hasData) {
        const date = new Date(trackData.album.release_date);
        const year = date.getFullYear();
        const month = date.toLocaleDateString("en-GB", {month: 'long'});
        const day = date.getDate();

        if (smallerWidth) {
            return (
                <PageContentMobileLayout
                    imgUrl={trackData.album.images.length > 0 ? trackData.album.images[0].url : false}
                    title={trackData.name}
                    fallbackIcon={<MusicalNoteIcon />}
                    type='Song'
                    subTitle={<div className={cx('intro')}>
                        <div className={cx('header-creator-wrapper')}>
                            {artistsData && artistsData[0].images?.length > 0 
                                ? <img src={artistsData[0].images[0].url} alt={`${artistsData[0].name}`} className={cx('creator-img')} /> 
                                : <div className={cx('creator-img')}>
                                    <PersonIcon />
                                </div>
                            }
                            <Link className={cx('header-creator')}
                                to={`/artist/${trackData.artists[0].id}`}
                            >
                                {trackData.artists[0].name}
                            </Link>
                        </div>
                        <div
                            style={{
                                marginTop: '8px',
                                color: 'hsla(0, 0%, 100%, .7)',
                            }}
                        >
                            <span className={cx('header-creator')}>
                                {trackData.album.name}
                            </span>
                            <span className={cx('header-total')}>
                                {` • ${year} • `}
                            </span>
                            <span className={cx('header-duration')}>
                                {trackData.duration_ms > 3599000 
                                ? convertMsToHM(trackData.duration_ms) 
                                : msToMinAndSeconds(trackData.duration_ms, true)}
                            </span>
                        </div>
                    </div>}
                    contextMenu={contextMenu['mobile-track']}
                    renderPlay
                    toId={id}
                    toAlbumId={trackData.album.id}
                    isTrack
                >
                    <div className={cx('artists-list')}
                        style={{ padding: `0 12px` }}
                    > 
                        {artistsData && artistsData.map(item => (
                            <Link key={item.id}
                                className={cx('artist-tag')}
                                to={`/artist/${item.id}`}
                            >
                                {item && item.images.length > 0  
                                    ? <img src={item.images[0].url} alt={`${item.name}`}  
                                        className={cx('artist-img')}
                                    />
                                    : <div className={cx('artist-img', 'fallback')}>
                                        <PersonIcon />
                                    </div>
                                }
                                <div className={cx('artist-intro')}>
                                    <span className={cx('artist-sub-title')}>{item.type}</span>
                                    <Link to={`/artist/${item.id}`} className={cx('artist-title')}>{item.name}</Link>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {recommendTracks && <div className={cx('top-tracks-header')}
                        style={{ 
                            padding: `0 12px 26px`,
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: 'var(--color-white)',
                        }}
                    >
                        Recommended based on this song
                    </div>}

                    {recommendTracks && recommendTracks.tracks.map((item, index) => (
                        <MobileCardItem 
                            key={item.id}
                            isTrack={true}
                            isPlaylistPage={true}
                            img={item.album.images[0].url}
                            title={item.name}
                            type={item.type}
                            artistsData={item.artists}
                            toId={item.id}
                            albumId={item.album.id}
                            index={index}
                        />
                    ))}
                    <div className={cx('top-tracks-header')}
                        style={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '36px 12px 0'
                        }}
                    >
                        Popular Tracks by
                        <span
                            style={{ 
                                padding: `8px 0 26px`,
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: 'var(--color-white)',
                            }}
                        >{trackData.artists[0].name}</span>
                    </div>
                    
                    <div
                        style={{
                            padding: '0 0 22px',
                        }}
                    >
                        {topTracksOfArtist.tracks && topTracksOfArtist.tracks.map((item, index) => <MobileCardItem 
                                key={item.id}
                                isTrack={true}
                                isPlaylistPage={true}
                                img={item.album.images[0].url}
                                title={item.name}
                                type={item.type}
                                artistsData={item.artists}
                                toId={item.id}
                                albumId={item.album.id}
                                index={index}
                            />
                        )}
                    </div>
                    <Segment normal isAlbum 
                        data={artistAlbums.items} 
                        headerTitle={`Releases by ${trackData.artists[0].name}`} 
                        showAll={artistAlbums.total > columnCount}
                    />
                    <Segment normal isArtist 
                        data={relatedArtists.artists.filter((e, index) => {
                            if (smallerWidth) {
                                return index < 10;
                            } else {
                                return index < columnCount;
                            }
                        })} 
                        headerTitle={`Fans also like`} 
                        showAll
                    />
                    <div className={cx('album-content-header')}>
                        {trackData.album.images.length > 0 
                            ? <img src={trackData.album.images[0].url} alt={`${trackData.name}`} className={cx('album-content-img')} /> 
                            : <div className={cx('album-content-img')}>
                                <MusicalNoteIcon />
                            </div>
                        }
                        <div className={cx('album-content-title')}>
                            <span>From the album</span>
                            <Link className={cx('album-content-name')}
                                to={`/album/${trackData.album.id}`}
                            >
                                    {trackData.album.name}
                            </Link>
                        </div>
                    </div>
                    <Segment data={albumData.tracks.items} songs isAlbum existHeader={false} 
                        titleForNextFrom={trackData.album.name} albumIdToList={trackData.album.id}
                        colHeaderIndex
                        colHeaderTitle
                        colHeaderDuration
                    />
                    <div className={cx('copyrights-label')}>
                        <span className={cx('release-time')}>{`${month} ${day}, ${year}`}</span>
                        {albumData.copyrights.map((item) => {
                            let result;
                            if (item.type === 'P') {
                                if (item.text.includes('(P)')) {
                                    result = `℗ ${item.text.replace('(P) ', '')}`;
                                } else if (item.text.includes('℗')) {
                                    result = `℗ ${item.text.replace('℗ ', '')}`;
                                } else {
                                    result = `℗ ${item.text}`;
                                }
                            } else {
                                // console.log(item.text)
                                if (item.text.includes('(C)')) {
                                    result = `© ${item.text.replace('(C) ', '')}`;
                                } else if (item.text.includes('©')) {
                                    result = `© ${item.text.replace('© ', '')}`;
                                } else {
                                    result = `© ${item.text}`;
                                }
                            }
                            return (
                                <span key={item.type}>
                                    {result}
                                </span>
                            );
                        })}
                    </div>
                </PageContentMobileLayout>
            )
        } else {
            return (
                <PageContentLayout 
                    imgUrl={trackData.album.images.length > 0 ? trackData.album.images[0].url : false}
                    title={trackData.name}
                    fallbackIcon={<MusicalNoteIcon />}
                    type='Song'
                    subTitle={<div className={cx('intro')}>
                        <div className={cx('header-creator-wrapper')}>
                            {artistsData && artistsData[0].images.length > 0 
                                ? <img src={artistsData[0].images[0].url} alt={`${artistsData[0].name}`} className={cx('creator-img')} /> 
                                : <div className={cx('creator-img')}>
                                    <PersonIcon />
                                </div>
                            }
                            <Link className={cx('header-creator')}
                                to={`/artist/${trackData.artists[0].id}`}
                            >
                                {trackData.artists[0].name}
                            </Link>
                        </div>
                        <span> • </span>
                        <Link className={cx('header-creator')}
                            to={`/album/${trackData.album.id}`}
                        >
                            {trackData.album.name}
                        </Link>
                        <span className={cx('header-total')}>
                            {` • ${year} • `}
                        </span>
                        <span className={cx('header-duration')}>
                            {trackData.duration_ms > 3599000 
                            ? convertMsToHM(trackData.duration_ms) 
                            : msToMinAndSeconds(trackData.duration_ms, true)}
                        </span>
                    </div>}
                    contextMenu={contextMenu.track}
                    renderPlay
                    toId={id}
                    isTrack
                    loading={false}
                >
                    <div className={cx('artists-list')}
                        style={{ padding: `0 clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px) 0` }}
                    > 
                        {artistsData && artistsData.map(item => (
                            <div key={item.id}
                                className={cx('artist-tag')}
                            >
                                {item && item.images.length > 0 
                                    ? <img src={item.images[0].url} alt={`${item.name}`}  
                                        className={cx('artist-img')}
                                    />
                                    : <div className={cx('artist-img')}>
                                        <PersonIcon />
                                    </div>
                                }
                                <div className={cx('artist-intro')}>
                                    <span className={cx('artist-sub-title')}>{item.type}</span>
                                    <Link to={`/artist/${item.id}`} className={cx('artist-title')}>{item.name}</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    {recommendTracks && <Segment 
                        data={recommendTracks.tracks.filter((value, index) => index < 5)} 
                        headerTitle='Recommended based on this song' 
                        songs isArtist 
                        colHeaderIndex
                        colHeaderTitle
                        colHeaderDuration
                    />}
                    <div className={cx('top-tracks-header')}
                        style={{ padding: `24px clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px) 0` }}
                    >
                        Popular Tracks by
                    </div>
                    
                    <Segment data={topTracksOfArtist.tracks} headerTitle={trackData.artists[0].name} songs isArtist 
                        colHeaderIndex
                        colHeaderTitle
                        colHeaderDuration
                    />
                    <Segment normal isAlbum 
                        data={artistAlbums.items} 
                        headerTitle={`Releases by ${trackData.artists[0].name}`} 
                        showAll={artistAlbums.total > columnCount}
                    />
                    <Segment normal isArtist 
                        data={relatedArtists.artists.filter((e, index) => index < columnCount)} 
                        headerTitle={`Fans also like`} 
                        showAll
                    />
                    <div className={cx('album-content-header')}>
                        {trackData.album.images.length > 0 
                            ? <img src={trackData.album.images[0].url} alt={`${trackData.name}`} className={cx('album-content-img')} /> 
                            : <div className={cx('album-content-img')}>
                                <MusicalNoteIcon />
                            </div>
                        }
                        <div className={cx('album-content-title')}>
                            <span>From the album</span>
                            <Link className={cx('album-content-name')}
                                to={`/album/${trackData.album.id}`}
                            >
                                    {trackData.album.name}
                            </Link>
                        </div>
                    </div>
                    <Segment data={albumData.tracks.items} songs isAlbum existHeader={false} 
                        titleForNextFrom={trackData.album.name} albumIdToList={trackData.album.id}
                        colHeaderIndex
                        colHeaderTitle
                        colHeaderDuration
                    />
                    <div className={cx('copyrights-label')}>
                        <span className={cx('release-time')}>{`${month} ${day}, ${year}`}</span>
                        {albumData.copyrights.map((item) => {
                            let result;
                            if (item.type === 'P') {
                                if (item.text.includes('(P)')) {
                                    result = `℗ ${item.text.replace('(P) ', '')}`;
                                } else if (item.text.includes('℗')) {
                                    result = `℗ ${item.text.replace('℗ ', '')}`;
                                } else {
                                    result = `℗ ${item.text}`;
                                }
                            } else {
                                // console.log(item.text)
                                if (item.text.includes('(C)')) {
                                    result = `© ${item.text.replace('(C) ', '')}`;
                                } else if (item.text.includes('©')) {
                                    result = `© ${item.text.replace('© ', '')}`;
                                } else {
                                    result = `© ${item.text}`;
                                }
                            }
                            return (
                                <span key={item.type}>
                                    {result}
                                </span>
                            );
                        })}
                    </div>
                </PageContentLayout>
            );
        }

        
    }
}

export default Track;