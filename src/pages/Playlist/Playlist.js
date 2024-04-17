import { useContext, useState, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { CardImgFallbackIcon, PersonIcon } from '~/assets/icons';
import PageContentLayout from '~/components/Layouts/PageContentLayout';
import PageContentMobileLayout from '~/components/Layouts/PageContentMobileLayout';
import Segment from '~/components/Containers/Segment';
import PageTurnBtn from '~/components/Blocks/Buttons/PageTurnBtn';
import classNames from 'classnames/bind';
import styles from './Playlist.module.scss';
import MobileCardItem from '~/components/Blocks/MobileCardItem';

const cx = classNames.bind(styles);

function Playlist() {
    const {
        spotifyApi, 
        setTokenError,
        msToMinAndSeconds,
        convertMsToHM, 
        contextMenu,
        smallerWidth,
    } = useContext(AppContext);

    const [id, setId] = useState(null);
    const [playlistData, setPlaylistData] = useState(null);
    const [tracksData, setTracksData] = useState(null);
    const [creatorPlaylist, setCreatorPlaylist] = useState(null);
    const [hasData, setHasData] = useState(false);
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(true);

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
                const [playlist, tracks, creator] =  await Promise.all([
                    spotifyApi.getPlaylist(id)
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                        setLoading(false);
                    }),
                    
                    spotifyApi.getPlaylist(id)
                    .then(function(data) {
                        return data.tracks.total;
                    })
                    .then(function(total) {
                        let limit = 30;
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
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                        setLoading(false);
                    }),

                    spotifyApi.getPlaylist(id)
                    .then(function(data) {
                        return data.owner.id;
                    })
                    .then(function(id) {
                        return spotifyApi.getUser(id);
                    })
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                        setLoading(false);
                    })
                ])
                if (isMounted) {
                    setHasData(true);
                    setLoading(false);
                    setPlaylistData(playlist);
                    setTracksData(tracks);
                    setCreatorPlaylist(creator);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [id, offset]);

    if (hasData) {
        let totalTime = () => {
            let total = 0;
            for (let val of tracksData.items) {
                total += val.track['duration_ms'];            
            }
            return total;
        };

        let displayMaxSong = () => {
            let max = currentPage * 30;
            if (max > playlistData.tracks.total) {
                max = playlistData.tracks.total;
            }
            return max;
        }

        return (
            smallerWidth ? (
                <PageContentMobileLayout
                    imgUrl={playlistData.images.length > 0 ? playlistData.images[0].url : false}
                    title={playlistData.name}
                    type='Playlist'
                    fallbackIcon={<CardImgFallbackIcon />}
                    subTitle={<>
                        {/* {playlistData.description !== '' && 
                            <div className={cx('header-sub-title')}>
                                {playlistData.description}
                            </div>
                        } */}
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
                            <div
                                style={{
                                    marginTop: '8px',
                                    color: 'hsla(0, 0%, 100%, .7)',
                                }}
                            >
                                <span className={cx('header-total')}>
                                    {playlistData.followers.total > 0 && `${Intl.NumberFormat().format(playlistData.followers.total)} likes`}
                                </span>
                                <span className={cx('header-total')}>
                                    {playlistData.tracks.total > 0 && `${playlistData.followers.total > 0 ? ' • ' : ''}${offset + 1} - ${displayMaxSong()}/${playlistData.tracks.total} songs, `}
                                </span>
                                {playlistData.tracks.total > 0 && <span className={cx('header-duration')}>about {totalTime() > 3599000 
                                    ? convertMsToHM(totalTime()) 
                                    : msToMinAndSeconds(totalTime())}
                                </span>}
                            </div>
                        </div>
                    </>}
                    contextMenu={contextMenu['mobile-playlist']}
                    renderPlay
                    toId={id}
                    isPlaylist
                >
                    {tracksData.items.length > 0 && tracksData.items.map((item, index) => (
                        <MobileCardItem 
                            key={item.track.id}
                            isTrack={true}
                            isPlaylistPage={true}
                            img={item.track.album.images[0].url}
                            title={item.track.name}
                            type={item.track.type}
                            artistsData={item.track.artists}
                            toId={item.track.id}
                            albumId={item.track.album.id}
                        />
                    ))}

                    {pages > 1 && <PageTurnBtn 
                        pages={pages} 
                        setOffset={setOffset} 
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />}
                </PageContentMobileLayout>
            ) : (
                <PageContentLayout 
                    imgUrl={playlistData.images.length > 0 ? playlistData.images[0].url : false}
                    title={playlistData.name}
                    type='Playlist'
                    fallbackIcon={<CardImgFallbackIcon />}
                    subTitle={<>
                        {playlistData.description !== '' && 
                            <div className={cx('header-sub-title')}>
                                {playlistData.description}
                            </div>
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
                            </span>
                            <span className={cx('header-total')}>
                                {playlistData.tracks.total > 0 && ` • ${offset + 1} - ${displayMaxSong()}/${playlistData.tracks.total} songs, `}
                            </span>
                            {playlistData.tracks.total > 0 && <span className={cx('header-duration')}>about {totalTime() > 3599000 
                                ? convertMsToHM(totalTime()) 
                                : msToMinAndSeconds(totalTime())}
                            </span>}
                        </div>
                    </>}
                    contextMenu={contextMenu.playlist}
                    renderPlay
                    toId={id}
                    isPlaylist
                    loading={loading}
                >
                    {tracksData.items.length > 0 && <Segment data={tracksData.items} songs 
                        isPlaylist toPlaylistId={id} titleForNextFrom={playlistData.name} 
                        columnHeader
                        colHeaderIndex
                        colHeaderTitle
                        colHeaderAlbum
                        colHeaderDate
                        colHeaderDuration
                    />}

                    {pages > 1 && <PageTurnBtn 
                        pages={pages} 
                        setOffset={setOffset} 
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />}
                </PageContentLayout>
        ));
    }
}

export default Playlist;