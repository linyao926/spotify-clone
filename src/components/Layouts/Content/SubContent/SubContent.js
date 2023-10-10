import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { useParams, NavLink, Link, generatePath } from 'react-router-dom';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import ContentFrame from '~/components/Layouts/ContentFrame';
import PageTurnBtn from '~/components/PageTurnBtn';
import classNames from 'classnames/bind';
import styles from './SubContent.module.scss';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';

const cx = classNames.bind(styles);

function SubContent() {
    const { 
        spotifyApi,  
    } = useContext(AppContext);

    const [id, setId] = useState(null);
    const [type, setType] = useState(null);
    const [resultData, setResultData] = useState(null);
    const [hasData, setHasData] = useState(false);
    const [dynamicPath, setDynamicPath] = useState('/:subType/:pageNumber?');
    const [pages, setPages] = useState(0);
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedPages, setDisplayedPages] = useState([]);
    const maxDisplayedPages = 7;

    const params = useParams();

    useEffect(() => {
        if (pages === 0) {
            setId(params.id);
            setType(params.subType);
        } 
        setHasData(false);
    }, [params, pages]);

    useEffect(() => {
        if (id) {
            setDynamicPath('/:type?/:id?/:subType/:pageNumber?')
        } else {
            setDynamicPath('/:subType/:pageNumber?')
        }
    }, [id]);

    const handlePageNumber = (total, limit) => {
        let x = Math.floor(total/limit);
        if (x * limit == total) {
            setPages(x);
        } else {
            setPages(x + 1);
        }
    };

    useEffect(() => {
        let isMounted = true;
        if (type) {
            async function loadData () {
                let data;
                const limit = 30;
                switch (type) {
                    case 'related':
                        data =  await spotifyApi.getArtistRelatedArtists(id)
                        .then((data) => data)
                        .catch((error) => console.log('Error', error));
                        break;
                    case 'appears_on':
                        data =  await spotifyApi.getArtistAlbums(id, { 
                            include_groups: 'appears_on', 
                        })
                        .then((data) => data.total)
                        .then((total) => {
                            handlePageNumber(total, limit);
                            return spotifyApi.getArtistAlbums(id, {
                                include_groups: 'appears_on',
                                limit: limit,
                                offset: offset
                            });
                        })
                        .catch((error) => console.log('Error', error));
                        break;
                    case 'top-tracks':
                        data = await spotifyApi.getMyTopTracks({limit: 30})
                        .then((data) => data)
                        .catch((error) => console.log('Error', error));
                        break;
                    case 'playlists':
                        data = await spotifyApi.getUserPlaylists(id)
                        .then((data) => data)
                        .catch((error) => console.log('Error', error));
                        break;
                    case 'following' :
                        data = await spotifyApi.getFollowedArtists()
                        .then((data) => data)
                        .catch((error) => console.log('Error', error));
                        break;
                    case 'discography':
                        data = await spotifyApi.getArtistAlbums(id, { 
                            include_groups: 'album,single,compilation',
                        })
                        .then((data) => data.total)
                        .then((total) => {
                            handlePageNumber(total, limit);
                            return spotifyApi.getArtistAlbums(id, {
                                include_groups: 'album,single,compilation',
                                limit: limit,
                                offset: offset
                            });
                        })
                        .catch((error) => console.log('Error', error));
                        break;
                    case 'recently':
                        data = await spotifyApi.getMyRecentlyPlayedTracks()
                        .then((data) => data.total)
                        .then((total) => {
                            handlePageNumber(total, limit);
                            return spotifyApi.getMyRecentlyPlayedTracks({
                                limit: limit,
                                offset: offset
                            });
                        })
                        .catch((error) => console.log('Error', error));
                        break;
                    case 'top-artists':
                        data = await spotifyApi.getMyTopArtists()
                        .then((data) => data.total)
                        .then((total) => {
                            handlePageNumber(total, limit);
                            return spotifyApi.getMyTopArtists({
                                limit: limit,
                                offset: offset
                            });
                        })
                        .catch((error) => console.log('Error', error));
                        break;
                    case 'featured':
                        data = await spotifyApi.getFeaturedPlaylists()
                        .then((data) => data.playlists.total)
                        .then((total) => {
                            handlePageNumber(total, limit);
                            return spotifyApi.getFeaturedPlaylists({
                                limit: limit,
                                offset: offset
                            });
                        })
                        .catch((error) => console.log('Error', error));
                        break;
                    case 'new-releases':
                        data = await spotifyApi.getNewReleases()
                        .then((data) => data.albums.total)
                        .then((total) => {
                            handlePageNumber(total, limit);
                            return spotifyApi.getNewReleases({
                                limit: limit,
                                offset: offset
                            });
                        })
                        .catch((error) => console.log('Error', error));
                        break;
                }

                if (isMounted) {
                    setHasData(true);
                    setResultData(data);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [id, type, offset]);

    const handlePath = (page) => {
        let path;
        if (params.id) {
            page > 1 ? path = generatePath(dynamicPath, { 
                type: params.type,
                id: params.id,
                subType: type,
                pageNumber: `page=${page}`
            }) : path = generatePath(dynamicPath, { 
                type: params.type,
                id: params.id,
                subType: type,
                pageNumber: ``
            })
        } else {
            page > 1 ? path = generatePath(dynamicPath, { 
                subType: type,
                pageNumber: `page=${page}`
            }) : path = generatePath(dynamicPath, {
                subType: type, 
                pageNumber: ``
            })
        }

        return path;
    };

    if (hasData) {
        let content;

        switch (type) {
            case 'related':
                if (resultData.artists) {
                    content = (<ContentFrame normal isArtist 
                        data={resultData.artists} 
                        headerTitle={`Fans also like`} 
                    />)
                }
                break;
            case 'appears_on':
                if (resultData.items) {
                    content = <ContentFrame normal isAlbum data={resultData.items} headerTitle='Appears On' />
                }
                break;
            case 'top-tracks':
                if (resultData.items) {
                    content = <ContentFrame data={resultData.items} 
                        songs songCol4 
                        headerTitle='Top tracks this month'
                        currentUser
                    />
                }
                break;
            case 'playlists':
                if (resultData) {
                    content = <ContentFrame 
                        myPlaylist
                        isPlaylist 
                        normal 
                        data={resultData.items.filter((item) => item.public)} 
                        headerTitle='Public Playlists'
                    />
                }
                break;
            case 'following':
                if (resultData) {
                    content = <ContentFrame isArtist normal 
                        data={resultData.artists.items} 
                        headerTitle='Following'
                    />
                }
                break;
            case 'discography':
                if (resultData) {
                    content = <ContentFrame normal isAlbum data={resultData.items} headerTitle='Discography' /> 
                }
                break;
            case 'recently':
                if (resultData) {
                    content = <ContentFrame normal isTrack
                        data={resultData.items.filter((element, index) => {
                            if (index > 0) {
                                if (resultData.items[index].track.id !== resultData.items[index - 1].track.id) {
                                    return element;
                                }
                            } else {
                                return element;
                            }
                        })} 
                        headerTitle='Recently Tracks'
                    /> 
                }
                break;
            case 'top-artists':
                if (resultData) {
                    content = <ContentFrame normal isArtist 
                        data={resultData.items} 
                        headerTitle='Your Top Artist'
                    /> 
                }
                break;
            case 'featured':
                if (resultData) {
                    content = <ContentFrame normal isPlaylist 
                        data={resultData.playlists.items} 
                        headerTitle='Featured Playlists' 
                    />
                }
                break;
            case 'new-releases':
                if (resultData) {
                    content = <ContentFrame normal isAlbum
                        data={resultData.albums.items} 
                        headerTitle='New Releases' 
                    />
                }
                break;
        }

        return (
            <div className={cx('wrapper')}>
                {content}
                {pages > 1 && <PageTurnBtn 
                    pages={pages} 
                    setOffset={setOffset} 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    handlePath={handlePath}
                />}
                <ContentFooter />
            </div>
        )
    }
}

export default SubContent;