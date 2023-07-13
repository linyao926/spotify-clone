import { useContext, useState, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Outlet } from 'react-router-dom';
import ContentFrame from '~/components/Layouts/ContentFrame';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';
import classNames from 'classnames/bind';
import styles from './MainSearch.module.scss';

const cx = classNames.bind(styles); 

function MainSearch() {
    const { 
        spotifyApi,  
        inputValue,
        columnCount,
        typeSearch
    } = useContext(AppContext);

    const [resultData, setResultData] = useState([]);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        let isMounted = true;

        if (inputValue) {
            async function loadData () {
                const data =  await spotifyApi.search(inputValue, [
                    'album', 
                    'artist', 
                    'playlist', 
                    'track'
                ], {
                    limit: columnCount
                })
                if (isMounted) {
                    setHasData(true);
                    setResultData(data)
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [inputValue, columnCount]);

    if (hasData) {
        return ( 
            <div className={cx('wrapper')}>
                {typeSearch === '' ? <>
                        <div className={cx('result-top-content')}>
                        <ContentFrame data={resultData.playlists.items[0]} searchAll headerTitle='Top result' />
                        <ContentFrame data={resultData.tracks.items} songs searchAll headerTitle='Songs' />
                        </div>
                        <ContentFrame normal isArtist data={resultData.artists.items} artist headerTitle='Artists' />
                        <ContentFrame normal isAlbum data={resultData.albums.items} headerTitle='Albums' />
                        <ContentFrame normal isPlaylist data={resultData.playlists.items} headerTitle='Playlists' />
                    </>
                    : <Outlet />    
                }
                <ContentFooter />
            </div>
        );
    }
}

export default MainSearch;