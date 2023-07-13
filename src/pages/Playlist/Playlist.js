import { extractColors } from 'extract-colors';
import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams, NavLink } from 'react-router-dom';
import { HeartIcon, DotsIcon, CardImgFallbackIcon, PersonIcon, CloseIcon } from '~/assets/icons';
import { BsFillPlayFill } from 'react-icons/bs';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import SearchForm from '~/components/SearchForm';
import Button from '~/components/Button';
import ContentFrame from '~/components/Layouts/ContentFrame';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';
import classNames from 'classnames/bind';
import styles from './Playlist.module.scss';

const cx = classNames.bind(styles);

function Playlist({myPlaylist}) {
    const {
        spotifyApi, 
        msToMinAndSeconds,
        convertMsToHM, 
        bgHeaderColor, 
        setBgHeaderColor, 
        handleGetValueInput,
        inputValue 
    } = useContext(AppContext);

    const [id, setId] = useState(null);
    const [playlistData, setPlaylistData] = useState(null);
    const [tracksData, setTracksData] = useState(null);
    const [creatorPlaylist, setCreatorPlaylist] = useState(null);
    const [hasData, setHasData] = useState(false);
    const [colors, setColors] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [pages, setPages] = useState(0);
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedPages, setDisplayedPages] = useState([]);
    const maxDisplayedPages = 7;

    const ref = useRef(null);
    const searchRef = useRef(null);
    const params = useParams();

    useEffect(() => {
        setId(params.id);
        setHasData(false);
    }, [params]);

    useEffect(() => {
        let isMounted = true;

        if (id) {
            
            async function loadData () {
                const [playlist, tracks, creator] =  await Promise.all([
                    spotifyApi.getPlaylist(id)
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)),
                    spotifyApi.getPlaylist(id)
                    .then(function(data) {
                        return data.tracks.total;
                    })
                    .then(function(total) {
                        let limit = 50;
                        let x = Math.floor(total/limit);
                        if (x * limit == total) {
                            setPages(x);
                        } else {
                            setPages(x + 1);
                        }
                        return spotifyApi.getPlaylistTracks(id, {
                            limit: limit,
                            offset: offset
                        })
                    })
                    .catch((error) => console.log('Error', error)),
                    spotifyApi.getPlaylist(id)
                    .then(function(data) {
                        return data.owner.id;
                    })
                    .then(function(id) {
                        return spotifyApi.getUser(id);
                    })
                    .catch((error) => console.log('Error', error))
                ])
                if (isMounted) {
                    setHasData(true);
                    setPlaylistData(playlist);
                    setTracksData(tracks);
                    setCreatorPlaylist(creator);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [id, offset]);
    // console.log(resultData)

    useEffect(() => {
        if (hasData) {
            if (playlistData.images.length > 0) {
                extractColors(playlistData.images[0].url, {crossOrigin: 'Anonymous'})
                .then(setColors)
                .catch(console.error);
            } else {
                setBgHeaderColor('rgb(83, 83, 83)')
            }
        }
    }, [hasData, id]);

    useEffect(() => {
        const filterColor = (arr) => {
            let temp = arr[0].intensity;
            let bgColor = arr[0].hex;
            for (let i = 1; i < arr.length; i++) {
                if (arr[i].intensity > temp) {
                    temp = arr[i].intensity;
                    bgColor = arr[i].hex;
                }
            }
            return bgColor;
        }
        if (colors) {
            const color = filterColor(colors);
            setBgHeaderColor(color);
        }
    }, [colors]);

    useEffect(() => {
        if (ref.current) {
            ref.current.style.setProperty('--background-noise', bgHeaderColor);
        }
    }, [ref.current, bgHeaderColor]);

    useEffect(() => {
        if (playlistData) {
            if (playlistData.tracks.items.length === 0) {
                setShowSearch(true);
            } else {
                setShowSearch(false);
            }
        }
    }, [playlistData]);

    useEffect (() => {
        const firstDisplayedPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
        const lastDisplayedPage = Math.min(pages, firstDisplayedPage + maxDisplayedPages - 1);
        setDisplayedPages(Array.from(
            { length: lastDisplayedPage - firstDisplayedPage + 1 },
            (_, index) => index + firstDisplayedPage
        ));
    }, [currentPage, pages]);

    if (hasData) {
        
        let totalTime = () => {
            let total = 0;
            for (let val of tracksData.items) {
                // console.log(val.track.duration_ms)
                total += val.track.duration_ms;            
            }
            return total;
        };

        return (
            <div className={cx('wrapper')}
                ref={ref}
            >
                <header className={cx('header')}>
                    {playlistData.images.length > 0 
                        ? <img src={playlistData.images[0].url} alt={`Image of ${playlistData.name} playlist`} className={cx('header-img')} />
                        : <div className={cx('header-img')}>
                            <CardImgFallbackIcon />
                        </div>
                    }
                    
                    <div className={cx('header-title')}>
                        <h5>Playlist</h5>
                        <h1>{playlistData.name}</h1>
                        {playlistData.description !== '' && 
                            <span className={cx('header-sub-title')}>
                                {playlistData.description}
                            </span>
                        }
                       <div className={cx('playlist-intro')}>
                         <div className={cx('header-creator-wrapper')}>
                             {creatorPlaylist.images.length > 0 
                                 ? <img src={creatorPlaylist.images[0].url} alt={`Image of ${creatorPlaylist.name}`} className={cx('creator-img')} /> 
                                 : <div className={cx('creator-img')}>
                                     <PersonIcon />
                                 </div>
                             }
                             <Link className={cx('header-creator')}
                                 to={`/user/${playlistData.owner.id} `}
                             >{playlistData.owner.display_name}</Link>
                         </div>
                         <span className={cx('header-total')}>
                             {playlistData.followers.total > 0 && ` • ${Intl.NumberFormat().format(playlistData.followers.total)} likes`}
                             {playlistData.tracks.total > 0 && ` • ${playlistData.tracks.total} songs, `}
                         </span>
                         {playlistData.tracks.total > 0 && <span className={cx('header-duration')}>about {totalTime() > 3599000 
                             ? convertMsToHM(totalTime()) 
                             : msToMinAndSeconds(totalTime())}
                         </span>}
                       </div>
                    </div>
                </header>
                <div className={cx('playlist-interact')}>
                    {!myPlaylist && <>
                        <Button primary rounded large className={cx('play-btn')}>
                            <BsFillPlayFill />
                        </Button>
                        <span className={cx('save-icon', 'tooltip')}>
                            <HeartIcon />
                            <span className={cx('tooltiptext')}>Save to Your Library</span>
                        </span>
                    </>}
                    <span className={cx('option-icon', 'tooltip')}>
                        <DotsIcon />
                        <span className={cx('tooltiptext')}>More option for {playlistData.name}</span>
                    </span>
                </div>
                {tracksData.items.length > 0 && <ContentFrame data={tracksData.items} songs isPlaylist />}
                {myPlaylist ? showSearch 
                    ? <div className={cx('wrapper-search-track')}>
                        <div className={cx('search-track')}>
                            <h4>Let's find something for your playlist</h4>
                            <SearchForm playlist 
                                placeholder={'Search for songs'}
                            />
                        </div>
                        <Button icon dark className={cx('close-search-btn')}
                            onClick={() => setShowSearch(false)}
                        >
                            <CloseIcon />
                        </Button>
                    </div>
                    : <div className={cx('show-search')}
                        onClick={() => setShowSearch(true)}
                    >Find more</div>
                : null}
                {inputValue.length > 0 && <div className={cx('search-result')}>
                    <h4>No results found for '{inputValue}'</h4>
                    <p>Please make sure your words are spelled correctly, or use fewer or different keywords.</p>
                </div>}

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

export default Playlist;