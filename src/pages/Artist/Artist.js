import { extractColors } from 'extract-colors';
import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { DotsIcon, ArtistIcon } from '~/assets/icons';
import { BsFillPlayFill } from 'react-icons/bs';
import Button from '~/components/Button';
import ContentFrame from '~/components/Layouts/ContentFrame';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';
import classNames from 'classnames/bind';
import styles from './Artist.module.scss';

const cx = classNames.bind(styles);

function Artist({follow}) {
    const { spotifyApi, 
        bgHeaderColor, 
        setBgHeaderColor, 
        columnCount,
    } = useContext(AppContext);
    const [id, setId] = useState(null);
    const [artistData, setArtistData] = useState(null);
    const [albumsData, setAlbumsData] = useState(null);
    const [topTracks, setTopTracks] = useState(null);
    const [appearsOn, setAppearsOn] = useState(null);
    const [relatedArtists, setRelatedArtists] = useState(null);
    const [hasData, setHasData] = useState(false);  
    const [colors, setColors] = useState(null);
    
    const ref = useRef(null);

    const {pathname} = useLocation();

    // const date = new Date(resultData.release_date);
    // const year = date.getFullYear();
    // const month = date.toLocaleDateString("en-GB", {month: 'long'});
    // const day = date.getDate();

    useEffect(() => {
        const indexIdStart = pathname.indexOf('/', 1) + 1;
        let indexType = pathname.indexOf('/', indexIdStart) + 1 ;

        if (indexType > 0) {
            setId(pathname.slice(indexIdStart, indexType - 1));
        } else {
            setId(pathname.slice(indexIdStart));
        }
        setHasData(false);
    }, [pathname]);

    useEffect(() => {
        let isMounted = true;

        if (id) {
            async function loadData () {
                const [artist, tracks, albums, appears, related] =  await Promise.all([
                    spotifyApi.getArtist(id, {limit: columnCount})
                    .then((data) => data, 
                        (error) => console.log('Error', error)
                    ),
                    spotifyApi.getArtistTopTracks(id, 'VN')
                    .then((data) => data, 
                        (error) => console.log('Error', error)
                    ),
                    spotifyApi.getArtistAlbums(id, { 
                        include_groups: 'album,single',
                        limit: columnCount, 
                    })
                    .then((data) => data, 
                        (error) => console.log('Error', error)
                    ),
                    spotifyApi.getArtistAlbums(id, { 
                        include_groups: 'appears_on',
                        limit: columnCount, 
                    })
                    .then((data) => data, 
                        (error) => console.log('Error', error)
                    ),
                    spotifyApi.getArtistRelatedArtists(id)
                    .then((data) => data, 
                        (error) => console.log('Error', error)
                    ),
                ]);
                if (isMounted) {
                    setHasData(true);
                    setArtistData(artist);
                    setTopTracks(tracks);
                    setAlbumsData(albums);
                    setAppearsOn(appears);
                    setRelatedArtists(related);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [id, columnCount]);

    // console.log(albumsData)

    useEffect(() => {
        if (hasData) {
            extractColors(artistData.images[0].url, {crossOrigin: 'Anonymous'})
            .then(setColors)
            .catch(console.error);
        }
    }, [hasData, id]);

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
        return (
            <div className={cx('wrapper')}
                ref={ref}
            >
                <header className={cx('header')}>
                    {artistData.images.length > 0 
                        ? <img src={artistData.images[0].url} alt={`Image of ${artistData.name}`} className={cx('header-img')} /> 
                        : <div className={cx('header-img')}>
                            <ArtistIcon />
                        </div>
                    }
                    
                    <div className={cx('header-title')}>
                        <h5>Artist</h5>
                        <h1>{artistData.name}</h1>
                        <span className={cx('header-total')}>
                            {`${Intl.NumberFormat().format(artistData.followers.total)} Follower`}
                        </span>
                    </div>
                </header>
                <div className={cx('interact')}>
                    <Button primary rounded large className={cx('play-btn')}>
                        <BsFillPlayFill />
                    </Button>
                    {!follow 
                        ? <Button dark outline className={cx('follow-btn')}>
                            follow
                        </Button>
                        : <Button dark outline className={cx('follow-btn', 'following')}>
                            following
                        </Button>
                    }
                    <span className={cx('option-icon', 'tooltip')}>
                        <DotsIcon />
                        <span className={cx('tooltiptext')}>More options for {artistData.name}</span>
                    </span>
                </div>
                <ContentFrame data={topTracks.tracks} headerTitle='Popular' songs isArtist />
                <ContentFrame normal isAlbum 
                    data={albumsData.items} 
                    headerTitle='Discography' 
                    showAll={albumsData.total > columnCount}  
                    type='discography'
                />
                <ContentFrame normal isArtist 
                    data={relatedArtists.artists.filter((e, index) => index < columnCount)} 
                    headerTitle={`Fans also like`} 
                    showAll
                    type='related'
                />
                {/* {console.log(appearsOn.items)} */}
                <ContentFrame normal isAlbum data={appearsOn.items} 
                    headerTitle='Appears On' 
                    showAll={appearsOn.total > columnCount} 
                    type='appears_on'
                />
                <ContentFooter />
            </div>
        );
    }
}

export default Artist;