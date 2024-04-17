import { useContext, useState, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import Segment from '~/components/Containers/Segment';
import SearchForm from '~/components/Blocks/SearchForm';
import Loading from '~/components/Blocks/Loading';
import MainFooter from '~/components/Blocks/MainFooter';
import MobileCardItem from '~/components/Blocks/MobileCardItem';
import classNames from 'classnames/bind';
import styles from './SearchedContent.module.scss';

const cx = classNames.bind(styles);

function SearchedContent() {
    const { 
        spotifyApi, 
        setTokenError,
        searchPageInputValue, 
        columnCount, 
        typeSearch, 
        containerWidth, 
        getSearchTopResult, 
        smallerWidth,
        setSearchPageInputValue,  
        setTypeSearch,
    } = useContext(AppContext);

    const [resultData, setResultData] = useState(null);
    const [error, setError] = useState(true);
    const [hasData, setHasData] = useState(false);
    const [topResult, setTopResult] = useState(null);
    const [loading, setLoading] = useState(true);

    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        if (searchPageInputValue) {
            async function loadData() {
                const data = await spotifyApi
                    .search(searchPageInputValue, ['album', 'artist', 'playlist', 'track'], {
                        limit: 10,
                    })
                    .then((data) => {
                        if (
                            data.albums.total === 0 &&
                            data.playlists.total === 0 &&
                            data.tracks.total === 0 &&
                            data.artists.total === 0
                        ) {
                            setError(true);
                            setLoading(false);
                        } else {
                            setError(false);
                            return data;
                        }
                    })
                    .catch((error) => {
                        console.log('Error', error);
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                        setError(true);
                        setLoading(false);
                    });
                if (isMounted) {
                    if (
                        data.albums.total > 0 &&
                        data.playlists.total > 0 &&
                        data.tracks.total > 0 &&
                        data.artists.total > 0
                    ) {
                        setTopResult(getSearchTopResult(data.tracks.items[0], data.artists.items[0], data.albums.items[0], data.playlists.items[0], searchPageInputValue))
                    }
                    setResultData(data);
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, [searchPageInputValue]);

    useEffect(() => {
        if (error) {
            setHasData(false);
        } else if (resultData && resultData !== 'undefined') {
            setHasData(true);
            setLoading(false);
        }
    }, [error, resultData]);

    const types = ['artist', 'track', 'playlist', 'album'];

    const renderItem = (data) => {
        return data.map((item, index) => {
            if (index < 5) {
                let isTrack, artists, img, albumId; 

                if (item.type === 'track' || item.type === 'album') {
                    artists = item.artists;
                } else {
                    artists = false;
                }

                if (item.type === 'track') {
                    isTrack = true;
                    img = item.album.images ? item.album.images[0].url : false;
                    albumId = item.album.id;
                } else {
                    isTrack = false;
                    img = item.images[0] ? item.images[0].url : false;
                    albumId = false;
                }

                return (
                    <MobileCardItem 
                        isTrack={isTrack}
                        key={item.id}
                        img={img}
                        title={item.name}
                        type={item.type}
                        artistsData={artists}
                        toId={item.id}
                        albumId={albumId}
                    />
                )
            }
        })
    }

    if (hasData) {
        return (
            smallerWidth ? (
                <div className={cx('wrapper')}>
                    <div className={cx('header')}>
                        <div className={cx('wrapper-input')}>
                            <div className={cx('icon-link')}
                                onClick={() => {
                                    if (typeSearch !== '' && pathname.includes(typeSearch)) {
                                        setTypeSearch('');
                                        navigate(`/search/${searchPageInputValue}`)
                                    } else {
                                        setSearchPageInputValue('');
                                    }
                                }}
                            >
                                <HiArrowLeft />
                            </div>
                            <SearchForm 
                                searchPageSmallerWidth={true} 
                                placeholder={'What do you want to listen to?'} 
                                setFunc={setSearchPageInputValue}
                                inputValue={searchPageInputValue}
                                isFocusInput={true}
                            />
                        </div>
                        <div className={cx('navigation')}>
                            {types.map((item) => {
                                return (
                                    <NavLink
                                        className={({ isActive }) => cx('navigation-btn', isActive && 'active')}
                                        key={item}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setTypeSearch(item);
                                        }}
                                        to={`/search/${searchPageInputValue}/${item}`}
                                        end
                                    >
                                        {item !== 'track' ? `${item}s` : 'songs'}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                    {(typeSearch !== '' && pathname.includes(typeSearch)) ? <Outlet /> : <div className={cx('result-content')}>
                        {resultData.tracks && resultData.tracks.total > 0 && 
                            renderItem(resultData.tracks.items)
                        }
                        {resultData.artists && resultData.artists.total > 0 && 
                            renderItem(resultData.artists.items)
                        }
                        {resultData.albums && resultData.albums.total > 0 && 
                            renderItem(resultData.albums.items)
                        }
                        {resultData.playlists && resultData.playlists.total > 0 && 
                            renderItem(resultData.playlists.items)
                        } 
                    </div>}
                </div>
            ) : (
                <div className={cx('wrapper')}>
                    {typeSearch === '' ? (
                        <>
                            <div className={cx('result-top-content')}
                                style={{
                                    width: `${containerWidth}px`,
                                    flexWrap: containerWidth < 825 ? 'wrap' : 'nowrap',
                                }}
                            >
                                {topResult && (
                                    <Segment data={topResult} searchAll headerTitle="Top result" />
                                )}
                                {resultData.tracks && resultData.tracks.total > 0 && (
                                    <Segment data={resultData.tracks.items.filter((item, index) => index < 4)} songs searchAll 
                                        headerTitle="Songs" 
                                        colHeaderDuration
                                    />
                                )}
                            </div>
                            {resultData.artists && resultData.artists.total > 0 && (
                                <Segment
                                    normal
                                    isArtist
                                    data={resultData.artists.items.filter((item, index) => index < columnCount)}
                                    artist
                                    headerTitle="Artists"
                                />
                            )}
                            {resultData.albums && resultData.albums.total > 0 && (
                                <Segment normal isAlbum data={resultData.albums.items.filter((item, index) => index < columnCount)} headerTitle="Albums" />
                            )}
                            {resultData.playlists && resultData.playlists.total > 0 && (
                                <Segment normal isPlaylist data={resultData.playlists.items.filter((item, index) => index < columnCount)} headerTitle="Playlists" />
                            )}
                        </>
                    ) : (
                        <Outlet />
                    )}
                    <MainFooter />
                </div>
        ));
    } else if (loading) {
        return (<Loading 
            height={smallerWidth ? '100%' : '78%'}
        />)
    } else if (error) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('not-found')}>
                    <h4>No results found for '{searchPageInputValue}'</h4>
                    <p>Please make sure your words are spelled correctly, or use fewer or different keywords.</p>
                </div>
                <MainFooter />
            </div>
        );
    }
}

export default SearchedContent;
