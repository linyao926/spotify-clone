import { useContext, useState, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams } from 'react-router-dom';
import PageContentDefault from '~/components/Layouts/PageContentDefault';
import ContentFrame from '~/components/Layouts/ContentFrame';
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
    } = useContext(AppContext);

    const [id, setId] = useState(null);
    const [resultData, setResultData] = useState([]);
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
                if (isMounted) {
                    setHasData(true);
                    setResultData(data)
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [id]);

    // console.log(resultData)

    if (hasData) {
        const tracksData = resultData.tracks.items;
        // console.log(resultData)

        let totalTime = totalDuration(tracksData); 

        return (
            <PageContentDefault 
                imgUrl={resultData.images.length > 0 ? resultData.images[0].url : false}
                title={resultData.name}
                type={resultData.album_type}
                subTitle={<>
                    {resultData.artists.map((artist, index) => (
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
                    ))}
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
                </>}
                contextMenu={contextMenu.album}
                renderPlay
                toId={id}
                isAlbum
            >
                <ContentFrame data={tracksData} songs isAlbum existHeader albumIdToList={id} 
                    titleForNextFrom={resultData.name}
                />
                <div className={cx('copyrights-label')}>
                    <span className={cx('release-time')}>{`${month} ${day}, ${year}`}</span>
                    {resultData.copyrights.map((item) => 
                        <span key={item.type}>
                            {`${item.type === 'P' ? '℗' : '©' } ${item.text}`}
                        </span>
                    )}
                </div>
            </PageContentDefault>
        );
    }
}

export default Album;