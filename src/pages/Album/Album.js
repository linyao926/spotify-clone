import { useContext, useState, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams } from 'react-router-dom';
import PageContentDefault from '~/components/Layouts/PageContentDefault';
import ContentFrame from '~/components/Layouts/ContentFrame';
import { PersonIcon } from '~/assets/icons';
import classNames from 'classnames/bind';
import styles from './Album.module.scss';

const cx = classNames.bind(styles);

function Album() {
    const { 
        spotifyApi, 
        msToMinAndSeconds, 
        totalDuration, 
        convertMsToHM, 
        contextMenu,
        columnCount,
    } = useContext(AppContext);

    const [id, setId] = useState(null);
    const [resultData, setResultData] = useState([]);
    const [artistData, setArtistData] = useState(null);
    const [albumsData, setAlbumsData] = useState(null);
    const [hasData, setHasData] = useState(false);

    const params = useParams();

    const date = new Date(resultData.release_date);
    const year = date.getFullYear();
    const month = date.toLocaleDateString("en-GB", {month: 'long'});
    const day = date.getDate();

    useEffect(() => {
        setId(params.id);
        setHasData(false);
    }, [params]);

    useEffect(() => {
        let isMounted = true;

        if (id) {
            async function loadData () {
                const data =  await spotifyApi.getAlbum(id)
                .then((data) => data)
                .catch((error) => console.log('Error', error));

                const artist = await spotifyApi.getArtist(data.artists[0].id)
                .then((data) => data)
                .catch((error) => console.log('Error', error));

                const albums = await spotifyApi.getArtistAlbums(artist.id, { 
                    include_groups: 'album,single',
                    limit: columnCount, 
                })
                .then((data) => data)
                .catch((error) => console.log('Error', error))

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
    }, [id, columnCount]);

    // console.log(resultData)

    if (hasData) {
        const tracksData = resultData.tracks.items;
        // console.log(resultData)
        // console.log(artistData)

        let totalTime = totalDuration(tracksData); 

        return (
            <PageContentDefault 
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
            >
                <ContentFrame data={tracksData} songs isAlbum existHeader albumIdToList={id} 
                    titleForNextFrom={resultData.name}
                    columnHeader
                    colHeaderIndex
                    colHeaderTitle
                    colHeaderDuration
                />
                <div className={cx('copyrights-label')}>
                    <span className={cx('release-time')}>{`${month} ${day}, ${year}`}</span>
                    {resultData.copyrights.map((item) => 
                        <span key={item.type}>
                            {`${item.type === 'P' ? '℗' : '©' } ${item.text}`}
                        </span>
                    )}
                </div>
                <ContentFrame normal isAlbum 
                    data={albumsData.items} 
                    headerTitle={`More by ${artistData.name}`}
                    showAll={albumsData.total > columnCount}  
                    subHeaderTitle='See discography'
                    type='discography'
                    toAll={`/artist/${artistData.id}/discography`}
                />
            </PageContentDefault>
        );
    }
}

export default Album;