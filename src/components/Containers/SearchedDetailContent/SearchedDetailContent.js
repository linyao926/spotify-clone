import { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '~/context/AppContext';
import Segment from '../Segment';
import Loading from '~/components/Blocks/Loading';
import MobileCardItem from '~/components/Blocks/MobileCardItem';
import classNames from 'classnames/bind';
import styles from './SearchedDetailContent.module.scss';

const cx = classNames.bind(styles);

function SearchedDetailContent() {
    const { spotifyApi, setTokenError, searchPageInputValue, typeSearch, smallerWidth } = useContext(AppContext);

    const { pathname } = useLocation();

    const [resultData, setResultData] = useState(null);
    const [hasData, setHasData] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setHasData(false);
    }, [pathname]);

    useEffect(() => {
        if (!hasData) {   
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [hasData])

    useEffect(() => {
        let isMounted = true;

        if (searchPageInputValue) {
            async function loadData() {
                const data = await spotifyApi.search(searchPageInputValue, [typeSearch], {
                    limit: 30,
                })
                .then(data => data)
                .catch((error) => {
                    console.log('Error', error)
                    if (error.status === 401) {
                        setTokenError(true);
                    }
                    setLoading(false);
                });
                if (isMounted) {
                    setHasData(true);
                    setResultData(data);
                    setLoading(false);
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, [searchPageInputValue, typeSearch, hasData]);

    const renderItem = (data) => {
        return data.map((item) => {
            let isTrack, artists, img, albumId; 

            if (item.type === 'track' || item.type === 'album') {
                artists = item.artists;
            } else {
                artists = false;
            }

            if (item.type === 'track') {
                isTrack = true;
                img = item.album.images[0].url;
                albumId = item.album.id;
            } else {
                isTrack = false;
                img = item.images[0]?.url;
                albumId = false;
            }

            return (
                <MobileCardItem 
                    isTrack={isTrack}
                    key={item.id}
                    img={img}
                    title={item.name}
                    type={item.type}
                    artistsData={artists}
                    toId={item.id}
                    albumId={albumId}
                />
            )
        })
    }

    if (hasData) {
        switch (typeSearch) {
            case 'playlist':
                if (resultData.playlists) {
                    return smallerWidth 
                        ? renderItem(resultData.playlists.items) 
                        : <Segment normal isPlaylist data={resultData.playlists.items} />;
                }
            case 'artist':
                if (resultData.artists) {
                    return smallerWidth 
                        ? renderItem(resultData.artists.items) 
                        : <Segment normal isArtist data={resultData.artists.items} artist />;
                }
            case 'album':
                if (resultData.albums) {
                    return smallerWidth 
                        ? renderItem(resultData.albums.items) 
                        : <Segment normal isAlbum data={resultData.albums.items} />;
                }
            case 'track':
                if (resultData.tracks) {
                    return smallerWidth 
                        ? renderItem(resultData.tracks.items) 
                        : <Segment data={resultData.tracks.items} 
                            songs songCol4 songSearch 
                            columnHeader
                            colHeaderIndex
                            colHeaderTitle
                            colHeaderAlbum
                            colHeaderDuration
                        />;
                }
        }
    } else if (loading) {
        return (<Loading 
            height='calc(100vh - 120px - 125px)'
        />)
    } 
}

export default SearchedDetailContent;
