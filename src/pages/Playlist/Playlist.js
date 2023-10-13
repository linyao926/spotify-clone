import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { CardImgFallbackIcon, PersonIcon } from '~/assets/icons';
import PageContentDefault from '~/components/Layouts/PageContentDefault';
import ContentFrame from '~/components/Layouts/ContentFrame';
import PageTurnBtn from '~/components/PageTurnBtn';
import classNames from 'classnames/bind';
import styles from './Playlist.module.scss';

const cx = classNames.bind(styles);

function Playlist() {
    const {
        spotifyApi, 
        msToMinAndSeconds,
        convertMsToHM, 
        contextMenu,
        setNowPlayingId,
        setNextQueueId,
    } = useContext(AppContext);

    const [id, setId] = useState(null);
    const [playlistData, setPlaylistData] = useState(null);
    const [tracksData, setTracksData] = useState(null);
    const [creatorPlaylist, setCreatorPlaylist] = useState(null);
    const [hasData, setHasData] = useState(false);
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [offset, setOffset] = useState(0);

    const params = useParams();
    // console.log(params)

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
            <PageContentDefault 
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
            >
                {tracksData.items.length > 0 && <ContentFrame data={tracksData.items} songs isPlaylist toPlaylistId={id} titleForNextFrom={playlistData.name} />}

                {pages > 1 && <PageTurnBtn 
                    pages={pages} 
                    setOffset={setOffset} 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />}
            </PageContentDefault>
        );
    }
}

export default Playlist;