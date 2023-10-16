import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { MusicalNoteIcon, PersonIcon } from '~/assets/icons';
import PageContentDefault from '~/components/Layouts/PageContentDefault';
import ContentFrame from '~/components/Layouts/ContentFrame';
import classNames from 'classnames/bind';
import styles from './Track.module.scss';

const cx = classNames.bind(styles);

function Track() {
    const { 
        spotifyApi, 
        columnCount, 
        msToMinAndSeconds,
        convertMsToHM, 
        contextMenu,
        setNowPlayingId,
        setNextQueueId, 
        containerWidth,
    } = useContext(AppContext);

    const [id, setId] = useState(null);
    const [trackData, setTrackData] = useState(null);
    const [artistsData, setArtistsData] = useState(null);
    const [albumData, setAlbumData] = useState(null);
    const [artistAlbums, setArtistAlbums] = useState(null);
    const [topTracksOfArtist, setTopTracksOfArtist] = useState(null);
    const [relatedArtists, setRelatedArtists] = useState(null);
    const [hasData, setHasData] = useState(false);  

    // console.log()

    const params = useParams();

    useEffect(() => {
        setId(params.id);
        setHasData(false);
    }, [params]);

    useEffect(() => {
        let isMounted = true;

        if (id) {
            async function loadData () {
                const [track, album, artistDiscography, tracks, related, artists] =  await Promise.all([
                    spotifyApi.getTrack(id)
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)),

                    spotifyApi.getTrack(id)
                    .then(function (data) {
                        return data.album.id;
                    })
                    .then(function(albumId) {
                        return spotifyApi.getAlbum(albumId);
                    })
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)),

                    spotifyApi.getTrack(id)
                    .then(function (data) {
                        return data.artists[0].id;
                    })
                    .then(function(id) {
                        return spotifyApi.getArtistAlbums(id, { 
                            include_groups: 'album,single',
                            limit: columnCount,
                        });
                    })
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)),

                    spotifyApi.getTrack(id)
                    .then(function (data) {
                        return data.artists[0].id;
                    })
                    .then(function(id) {
                        return spotifyApi.getArtistTopTracks(id, 'VN');
                    })
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)),

                    spotifyApi.getTrack(id)
                    .then(function (data) {
                        return data.artists[0].id;
                    })
                    .then(function(id) {
                        return spotifyApi.getArtistRelatedArtists(id);
                    })
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)),

                    spotifyApi.getTrack(id)
                    .then(function (data) {
                        return data.artists;
                    })
                    .then(function(artists) {
                        const list = [];
                        artists.map((item) => list.push(item.id));
                        return list;
                    })
                    .catch((error) => console.log('Error', error)),
                ]);

                const artistData = await Promise.all(
                    artists.map((id) => spotifyApi.getArtist(id)
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)))
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
    }, [id, columnCount]);

    // console.log(trackData)


    if (hasData) {
        // console.log(artistAlbums)
        const date = new Date(trackData.album.release_date);
        const year = date.getFullYear();
        const month = date.toLocaleDateString("en-GB", {month: 'long'});
        const day = date.getDate();

        return (
            <PageContentDefault 
                imgUrl={trackData.album.images.length > 0 ? trackData.album.images[0].url : false}
                title={trackData.name}
                fallbackIcon={<MusicalNoteIcon />}
                type='Song'
                subTitle={<div className={cx('intro')}>
                    <div className={cx('header-creator-wrapper')}>
                        {artistsData && artistsData[0].images.length > 0 
                            ? <img src={artistsData[0].images[0].url} alt={`Image of ${artistsData[0].name}`} className={cx('creator-img')} /> 
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
            >
                <div className={cx('artists-list')}
                    style={{ padding: `0 clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px) 0` }}
                > 
                    {artistsData && artistsData.map(item => (
                        <div key={item.id}
                            className={cx('artist-tag')}
                        >
                            {artistsData && artistsData[0].images.length > 0 
                                ? <img src={item.images[0].url} alt={`Image of ${item.name}`}  
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
                <div className={cx('top-tracks-header')}
                    style={{ padding: `24px clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px) 0` }}
                >
                    Popular Tracks by
                </div>
                
                <ContentFrame data={topTracksOfArtist.tracks} headerTitle={trackData.artists[0].name} songs isArtist 
                    colHeaderIndex
                    colHeaderTitle
                    colHeaderDuration
                />
                <ContentFrame normal isAlbum 
                    data={artistAlbums.items} 
                    headerTitle={`Releases by ${trackData.artists[0].name}`} 
                    showAll={artistAlbums.total > columnCount}
                />
                <ContentFrame normal isArtist 
                    data={relatedArtists.artists.filter((e, index) => index < columnCount)} 
                    headerTitle={`Fans also like`} 
                    showAll
                />
                <div className={cx('album-content-header')}>
                    {trackData.album.images.length > 0 
                        ? <img src={trackData.album.images[0].url} alt={`Image of ${trackData.name}`} className={cx('album-content-img')} /> 
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
                <ContentFrame data={albumData.tracks.items} songs isAlbum existHeader={false} 
                    titleForNextFrom={trackData.album.name} albumIdToList={trackData.album.id}
                    colHeaderIndex
                    colHeaderTitle
                    colHeaderDuration
                />
                <div className={cx('copyrights-label')}>
                    <span className={cx('release-time')}>{`${month} ${day}, ${year}`}</span>
                    {albumData.copyrights.map((item) => 
                        <span key={item.type}>
                            {`${item.type === 'P' ? '℗' : '©' } ${item.text}`}
                        </span>
                    )}
                </div>
            </PageContentDefault>
        );
    }
}

export default Track;