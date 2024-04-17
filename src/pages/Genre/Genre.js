import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { useParams } from 'react-router-dom';
import Segment from '~/components/Containers/Segment';
import Loading from '~/components/Blocks/Loading';
import MainFooter from '~/components/Blocks/MainFooter';
import PageTurnBtn from '~/components/Blocks/Buttons/PageTurnBtn';
import classNames from 'classnames/bind';
import styles from './Genre.module.scss';

const cx = classNames.bind(styles);

function Genre() {
    const { spotifyApi, setTokenError, removeDuplicates, getData} = useContext(AppContext);

    const [id, setId] = useState(null);
    const [headerTitle, setHeaderTitle] = useState('');
    const [playlistsData, setPlaylistsData] = useState([]);
    const [hasData, setHasData] = useState(false);
    const [pages, setPages] = useState(0);
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const ref = useRef(null);
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
                const playlistsId =  await spotifyApi.getCategoryPlaylists(id)
                .then((data) => {
                    setHeaderTitle(data.message);
                    return data.playlists.total;
                })
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
                    .then((data) => data.playlists.items.map(item => item.id))
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });
                })
                .catch((error) => {
                    console.log('Error', error)
                    if (error.status === 401) {
                        setTokenError(true);
                    }
                });

                const playlists = await Promise.all(
                    playlistsId.map((id) => getData(spotifyApi.getPlaylist, id))
                );

                if (isMounted) {
                    setHasData(true);
                    setPlaylistsData(playlists);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [id, offset]);

    if (hasData) {

        return (
            <div className={cx('wrapper')}
                ref={ref}
            >
                <header className={cx('header')}>
                    <h1 className={cx('header-title')}>{headerTitle}</h1>
                </header>
                
                <Segment data={removeDuplicates(playlistsData, 'object', 'id')} normal isPlaylist notSwip isGenre />
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