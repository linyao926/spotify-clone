import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { useParams, NavLink, Link } from 'react-router-dom';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import ContentFrame from '~/components/Layouts/ContentFrame';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';
import classNames from 'classnames/bind';
import styles from './Genre.module.scss';

const cx = classNames.bind(styles);

function Genre() {
    const { spotifyApi } = useContext(AppContext);
    const [id, setId] = useState(null);
    const [genreData, setGenreData] = useState([]);
    const [playlistsData, setPlaylistsData] = useState([]);
    const [hasData, setHasData] = useState(false);
    const [pages, setPages] = useState(0);
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedPages, setDisplayedPages] = useState([]);
    const maxDisplayedPages = 7;

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
                    spotifyApi.getCategory(id),
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

    useEffect (() => {
        const firstDisplayedPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
        const lastDisplayedPage = Math.min(pages, firstDisplayedPage + maxDisplayedPages - 1);
        setDisplayedPages(Array.from(
            { length: lastDisplayedPage - firstDisplayedPage + 1 },
            (_, index) => index + firstDisplayedPage
        ));
    }, [currentPage, pages]);

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
                {pages > 1 && <div className={cx('pages')}>
                {currentPage > 1 && 
                        <Link
                            className={cx('page-btn')}
                            onClick={() => {
                                setOffset((currentPage - 2) * 30)
                                setCurrentPage(currentPage - 1)
                            }}
                            to={currentPage - 1 > 1 ? `page=${currentPage - 1}` : ``}
                        >
                            <AiOutlineLeft />
                        </Link>
                    }
                    {displayedPages.map(page => (
                        <NavLink key={page}
                            className={({isActive}) => cx('page-btn', isActive && 'active')}
                            onClick={(event) => {
                                if (currentPage === page) {
                                    event.preventDefault();
                                } else {
                                    setOffset((page - 1) * 30)
                                    setCurrentPage(page)
                                }
                            }}
                            to={page > 1 ? `page=${page}` : ``}
                            end
                        >
                            {page}
                        </NavLink>
                    ))}
                    {currentPage < pages && 
                        <Link
                            className={cx('page-btn')}
                            onClick={() => {
                                setOffset((currentPage) * 30)
                                setCurrentPage(currentPage + 1)
                            }}
                            to={`page=${currentPage + 1}`}
                        >
                            <AiOutlineRight />
                        </Link>
                    }
                </div>} 
                <ContentFooter />
            </div>
        );
    }
}

export default Genre;