import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { useParams, NavLink, Link } from 'react-router-dom';
import Segment from '~/components/Containers/Segment';
import MainFooter from '~/components/Blocks/MainFooter';
import PageTurnBtn from '~/components/Blocks/Buttons/PageTurnBtn';
import classNames from 'classnames/bind';
import styles from './Genre.module.scss';

const cx = classNames.bind(styles);

function Genre() {
    const { spotifyApi, setNowPlayingId, setNextQueueId, removeDuplicates} = useContext(AppContext);
    const [id, setId] = useState(null);
    const [genreData, setGenreData] = useState([]);
    const [playlistsData, setPlaylistsData] = useState([]);
    const [hasData, setHasData] = useState(false);
    const [pages, setPages] = useState(0);
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const ref = useRef(null);
    const params = useParams();

    useEffect(() => {
        setId(params.id);
        setHasData(false);
    }, [params]);

    useEffect(() => {
        let isMounted = true;

        if (id) {
            
            async function loadData () {
                const playlists =  await spotifyApi.getCategoryPlaylists(id)
                .then((data) => data.playlists.total)
                .then((total) => {
                    const limit = 30;
                    let x = Math.floor(total/limit);
                    if (x * limit == total) {
                        setPages(x);
                    } else {
                        setPages(x + 1);
                    }
                    return spotifyApi.getCategoryPlaylists(id, {
                        limit: limit,
                        offset: offset
                    })
                })
                .catch((error) => console.log('Error', error));

                if (isMounted) {
                    setHasData(true);
                    setPlaylistsData(playlists);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [id, offset]);
    // console.log(playlistsData)

    if (hasData) {

        return (
            <div className={cx('wrapper')}
                ref={ref}
            >
                <header className={cx('header')}>
                    <h1 className={cx('header-title')}>{playlistsData.message}</h1>
                </header>
                
                <Segment data={removeDuplicates(playlistsData.playlists.items, 'object', 'id')} normal isPlaylist />
                {pages > 1 && <PageTurnBtn 
                    pages={pages} 
                    setOffset={setOffset} 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />}
                <MainFooter />
            </div>
        );
    }
}

export default Genre;