import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams, Outlet } from 'react-router-dom';
import { CardImgFallbackIcon, PersonIcon, CloseIcon } from '~/assets/icons';
import PageContentDefault from '~/components/Layouts/PageContentDefault';
import SearchForm from '~/components/SearchForm';
import ContentFrame from '~/components/Layouts/ContentFrame';
import PageTurnBtn from '~/components/PageTurnBtn';
import Button from '~/components/Button';
import classNames from 'classnames/bind';
import styles from './MyPlaylist.module.scss';

const cx = classNames.bind(styles);

function MyPlaylist() {
    const {
        userData,
        spotifyApi,
        msToMinAndSeconds,
        convertMsToHM,
        handleGetValueInput,
        contextMenu,
        setNowPlayingId,
        setNextQueueId,
        myPlaylistsData,
        setMyPlaylistData,
        myPlaylistPageInputValue, 
        setMyPlaylistPageInputValue,
    } = useContext(AppContext);

    const [id, setId] = useState(null);
    const [tracksData, setTracksData] = useState(null);
    const [hasData, setHasData] = useState(false);
    const [showSearch, setShowSearch] = useState(true);
    const [pages, setPages] = useState(0);
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const params = useParams();

    // console.log(myPlaylistsData);

    useEffect(() => {
        let isMounted = true;

        if (myPlaylistsData[params.number - 1]?.tracks) {
            async function loadData() {
                const tracks = await Promise.all(
                    myPlaylistsData[params.number - 1].tracks.map(id => spotifyApi.getTrack(id)
                    .then(data => data)
                    .catch(error => console.log(error)))
                );
                if (isMounted) {
                    setHasData(true);
                    tracks && setTracksData(tracks);
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, [myPlaylistsData, offset]);
    // myPlaylistsData[params.number - 1].tracks.map(id => console.log(id))

    useEffect(() => {
        if (!tracksData || myPlaylistPageInputValue) {
            setShowSearch(true);
        } else {
            setShowSearch(false);
        }
    }, [tracksData]);

    const totalTime = (tracks) => {
        let total = 0;
        for (let val of tracks) {
            // console.log(val.duration_ms)
            total += val.duration_ms;
        }
        return total;
    };

    if (myPlaylistsData.length > 0 && Object.keys(myPlaylistsData[params.number - 1]).length > 0) {
        return (
            <PageContentDefault
                myPlaylist
                imgUrl={myPlaylistsData[params.number - 1].img ? myPlaylistsData[params.number - 1].img : false}
                title={myPlaylistsData[params.number - 1].name}
                type="Playlist"
                fallbackIcon={<CardImgFallbackIcon />}
                subTitle={
                    <>
                        {myPlaylistsData[params.number - 1].description && (
                            <span className={cx('header-sub-title')}>
                                {myPlaylistsData[params.number - 1].description}
                            </span>
                        )}
                        <div className={cx('playlist-intro')}>
                            {userData && (
                                <div className={cx('header-creator-wrapper')}>
                                    {userData.images.length > 0 ? (
                                        <img
                                            src={userData.images[0].url}
                                            alt={`Image of ${userData.name}`}
                                            className={cx('creator-img')}
                                        />
                                    ) : (
                                        <div className={cx('creator-img')}>
                                            <PersonIcon />
                                        </div>
                                    )}
                                    <Link className={cx('header-creator')} to={`/user/${userData.id} `}>
                                        {userData.display_name}
                                    </Link>
                                </div>
                            )}
                            <span className={cx('header-total')}>
                            
                                {tracksData && tracksData.length > 0 && ` • ${tracksData.length} songs, `}
                            </span>
                            {tracksData && tracksData.length > 0 && <span className={cx('header-duration')}>{totalTime(tracksData) > 3599000 
                                ? convertMsToHM(totalTime(tracksData)) 
                                : msToMinAndSeconds(totalTime(tracksData))}
                            </span>}
                        </div>
                    </>
                }
                contextMenu={contextMenu['my-playlist']}
                renderPlay={tracksData && tracksData.length > 0}
                toId={myPlaylistsData[params.number - 1].tracks && myPlaylistsData[params.number - 1].tracks}
            >
                {tracksData && tracksData.length > 0 && <ContentFrame data={tracksData} songs isPlaylist isMyPlaylist />}

                {showSearch ? (<>
                    <div className={cx('wrapper-search-track')}>
                        <div className={cx('search-track')}>
                            <h4>Let's find something for your playlist</h4>
                            <SearchForm playlist 
                                placeholder={'Search for songs'} 
                                setFunc={setMyPlaylistPageInputValue}
                                inputValue={myPlaylistPageInputValue}
                            />
                        </div>
                        <Button icon dark className={cx('close-search-btn')} onClick={() => setShowSearch(false)}>
                            <CloseIcon />
                        </Button>
                    </div>
                    {myPlaylistPageInputValue && (
                        <Outlet />
                    )}
                </>) : (
                    <div className={cx('show-search')} onClick={() => setShowSearch(true)}>
                        Find more
                    </div>
                )}
                
                {pages > 1 && (
                    <PageTurnBtn
                        pages={pages}
                        setOffset={setOffset}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </PageContentDefault>
        );
    }
}

export default MyPlaylist;