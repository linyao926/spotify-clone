import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { useParams } from 'react-router-dom';
import { ArtistIcon } from '~/assets/icons';
import PageContentLayout from '~/components/Layouts/PageContentLayout';
import PageContentMobileLayout from '~/components/Layouts/PageContentMobileLayout';
import Segment from '~/components/Containers/Segment';
import classNames from 'classnames/bind';
import styles from './Artist.module.scss';

const cx = classNames.bind(styles);

function Artist() {
    const { 
        spotifyApi, 
        setTokenError,
        columnCount,
        contextMenu,
        libraryArtistIds,
        checkItemLiked,
        smallerWidth,
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
    }, [params]);

    useEffect(() => {
        setHasData(false);
    }, [id]);

    useEffect(() => {
        let isMounted = true;

        if (id) {
            async function loadData () {
                const [artist, tracks, albums, appears, related] =  await Promise.all([
                    spotifyApi.getArtist(id, {limit: smallerWidth ? 10 : columnCount})
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    }),

                    spotifyApi.getArtistTopTracks(id, 'VN')
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    }),

                    spotifyApi.getArtistAlbums(id, { 
                        include_groups: 'album,single',
                        limit: smallerWidth ? 10 : columnCount, 
                    })
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    }),

                    spotifyApi.getArtistAlbums(id, { 
                        include_groups: 'appears_on',
                        limit: smallerWidth ? 10 : columnCount, 
                    })
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    }),
                    
                    spotifyApi.getArtistRelatedArtists(id)
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    }),
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
    }, [id, columnCount, smallerWidth]);

    useEffect(() => {
        checkItemLiked(libraryArtistIds, id, setFollowing)
    }, [id, libraryArtistIds]);
    
    if (hasData) {
        // console.log(artistData.images)
        return (
            smallerWidth ? (
                <PageContentMobileLayout
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
                    contextMenu={contextMenu['mobile-artist']}
                    renderPlay
                    displayOption={false}
                    toId={id}
                >
                    {topTracks && topTracks.tracks.length > 0 && <Segment data={topTracks.tracks} headerTitle='Popular' songs isArtist 
                        toArtistId={id} titleForNextFrom={artistData.name} 
                        colHeaderIndex
                        colHeaderTitle
                        colHeaderDuration
                    />}
                    {albumsData && albumsData.items.length > 0 && <Segment normal isAlbum 
                        data={albumsData.items} 
                        headerTitle='Discography' 
                        showAll={albumsData.total > columnCount}  
                        type='discography'
                    />}
                    {relatedArtists.artists.length > 0 && <Segment normal isArtist 
                        data={relatedArtists.artists.filter((e, index) => {
                            if (smallerWidth) {
                                return index < 10;
                            } else {
                                return index < columnCount;
                            }
                        })} 
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
                </PageContentMobileLayout>
            ) : (<PageContentLayout 
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
                loading={false}
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
        ));
    }
}

export default Artist;