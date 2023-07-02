import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useLocation, useLoaderData, useNavigate } from 'react-router-dom';
import { BsFillPlayFill } from 'react-icons/bs';
import Button from '~/components/Button';
import ContentFrame from '~/components/Layouts/ContentFrame';
import classNames from 'classnames/bind';
import styles from './SubContent.module.scss';

const cx = classNames.bind(styles);

function SubContent({id = ''}) {
    const { 
        spotifyApi,  
        inputValue,
        typeSearch
    } = useContext(AppContext);

    const [resultData, setResultData] = useState(null);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        let isMounted = true;

        if (inputValue) {
            async function loadData () {
                const data =  await spotifyApi.search(inputValue, [typeSearch], {
                    limit: 30,
                })
                if (isMounted) {
                    setHasData(true);
                    setResultData(data);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [inputValue, typeSearch]);

    // const url = new URL(request.url);
    // const q = url.searchParams.get("q");

    // console.log(resultData)

    if (hasData) {
        switch (typeSearch) {
            case 'playlist':
                if (resultData.playlists) {
                    return <ContentFrame normal isPlaylist data={resultData.playlists.items} />
                }
            case 'artist':
                if (resultData.artists) {
                    return <ContentFrame normal isArtist data={resultData.artists.items} artist />
                }
            case 'album':
                if (resultData.albums) {
                    return <ContentFrame normal isAlbum data={resultData.albums.items} />
                }
            case 'track':
                if (resultData.tracks) {
                    return <ContentFrame data={resultData.tracks.items} songs songCol4 songSearch />
                }
        }
    }
}

export default SubContent;