import { useContext, useState, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { useParams, generatePath, useLocation } from 'react-router-dom';
import Segment from '../Segment';
import MainFooter from '~/components/Blocks/MainFooter';
import PageTurnBtn from '~/components/Blocks/Buttons/PageTurnBtn';
import classNames from 'classnames/bind';
import styles from './SectionContent.module.scss';

const cx = classNames.bind(styles);

function SectionContent() {
    const { 
        spotifyApi,  
        setTokenError,
        getData,
        removeDuplicates,
    } = useContext(AppContext);

    const [id, setId] = useState(null);
    const [type, setType] = useState(null);
    const [resultData, setResultData] = useState(null);
    const [hasData, setHasData] = useState(false);
    const [dynamicPath, setDynamicPath] = useState('/:subType/:pageNumber?');
    const [pages, setPages] = useState(0);
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const params = useParams();
    const {pathname} = useLocation();

    useEffect(() => {
        if (pathname.includes('page=')) {
            let result = pathname[pathname.lastIndexOf('=') + 1];
            let i = pathname.lastIndexOf('=') + 1;
            while (i <= pathname.length - 1) {
                i++;
                if (i <= pathname.length - 1) {
                    result += pathname[i];
                }
            };
            setCurrentPage(Number(result));
            setOffset((Number(result) - 1) * 30);
            if (params.id) {
                setId(params.id);
                setType(params.subType)
            } else {
                setType(params.type)
            }
            setHasData(false);
        } else {
            if (pages === 0) {
                if (params.id) {
                    setId(params.id);
                    setType(params.subType);
                } else {
                    setType(params.subType)
                }
            } else if (pages > 0) {
                if (params.id) {
                    setId(params.id);
                    setType(params.subType);
                } else {
                    setType(params.subType)
                }
            }
            setHasData(false);
        }
    }, [pathname, pages, params]);

    // console.log(params)
    
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
                let data = await condition(true, false);

                if (type == 'recently') {
                    let arr = [];
                    data.items.map(item => {
                        arr.push(item.track);
                    })
                    data = removeDuplicates(arr, 'object', 'id');
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

    const condition = (data = false, component = false) => {
        const limit = 30;

        switch (type) {
            case 'related':
                if (data) {
                    return getData(spotifyApi.getArtistRelatedArtists, id);
                } 

                if (component && resultData.artists) {
                    return (<Segment normal isArtist 
                        data={resultData.artists} 
                        headerTitle={`Fans also like`} 
                    />)
                }

                break;
            case 'appears_on':
                if (data) {
                    return spotifyApi.getArtistAlbums(id, { 
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
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });
                } 

                if (component && resultData.items) {
                    return (<Segment normal isAlbum data={resultData.items} headerTitle='Appears On' />)
                }

                break;
            case 'top-tracks':
                if (data) {
                    return spotifyApi.getMyTopTracks({limit: 50})
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });
                } 

                if (component && resultData) {
                    return (<Segment data={resultData.items} 
                        songs songCol4 
                        headerTitle='Top tracks this month'
                        currentUser
                        columnHeader
                        colHeaderIndex
                        colHeaderTitle
                        colHeaderAlbum
                        colHeaderDuration
                    />)
                }

                break;
            case 'playlists':
                if (data) {
                    return getData(spotifyApi.getUserPlaylists, id);
                } 

                if (component && resultData) {
                    return (<Segment 
                        myPlaylist
                        isPlaylist 
                        normal 
                        data={resultData.items.filter((item) => item.public)} 
                        headerTitle='Public Playlists'
                    />)
                }

                break;
            case 'following':
                if (data) {
                    return spotifyApi.getFollowedArtists()
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });
                } 

                if (component && resultData) {
                    return (<Segment isArtist normal 
                        data={resultData.artists.items} 
                        headerTitle='Following'
                    />)
                }

                break;
            case 'discography':
                if (data) {
                    return spotifyApi.getArtistAlbums(id, { 
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
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });
                } 

                if (component && resultData) {
                    return (<Segment normal isAlbum data={resultData.items} headerTitle='Discography' />)
                }

                break;
            case 'recently':
                if (data) {
                    return spotifyApi.getMyRecentlyPlayedTracks()
                    .then((data) => data.total)
                    .then((total) => {
                        handlePageNumber(total, limit);
                        return spotifyApi.getMyRecentlyPlayedTracks({
                            limit: limit,
                            offset: offset
                        });
                    })
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });
                } 

                if (component && resultData) {
                    return (<Segment normal isTrack
                        data={resultData} 
                        headerTitle='Recently Tracks'
                    /> )
                }

                break;
            case 'top-artists':
                if (data) {
                    return spotifyApi.getMyTopArtists()
                    .then((data) => data.total)
                    .then((total) => {
                        handlePageNumber(total, limit);
                        return spotifyApi.getMyTopArtists({
                            limit: limit,
                            offset: offset
                        });
                    })
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });
                } 

                if (component && resultData) {
                    return (<Segment normal isArtist 
                        data={resultData.items} 
                        headerTitle='Your Top Artist'
                    />)
                }

                break;
            case 'featured':
                if (data) {
                    return spotifyApi.getFeaturedPlaylists()
                    .then((data) => data.playlists.total)
                    .then((total) => {
                        handlePageNumber(total, limit);
                        return spotifyApi.getFeaturedPlaylists({
                            limit: limit,
                            offset: offset
                        });
                    })
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });
                } 

                if (component && resultData) {
                    return (<Segment normal isPlaylist 
                        data={resultData.playlists.items} 
                        headerTitle='Featured Playlists' 
                    />)
                }

                break;
            case 'new-releases':
                if (data) {
                    return spotifyApi.getNewReleases()
                    .then((data) => data.albums.total)
                    .then((total) => {
                        handlePageNumber(total, limit);
                        return spotifyApi.getNewReleases({
                            limit: limit,
                            offset: offset
                        });
                    })
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });
                } 

                if (component && resultData) {
                    return (<Segment normal isAlbum
                        data={resultData.albums.items} 
                        headerTitle='New Releases' 
                    />)
                }

                break;
        }
    }

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
        const content = condition(false, true);

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
                <MainFooter />
            </div>
        )
    }
}

export default SectionContent;