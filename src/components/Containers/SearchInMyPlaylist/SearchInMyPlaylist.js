import { useContext, useState, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { AiOutlineLeft } from 'react-icons/ai';
import SearchResultItem from './SearchResultItem';
import Loading from '~/components/Blocks/Loading';
import classNames from 'classnames/bind';
import styles from './SearchInMyPlaylist.module.scss';

const cx = classNames.bind(styles);

function SearchInMyPlaylist() {
    const [resultData, setResultData] = useState(null);
    const [tracksData, setTracksData] = useState(null);
    const [albumsData, setAlbumsData] = useState(null);
    const [artistsData, setArtistsData] = useState(null);
    const [expandAlbumData, setExpandAlbumData] = useState(null);
    const [artistTopTracks, setArtistTopTracks] = useState(null);
    const [artistAlbums, setArtistAlbums] = useState(null);
    const [limit, setLimit] = useState(6);
    const [error, setError] = useState(true);
    const [hasData, setHasData] = useState(false);
    const [expand, setExpand] = useState(true);
    const [expandArtists, setExpandArtists] = useState(false);
    const [expandAlbums, setExpandAlbums] = useState(false);
    const [expandTracks, setExpandTracks] = useState(false);
    const [id, setId] = useState(null);
    const [headerTitle, setHeaderTitle] = useState(null);
    const [isArtist, setIsArtist] = useState(false);
    const [loading, setLoading] = useState(true);

    const { 
        spotifyApi, 
        setTokenError,
        myPlaylistPageInputValue,
        myPlaylistsData,
        setMyPlaylistsData,
        removeDuplicates,
        handleSaveItemToList,
    } = useContext(AppContext);

    const params = useParams();

    useEffect(() => {
        let isMounted = true;

        if (myPlaylistPageInputValue.length > 0) {
            async function loadData() {
                const data = await spotifyApi
                    .search(myPlaylistPageInputValue, ['album', 'artist', 'track'], {
                        limit: limit,
                    })
                    .then((data) => {
                        if (
                            data.albums.total === 0 &&
                            data.tracks.total === 0 &&
                            data.artists.total === 0
                        ) {
                            setError(true);
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
                    });
                if (isMounted) {
                    setResultData(data);
                    data.albums.total && setAlbumsData(data.albums);
                    data.artists.total && setArtistsData(data.artists);
                    data.tracks.total && setTracksData(data.tracks);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [myPlaylistPageInputValue, limit]);

    useEffect(() => {
        let isMounted = true;

        if (id) {
            async function loadData() {
                let album, topTracks, albums;
                if (isArtist) {
                    topTracks = await spotifyApi
                    .getArtistTopTracks(id, 'VN')
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error);
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                        setError(true);
                        setLoading(false);
                    });
                    albums = await spotifyApi.getArtistAlbums(id, { 
                        include_groups: 'album,single',
                        limit: 20, 
                    })
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error);
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                        setError(true);
                        setLoading(false);
                    });
                } else {
                    album = await spotifyApi
                    .getAlbum(id)
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error);
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                        setError(true);
                        setLoading(false);
                    });
                }
            
                if (isMounted) {
                    album && setExpandAlbumData(album);
                    topTracks && setArtistTopTracks(topTracks);
                    albums && setArtistAlbums(albums);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [id]);

    useEffect(() => {
        if (error) {
            setHasData(false);
        } else if (resultData && resultData !== 'undefined') {
            setHasData(true);
            setLoading(false);
        } else if (id && (expandAlbumData || artistAlbums)) {
            setHasData(true);
            setLoading(false);
        }
    }, [error, resultData, id]);

    const handleExpandSingleClick = (artist, title, id) => {
        setId(id);
        setHeaderTitle(title);
        setIsArtist(artist);
        setExpand(false);
    };

    const handleExpandAllClick = (func, title) => {
        setLimit(10);
        setExpand(false);
        func(true);
        setHeaderTitle(title);
    };

    const handleAddTrackClick = (id) => {
        let items = [...myPlaylistsData];
        let item = {...items[params.number - 1]};
        const date = new Date();
    
        item.tracks = removeDuplicates(handleSaveItemToList(item.tracks, id, date));
        items[params.number - 1] = item;
        setMyPlaylistsData(items);
    };

    const handleReturnClick = () => {
        setLimit(6);
        setId(null);
        setHeaderTitle(null);
        setIsArtist(false);
        setExpand(true);
        setExpandAlbums(false);
        setExpandArtists(false);
        setExpandTracks(false);
    };

    const displayName = (artistNames) => artistNames.map((artist, index) => (
        <div key={artist.id}
            className={cx('wrapper-song-artist')}
        >
            <Link 
                className={cx('song-artist')}
                to={`/artist/${artist.id}`}
            >
                {artist.name}
            </Link>
            {index !== artistNames.length - 1 && ', '}
        </div>
    ));

    const renderItem = (item) => {
        let col2 = false, isTrack = false, isArtist = false;
        let subTitle, album, toAlbumId, img, artistData;
        if (item.type === 'track') {
            isTrack = true;
            subTitle = displayName(item.artists);
            artistData = item.artists;
            if (item.album) {
                album = item.album.name;
                toAlbumId = item.album.id;
                img = item.album.images.length > 0 ? item.album.images[0].url : null;
            } else {
                img = expandAlbumData.images.length > 0 ? expandAlbumData.images[0].url : null;
                album = expandAlbumData.name;
                toAlbumId = expandAlbumData.id;
            }
        } else {
            col2 = true;
            subTitle = item.type;
            img = item.images.length > 0 ? item.images[0].url : null;

            if (item.type === 'artist') {
                isArtist = true;
            } 
        }

        return <SearchResultItem 
            key={item.id}
            isTrack={isTrack}
            isArtist={isArtist}
            col2={col2}
            img={img}
            title={item.name}
            subTitle={subTitle}
            album={album}
            toAlbumId={toAlbumId}
            toId={item.id}
            handleClickFunc={col2 ? handleExpandSingleClick : handleAddTrackClick}
            artistData={artistData}
        />
    };

    if (hasData) {
        return ( 
            <div className={cx('wrapper')}>
                {headerTitle && <header className={cx('header-title', 'return')}
                    onClick={handleReturnClick}
                >
                    <span><AiOutlineLeft /></span>
                    {headerTitle}
                </header>}
                {!expand && (isArtist ? <>
                    <section>
                        <header className={cx('header-title')}>
                            Popular songs
                        </header>
                        {artistTopTracks?.tracks.map((item) => renderItem(item))}
                    </section>
                    <section>
                        <header className={cx('header-title')}>
                            Albums
                        </header>
                        {artistAlbums?.items.map((item) => renderItem(item))}
                    </section>
                </>
                : expandAlbumData?.tracks.items.map((item) => renderItem(item)))}

                {!expand && (expandArtists && artistsData) && artistsData.total > 0 && artistsData.items.map(item => renderItem(item))}

                {!expand && (expandAlbums && albumsData) && albumsData.total > 0 && albumsData.items.map(item => renderItem(item))}

                {!expand && (expandTracks && tracksData) && tracksData.total > 0 && tracksData.items.map(item => renderItem(item))}
                
                {expand && <>
                    {tracksData && tracksData.total > 0 && tracksData.items.map((item) => renderItem(item))}
                    {albumsData && albumsData.total > 0 && albumsData.items.map((item, index) => {
                        if (index < 2) {
                            return renderItem(item);
                        }
                    })}
                    {artistsData && artistsData.total > 0 && artistsData.items.map((item, index) => {
                        if (index < 2) {
                            return renderItem(item);
                        }
                    })}
                    <SearchResultItem 
                        isExpand 
                        expandFunc={setExpandArtists} 
                        title='See all artists' 
                        handleClickFunc={handleExpandAllClick}
                    />
                    <SearchResultItem 
                        isExpand 
                        expandFunc={setExpandAlbums} 
                        title='See all albums' 
                        handleClickFunc={handleExpandAllClick}
                    />
                    <SearchResultItem 
                        isExpand 
                        expandFunc={setExpandTracks} 
                        title='See all songs' 
                        handleClickFunc={handleExpandAllClick}
                    />
                </>}
            </div>
        );
    } else if (loading) {
        return (<Loading />)
    } else if (error) {
        return <div className={cx('not-found')}>
            <h4>No results found for '{myPlaylistPageInputValue}'</h4>
            <p>Please make sure your words are spelled correctly, or use fewer or different keywords.</p>
        </div>
    } 
}

export default SearchInMyPlaylist;