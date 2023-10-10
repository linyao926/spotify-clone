import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { MusicalNoteIcon } from '~/assets/icons';
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
    } = useContext(AppContext);
    const [id, setId] = useState(null);
    const [trackData, setTrackData] = useState(null);
    const [albumData, setAlbumData] = useState(null);
    const [artistAlbums, setArtistAlbums] = useState(null);
    const [topTracksOfArtist, setTopTracksOfArtist] = useState(null);
    const [relatedArtists, setRelatedArtists] = useState(null);
    const [hasData, setHasData] = useState(false);  
    const [audioAnalysis, setAudioAnalysis] = useState(null);

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
                const [track, album, artistDiscography, tracks, related, analysis] =  await Promise.all([
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

                    spotifyApi.getAudioAnalysisForTrack(id),
                    // spotifyApi.play(id)
                ]);
                if (isMounted) {
                    setHasData(true);
                    setTrackData(track);
                    setAlbumData(album);
                    setArtistAlbums(artistDiscography);
                    setTopTracksOfArtist(tracks);
                    setRelatedArtists(related);
                    setAudioAnalysis(analysis)
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
                subTitle={<>
                    <Link className={cx('header-creator')}
                        to={`/artist/${trackData.artists[0].id}`}
                    >
                        {trackData.artists[0].name}
                    </Link>
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
                </>}
                contextMenu={contextMenu.track}
                renderPlay
                toId={id}
                isTrack
            >
                <div className={cx('top-tracks-header')}>
                    Popular Tracks by
                </div>
                
                <ContentFrame data={topTracksOfArtist.tracks} headerTitle={trackData.artists[0].name} songs isArtist />
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