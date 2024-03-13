import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { useParams } from 'react-router-dom';
import { ArtistIcon } from '~/assets/icons';
import PageContentLayout from '~/components/Layouts/PageContentLayout';
import Segment from '~/components/Containers/Segment';
import classNames from 'classnames/bind';
import styles from './Artist.module.scss';

const cx = classNames.bind(styles);

function Artist() {
    const { 
        spotifyApi, 
        columnCount,
        contextMenu,
        libraryArtistIds,
        setNowPlayingId,
        setNextQueueId,
        checkItemLiked,
    } = useContext(AppContext);
    const [id, setId] = useState(null);
    const [artistData, setArtistData] = useState(null);
    const [albumsData, setAlbumsData] = useState(null);
    const [topTracks, setTopTracks] = useState(null);
    const [appearsOn, setAppearsOn] = useState(null);
    const [relatedArtists, setRelatedArtists] = useState(null);
    const [hasData, setHasData] = useState(false);  
    const [following, setFollowing] = useState(false);

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

                // console.log(related)

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

    useEffect(() => {
        checkItemLiked(libraryArtistIds, id, setFollowing)
    }, [id, libraryArtistIds]);
    
    if (hasData) {
        // console.log(artistData.images)
        return (
            <PageContentLayout 
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
                follow={following}
                contextMenu={contextMenu.artist}
                renderPlay
                displayOption={false}
                toId={id}
            >
                <Segment data={topTracks.tracks} headerTitle='Popular' songs isArtist 
                    toArtistId={id} titleForNextFrom={artistData.name} 
                    colHeaderIndex
                    colHeaderTitle
                    colHeaderDuration
                />
                <Segment normal isAlbum 
                    data={albumsData.items} 
                    headerTitle='Discography' 
                    showAll={albumsData.total > columnCount}  
                    type='discography'
                />
                {relatedArtists.artists.length > 0 && <Segment normal isArtist 
                    data={relatedArtists.artists.filter((e, index) => index < columnCount)} 
                    headerTitle={`Fans also like`} 
                    showAll
                    type='related'
                />}
                {/* {console.log(appearsOn.items)} */}
                {appearsOn.total > 0 && <Segment normal isAlbum data={appearsOn.items} 
                    headerTitle='Appears On' 
                    showAll={appearsOn.total > columnCount} 
                    type='appears_on'
                />}
            </PageContentLayout>
        );
    }
}

export default Artist;