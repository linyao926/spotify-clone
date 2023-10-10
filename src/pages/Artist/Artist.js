import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { useParams } from 'react-router-dom';
import { ArtistIcon } from '~/assets/icons';
import PageContentDefault from '~/components/Layouts/PageContentDefault';
import ContentFrame from '~/components/Layouts/ContentFrame';
import classNames from 'classnames/bind';
import styles from './Artist.module.scss';

const cx = classNames.bind(styles);

function Artist({follow}) {
    const { 
        spotifyApi, 
        columnCount,
        contextMenu,
        setNowPlayingId,
        setNextQueueId,
    } = useContext(AppContext);
    const [id, setId] = useState(null);
    const [artistData, setArtistData] = useState(null);
    const [albumsData, setAlbumsData] = useState(null);
    const [topTracks, setTopTracks] = useState(null);
    const [appearsOn, setAppearsOn] = useState(null);
    const [relatedArtists, setRelatedArtists] = useState(null);
    const [hasData, setHasData] = useState(false);  

    const params = useParams();

    useEffect(() => {
        setId(params.id);
        setHasData(false);
    }, [params]);

    useEffect(() => {
        let isMounted = true;

        if (id) {
            async function loadData () {
                const [artist, tracks, albums, appears, related] =  await Promise.all([
                    spotifyApi.getArtist(id, {limit: columnCount})
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)),

                    spotifyApi.getArtistTopTracks(id, 'VN')
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)),

                    spotifyApi.getArtistAlbums(id, { 
                        include_groups: 'album,single',
                        limit: columnCount, 
                    })
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)),

                    spotifyApi.getArtistAlbums(id, { 
                        include_groups: 'appears_on',
                        limit: columnCount, 
                    })
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)),
                    
                    spotifyApi.getArtistRelatedArtists(id)
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)),
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

    
    if (hasData) {
        // console.log(artistData.images)
        return (
            <PageContentDefault 
                imgUrl={artistData.images.length > 0 ? artistData.images[0].url : false}
                rounded
                title={artistData.name}
                fallbackIcon={<ArtistIcon />}
                type='Artist'
                subTitle={artistData.followers.total 
                ? <span className={cx('header-total')}>
                    {`${Intl.NumberFormat().format(artistData.followers.total)} Follower`}
                </span> 
                : null}
                follow={follow}
                contextMenu={contextMenu.artist}
                renderPlay
                displayOption={false}
                toId={id}
            >
                <ContentFrame data={topTracks.tracks} headerTitle='Popular' songs isArtist toArtistId={id} titleForNextFrom={artistData.name} />
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
            </PageContentDefault>
        );
    }
}

export default Artist;