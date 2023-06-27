import { extractColors } from 'extract-colors';
import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useLocation } from 'react-router-dom';
import { HeartIcon, DotsIcon } from '~/assets/icons';
import { BsFillPlayFill } from 'react-icons/bs';
import Button from '~/components/Button';
import ContentFrame from '~/components/Layouts/ContentFrame';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';
import classNames from 'classnames/bind';
import styles from './Genre.module.scss';

const cx = classNames.bind(styles);

function Genre() {
    const { isLogin, spotifyApi } = useContext(AppContext);
    const [id, setId] = useState(null);
    const [genreData, setGenreData] = useState([]);
    const [playlistsData, setPlaylistsData] = useState([]);
    const [hasData, setHasData] = useState(false);

    const ref = useRef(null);
    const {pathname} = useLocation();

    useEffect(() => {
        const indexStart = pathname.indexOf('/', 1) + 1;
        setId(pathname.slice(indexStart))
    }, [pathname]);

    useEffect(() => {
        let isMounted = true;

        if (id) {
            
            async function loadData () {
                const [genre, playlists] =  await Promise.all([
                    spotifyApi.getCategory(id),
                    spotifyApi.getCategoryPlaylists(id)
                ])
                if (isMounted) {
                    setHasData(true);
                    setGenreData(genre);
                    setPlaylistsData(playlists);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [id]);
    // console.log(playlistsData)

    if (hasData) {

        return (
            <div className={cx('wrapper')}
                ref={ref}
            >
                <header className={cx('header')}>
                    <h1 className={cx('header-title')}>{genreData.name}</h1>
                </header>
                
                <ContentFrame data={playlistsData.playlists.items} normal isPlaylist showAll />
                <ContentFooter />
            </div>
        );
    }
}

export default Genre;