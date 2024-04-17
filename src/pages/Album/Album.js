import { useContext, useState, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { PersonIcon } from '~/assets/icons';
import PageContentLayout from '~/components/Layouts/PageContentLayout';
import PageContentMobileLayout from '~/components/Layouts/PageContentMobileLayout';
import Segment from '~/components/Containers/Segment';
import classNames from 'classnames/bind';
import styles from './Album.module.scss';

const cx = classNames.bind(styles);

function Album() {
    const { 
        spotifyApi, 
        setTokenError,
        msToMinAndSeconds, 
        totalDuration, 
        convertMsToHM, 
        contextMenu,
        columnCount,
        smallerWidth,
        nextFromId,
    } = useContext(AppContext);

    const [id, setId] = useState(null);
    const [resultData, setResultData] = useState(null);
    const [artistData, setArtistData] = useState(null);
    const [albumsData, setAlbumsData] = useState(null);
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
                const data =  await spotifyApi.getAlbum(id)
                .then((data) => data)
                .catch((error) => {
                    console.log('Error', error)
                    if (error.status === 401) {
                        setTokenError(true);
                    }
                });

                let artist;
                if (data) {
                    artist = await spotifyApi.getArtist(data.artists[0].id)
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });
                }

                let albums;
                if (artist) {
                    albums = await spotifyApi.getArtistAlbums(artist.id, { 
                        include_groups: 'album,single',
                        limit: columnCount, 
                    })
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });
                }

                if (isMounted) {
                    setHasData(true);
                    setResultData(data);
                    artist && setArtistData(artist);
                    albums && setAlbumsData(albums);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [id, columnCount, hasData]);

    if (hasData) {
        const date = new Date(resultData.release_date);
        const year = date.getFullYear();
        const month = date.toLocaleDateString("en-GB", {month: 'long'});
        const day = date.getDate();
        const tracksData = resultData.tracks.items;
        let totalTime = totalDuration(tracksData); 
       
        if (smallerWidth) {
            return (
                <PageContentMobileLayout
                    imgUrl={resultData.images.length > 0 ? resultData.images[0].url : false}
                    title={resultData.name}
                    type={resultData.album_type}
                    subTitle={<div className={cx('intro')}>
                        {resultData.artists.length > 1 ? resultData.artists.map((artist, index) => (
                            <div key={artist.id}
                                style={{
                                    display: 'inline-block',
                                    marginRight: '3px'
                                }}
                            >
                                <Link 
                                    className={cx('header-creator')}
                                    to={`/artist/${artist.id}`}
                                >
                                    {artist.name}
                                </Link>
                                {index !== resultData.artists.length - 1 && ' •'}
                            </div>
                        ))
                        : <div className={cx('header-creator-wrapper')}>
                            {artistData.images.length > 0 
                                ? <img src={artistData.images[0].url} alt={`Image of ${artistData.name}`} className={cx('creator-img')} /> 
                                : <div className={cx('creator-img')}>
                                    <PersonIcon />
                                </div>
                            }
                            <Link className={cx('header-creator')}
                                to={`/artist/${artistData.id}`}
                            >
                                {artistData.name}
                            </Link>
                        </div>}
                        <div
                            style={{
                                marginTop: '8px',
                                color: 'hsla(0, 0%, 100%, .7)',
                            }}
                        >
                            <span className={cx('header-total')}>
                                {`${year} • `}
                                {resultData.total_tracks > 1 
                                    ? `${resultData.total_tracks} songs, `
                                    : `${resultData.total_tracks} song, `
                                }
                            </span>
                            <span className={cx('header-duration')}>
                                {totalTime > 3599000 
                                ? convertMsToHM(totalTime) 
                                : msToMinAndSeconds(totalTime)}
                            </span>
                        </div>
                    </div>}
                    contextMenu={contextMenu['mobile-album']}
                    renderPlay
                    toId={id}
                    isAlbum
                    artistData={resultData.artists}
                    loading={false}
                >
                    <Segment data={tracksData} songs isAlbum albumIdToList={id} 
                        titleForNextFrom={resultData.name}
                        columnHeader
                        colHeaderIndex
                        colHeaderTitle
                        colHeaderDuration
                    />
                    <div className={cx('copyrights-label')}>
                        <span className={cx('release-time')}>{`${month} ${day}, ${year}`}</span>
                        {resultData.copyrights.map((item) => {
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
                    imgUrl={resultData.images.length > 0 ? resultData.images[0].url : false}
                    title={resultData.name}
                    type={resultData.album_type}
                    subTitle={<div className={cx('intro')}>
                        {resultData.artists.length > 1 ? resultData.artists.map((artist, index) => (
                            <div key={artist.id}
                                style={{
                                    display: 'inline-block',
                                    marginRight: '3px'
                                }}
                            >
                                <Link 
                                    className={cx('header-creator')}
                                    to={`/artist/${artist.id}`}
                                >
                                    {artist.name}
                                </Link>
                                {index !== resultData.artists.length - 1 && ' •'}
                            </div>
                        ))
                        : <div className={cx('header-creator-wrapper')}>
                            {artistData.images.length > 0 
                                ? <img src={artistData.images[0].url} alt={`Image of ${artistData.name}`} className={cx('creator-img')} /> 
                                : <div className={cx('creator-img')}>
                                    <PersonIcon />
                                </div>
                            }
                            <Link className={cx('header-creator')}
                                to={`/user/${artistData.id}`}
                            >
                                {artistData.name}
                            </Link>
                        </div>}
                        <span className={cx('header-total')}>
                            {`• ${year} • `}
                            {resultData.total_tracks > 1 
                                ? `${resultData.total_tracks} songs, `
                                : `${resultData.total_tracks} song, `
                            }
                        </span>
                        <span className={cx('header-duration')}>
                            {totalTime > 3599000 
                            ? convertMsToHM(totalTime) 
                            : msToMinAndSeconds(totalTime)}
                        </span>
                    </div>}
                    contextMenu={contextMenu.album}
                    renderPlay
                    toId={id}
                    isAlbum
                    artistData={resultData.artists}
                    loading={false}
                >
                    <Segment data={tracksData} songs isAlbum existHeader albumIdToList={id} 
                        titleForNextFrom={resultData.name}
                        columnHeader
                        colHeaderIndex
                        colHeaderTitle
                        colHeaderDuration
                    />
                    <div className={cx('copyrights-label')}>
                        <span className={cx('release-time')}>{`${month} ${day}, ${year}`}</span>
                        {resultData.copyrights.map((item) => {
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
                    <Segment normal isAlbum 
                        data={albumsData.items} 
                        headerTitle={`More by ${artistData.name}`}
                        showAll={albumsData.total > columnCount}  
                        subHeaderTitle='See discography'
                        type='discography'
                        toAll={`/artist/${artistData.id}/discography`}
                    />
                </PageContentLayout>
            )
        } 
    } 
}

export default Album;