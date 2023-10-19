import { useContext, useState, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import ContentFrame from '~/components/Layouts/ContentFrame';
import classNames from 'classnames/bind';
import styles from './SubSearch.module.scss';

const cx = classNames.bind(styles);

function SubSearch() {
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
                    return <ContentFrame normal isPlaylist data={resultData.playlists.items} />;
                }
            case 'artist':
                if (resultData.artists) {
                    return <ContentFrame normal isArtist data={resultData.artists.items} artist />;
                }
            case 'album':
                if (resultData.albums) {
                    return <ContentFrame normal isAlbum data={resultData.albums.items} />;
                }
            case 'track':
                if (resultData.tracks) {
                    return <ContentFrame data={resultData.tracks.items} 
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

export default SubSearch;
