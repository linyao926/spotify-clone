import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { useParams, NavLink, Link } from 'react-router-dom';
import ContentFrame from '~/components/Layouts/ContentFrame';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';
import PageTurnBtn from '~/components/PageTurnBtn';
import classNames from 'classnames/bind';
import styles from './Genre.module.scss';

const cx = classNames.bind(styles);

function Genre() {
    const { spotifyApi, setNowPlayingId, setNextQueueId, } = useContext(AppContext);
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
                const [genre, playlists] =  await Promise.all([
                    spotifyApi.getCategory(id)
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)),
                    
                    spotifyApi.getCategoryPlaylists(id)
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
                    .catch((error) => console.log('Error', error))
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
    }, [id, offset]);
    // console.log(playlistsData)

    if (hasData) {

        return (
            <div className={cx('wrapper')}
                ref={ref}
            >
                <header className={cx('header')}>
                    <h1 className={cx('header-title')}>{genreData.name}</h1>
                </header>
                
                <ContentFrame data={playlistsData.playlists.items.filter((element, index) => {
                    if (index > 0) {
                        if (playlistsData.playlists.items[index].id !== playlistsData.playlists.items[index - 1].id) {
                            return element;
                        }
                    } else {
                        return element;
                    }
                })} normal isPlaylist />
                {pages > 1 && <PageTurnBtn 
                    pages={pages} 
                    setOffset={setOffset} 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />}
                <ContentFooter />
            </div>
        );
    }
}

export default Genre;