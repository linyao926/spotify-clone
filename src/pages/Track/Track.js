import { extractColors } from 'extract-colors';
import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useLocation } from 'react-router-dom';
import { DotsIcon, ArtistIcon, HeartIcon } from '~/assets/icons';
import { BsFillPlayFill } from 'react-icons/bs';
import Button from '~/components/Button';
import ContentFrame from '~/components/Layouts/ContentFrame';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';
import classNames from 'classnames/bind';
import styles from './Track.module.scss';

const cx = classNames.bind(styles);

function Track() {
    const { spotifyApi, bgHeaderColor, setBgHeaderColor, columnCount, msToMinAndSeconds,convertMsToHM } = useContext(AppContext);
    const [id, setId] = useState(null);
    const [trackData, setTrackData] = useState(null);
    const [albumData, setAlbumData] = useState(null);
    const [artistAlbums, setArtistAlbums] = useState(null);
    const [topTracksOfArtist, setTopTracksOfArtist] = useState(null);
    const [relatedArtists, setRelatedArtists] = useState(null);
    const [hasData, setHasData] = useState(false);  
    const [colors, setColors] = useState(null);
    
    const ref = useRef(null);

    const {pathname} = useLocation();

    useEffect(() => {
        const indexStart = pathname.indexOf('/', 1) + 1;
        setId(pathname.slice(indexStart));
        setHasData(false);
    }, [pathname]);

    useEffect(() => {
        let isMounted = true;

        if (id) {
            async function loadData () {
                const [track, album, artistDiscography, tracks, related] =  await Promise.all([
                    spotifyApi.getTrack(id),
                    spotifyApi.getTrack(id)
                    .then(function (data) {
                        return data.album.id;
                    })
                    .then(function(albumId) {
                        return spotifyApi.getAlbum(albumId);
                    }),
                    spotifyApi.getTrack(id)
                    .then(function (data) {
                        // console.log(data)
                        return data.artists[0].id;
                    })
                    .then(function(id) {
                        return spotifyApi.getArtistAlbums(id, { 
                            include_groups: 'album,single',
                            limit: columnCount,
                        });
                    }),
                    spotifyApi.getTrack(id)
                    .then(function (data) {
                        return data.artists[0].id;
                    })
                    .then(function(id) {
                        return spotifyApi.getArtistTopTracks(id, 'VN');
                    }),
                    spotifyApi.getTrack(id)
                    .then(function (data) {
                        // console.log(data)
                        return data.artists[0].id;
                    })
                    .then(function(id) {
                        return spotifyApi.getArtistRelatedArtists(id);
                    })
                ]);
                if (isMounted) {
                    setHasData(true);
                    setTrackData(track);
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

    // console.log(relatedArtists.artists.filter((e, index) => index < columnCount))

    useEffect(() => {
        if (hasData) {
            extractColors(trackData.album.images[0].url, {crossOrigin: 'Anonymous'})
            .then(setColors)
            .catch(console.error);
        }
    }, [hasData, pathname]);

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
            setBgHeaderColor(color);
        }
    }, [colors]);

    useEffect(() => {
        if (ref.current) {
            ref.current.style.setProperty('--background-noise', bgHeaderColor);
        }
    }, [ref.current, bgHeaderColor]);

    if (hasData) {
        const date = new Date(trackData.album.release_date);
        const year = date.getFullYear();
        const month = date.toLocaleDateString("en-GB", {month: 'long'});
        const day = date.getDate();

        return (
            <div className={cx('wrapper')}
                ref={ref}
            >
                <header className={cx('header')}>
                    {trackData.album.images.length > 0 
                        ? <img src={trackData.album.images[0].url} alt={`Image of ${trackData.name}`} className={cx('header-img')} /> 
                        : <div className={cx('header-img')}>
                            <ArtistIcon />
                        </div>
                    }
                   
                    <div className={cx('header-title')}>
                        <h5>Song</h5>
                        <h1>{trackData.name}</h1>
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
                    </div>
                </header>
                <div className={cx('interact')}>
                    <Button primary rounded large className={cx('play-btn')}>
                        <BsFillPlayFill />
                    </Button>
                    <span className={cx('save-icon', 'tooltip')}>
                        <HeartIcon />
                        <span className={cx('tooltiptext')}>Save to Your Library</span>
                    </span>
                    <span className={cx('option-icon', 'tooltip')}>
                        <DotsIcon />
                        <span className={cx('tooltiptext')}>More options for {trackData.name}</span>
                    </span>
                </div>
                <div className={cx('top-tracks-header')}>
                    Popular Tracks by
                </div>
                <ContentFrame data={topTracksOfArtist.tracks} headerTitle={trackData.artists[0].name} songs isArtist />
                <ContentFrame normal isAlbum data={artistAlbums.items} headerTitle={`Releases by ${trackData.artists[0].name}`} showAll />
                <ContentFrame normal isArtist 
                    data={relatedArtists.artists.filter((e, index) => index < columnCount)} 
                    headerTitle={`Fans also like`} 
                    showAll 
                />
                <div className={cx('album-content-header')}>
                    {trackData.album.images.length > 0 
                        ? <img src={trackData.album.images[0].url} alt={`Image of ${trackData.name}`} className={cx('album-content-img')} /> 
                        : <div className={cx('album-content-img')}>
                            <ArtistIcon />
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
                <ContentFrame data={albumData.tracks.items} songs isAlbum existHeader={false} />
                <div className={cx('copyrights-label')}>
                    <span className={cx('release-time')}>{`${month} ${day}, ${year}`}</span>
                    {albumData.copyrights.map((item) => 
                        <span key={item.type}>
                            {`${item.type === 'P' ? '℗' : '©' } ${item.text}`}
                        </span>
                    )}
                </div>
                <ContentFooter />
            </div>
        );
    }
}

export default Track;