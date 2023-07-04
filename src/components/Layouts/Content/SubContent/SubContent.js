import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useLocation, useLoaderData, useNavigate, NavLink } from 'react-router-dom';
import { BsFillPlayFill } from 'react-icons/bs';
import Button from '~/components/Button';
import ContentFrame from '~/components/Layouts/ContentFrame';
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
    const [pages, setPages] = useState(0);
    const [offset, setOffset] = useState(0);

    const {pathname} = useLocation();

    useEffect(() => {
        let indexIdStart = pathname.indexOf('/', 1) + 1;
        let indexType = pathname.indexOf('/', indexIdStart) + 1;
        let indexEndType = pathname.indexOf('/', indexType) + 1;

        setId(pathname.slice(indexIdStart, indexType - 1));
        if (indexEndType > 0) {
            setType(pathname.slice(indexType, indexEndType - 1));
        } else {
            setType(pathname.slice(indexType));
        }
    }, [pathname]);

    console.log(pages)

    useEffect(() => {
        let isMounted = true;
        if (id && type) {
            async function loadData () {
                let data;
                switch (type) {
                    case 'related':
                        data =  await spotifyApi.getArtistRelatedArtists(id)
                        .then((data) => data, 
                            (error) => console.log('Error', error)
                        );
                        break;
                    case 'appears_on':
                        data =  await spotifyApi.getArtistAlbums(id, { 
                            include_groups: 'appears_on',
                            limit: 30, 
                        })
                        .then((data) => data.total)
                        .then((total) => {
                            let limit = 30;
                            let x = Math.floor(total/limit);
                            if (x * limit == total) {
                                setPages(x);
                            } else {
                                setPages(x + 1);
                            }
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
                        .then((data) => data, 
                            (error) => console.log('Error', error)
                        );
                        break;
                    case 'playlists':
                        data = await spotifyApi.getUserPlaylists(id)
                        .then((data) => data, 
                            (error) => console.log('Error', error)
                        );
                        break;
                    case 'following' :
                        data = await spotifyApi.getFollowedArtists()
                        .then((data) => data, 
                            (error) => console.log('Error', error)
                        );
                        break;
                    case 'discography':
                        data = await spotifyApi.getArtistAlbums(id, { 
                            include_groups: 'album,single,compilation',
                            limit: 30,
                        })
                        .then((data) => data.total)
                        .then((total) => {
                            let limit = 30;
                            let x = Math.floor(total/limit);
                            if (x * limit == total) {
                                setPages(x);
                            } else {
                                setPages(x + 1);
                            }
                            return spotifyApi.getArtistAlbums(id, {
                                include_groups: 'album,single,compilation',
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
        }

        return (
            <div className={cx('wrapper')}>
                {content}
                {pages > 1 && <div className={cx('pages')}>
                    {[...Array(pages).keys()].map(page => (
                        <NavLink key={page}
                            className={({isActive}) => cx('page-btn', isActive && 'active')}
                            onClick={() => setOffset(page * 30)}
                            to={page > 0 ? `page=${page + 1}` : ``}
                            end
                        >
                            {page + 1}
                        </NavLink>
                    ))}
                </div>}
                <ContentFooter />
            </div>
        )
    }
}

export default SubContent;