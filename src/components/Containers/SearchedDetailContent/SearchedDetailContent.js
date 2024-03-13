import { useContext, useState, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import Segment from '../Segment';
import classNames from 'classnames/bind';
import styles from './SearchedDetailContent.module.scss';

const cx = classNames.bind(styles);

function SearchedDetailContent() {
    const { spotifyApi, searchPageInputValue, typeSearch, containerWidth } = useContext(AppContext);

    const [resultData, setResultData] = useState(null);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        let isMounted = true;

        if (searchPageInputValue) {
            async function loadData() {
                const data = await spotifyApi.search(searchPageInputValue, [typeSearch], {
                    limit: 30,
                });
                if (isMounted) {
                    setHasData(true);
                    setResultData(data);
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, [searchPageInputValue, typeSearch]);

    if (hasData) {
        switch (typeSearch) {
            case 'playlist':
                if (resultData.playlists) {
                    return <Segment normal isPlaylist data={resultData.playlists.items} />;
                }
            case 'artist':
                if (resultData.artists) {
                    return <Segment normal isArtist data={resultData.artists.items} artist />;
                }
            case 'album':
                if (resultData.albums) {
                    return <Segment normal isAlbum data={resultData.albums.items} />;
                }
            case 'track':
                if (resultData.tracks) {
                    return <Segment data={resultData.tracks.items} 
                        songs songCol4 songSearch 
                        columnHeader
                        colHeaderIndex
                        colHeaderTitle
                        colHeaderAlbum
                        colHeaderDuration
                    />;
                }
        }
    }
}

export default SearchedDetailContent;
