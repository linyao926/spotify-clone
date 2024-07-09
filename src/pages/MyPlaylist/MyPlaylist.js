import { useContext, useState, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams, Outlet } from 'react-router-dom';
import { CardImgFallbackIcon, PersonIcon, CloseIcon } from '~/assets/icons';
import PageContentLayout from '~/components/Layouts/PageContentLayout';
import PageContentMobileLayout from '~/components/Layouts/PageContentMobileLayout';
import SearchForm from '~/components/Blocks/SearchForm';
import Segment from '~/components/Containers/Segment';
import PageTurnBtn from '~/components/Blocks/Buttons/PageTurnBtn';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import classNames from 'classnames/bind';
import styles from './MyPlaylist.module.scss';
import MobileCardItem from '~/components/Blocks/MobileCardItem';

const cx = classNames.bind(styles);

function MyPlaylist() {
    const {
        userData,
        spotifyApi,
        setTokenError,
        msToMinAndSeconds,
        convertMsToHM,
        contextMenu,
        myPlaylistsData,
        myPlaylistPageInputValue,
        setMyPlaylistPageInputValue,
        setMyPlaylistsData,
        smallerWidth,
    } = useContext(AppContext);

    const [tracksData, setTracksData] = useState(null);
    const [showSearch, setShowSearch] = useState(true);
    const [pages, setPages] = useState(0);
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [initialImg, setInitialImg] = useState('');
    const [hasData, setHasData] = useState(false);

    const params = useParams();

    useEffect(() => {
        setHasData(false);
    }, [params]);

    useEffect(() => {
        setMyPlaylistPageInputValue('');
    }, [hasData]);

    useEffect(() => {
        console.log(51);
        let isMounted = true;

        if (myPlaylistsData[params.number - 1]?.tracks) {
            async function loadData() {
                const tracks = await Promise.all(
                    myPlaylistsData[params.number - 1].tracks.map((item) =>
                        spotifyApi
                            .getTrack(item.id)
                            .then((data) => data)
                            .catch((error) => {
                                console.log('Error', error);
                                if (error.status === 401) {
                                    setTokenError(true);
                                }
                            }),
                    ),
                );
                if (isMounted) {
                    setHasData(true);
                    tracks && setTracksData(tracks);
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, [myPlaylistsData, offset, params]);

    useEffect(() => {
        if (!tracksData || myPlaylistPageInputValue) {
            setShowSearch(true);
        } else {
            setShowSearch(false);
        }
    }, [tracksData, params]);

    useEffect(() => {
        if (!showSearch) {
            setMyPlaylistPageInputValue('');
        }
    }, [params, showSearch]);

    useEffect(() => {
        if (myPlaylistsData[params.number - 1].img?.name === undefined) {
            setInitialImg('');
        } else {
            setInitialImg(myPlaylistsData[params.number - 1].img);
        }
    }, [myPlaylistsData[params.number - 1]]);

    useEffect(() => {
        if (!myPlaylistsData[params.number - 1].fallbackImage && tracksData && tracksData[0].album.images[0]) {
            let items = [...myPlaylistsData];
            let item = { ...items[params.number - 1] };
            item.fallbackImage = tracksData[0].album.images[0].url;
            items[params.number - 1] = item;
            setMyPlaylistsData(items);
        }
    }, [tracksData]);

    const totalTime = (tracks) => {
        if (tracks) {
            let total = 0;
            for (let val of tracks) {
                if (val) {
                    total += val.duration_ms;
                }
            }
            return total;
        }
    };

    if (myPlaylistsData.length > 0 && Object.keys(myPlaylistsData[params.number - 1]).length > 0) {
        return smallerWidth ? (
            <PageContentMobileLayout
                myPlaylist
                imgUrl={initialImg !== '' ? initialImg : tracksData ? tracksData[0]?.album.images[0].url : null}
                title={myPlaylistsData[params.number - 1].name}
                type="Playlist"
                fallbackIcon={<CardImgFallbackIcon />}
                subTitle={
                    <>
                        <div className={cx('playlist-intro')}>
                            {userData && (
                                <div className={cx('header-creator-wrapper')}>
                                    {userData.images.length > 0 ? (
                                        <img
                                            loading="lazy"
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
                            {tracksData && tracksData.length > 0 && (
                                <span className={cx('header-duration')}>
                                    {totalTime(tracksData) > 3599000
                                        ? convertMsToHM(totalTime(tracksData))
                                        : msToMinAndSeconds(totalTime(tracksData))}
                                </span>
                            )}
                        </div>
                    </>
                }
                contextMenu={contextMenu['my-playlist']}
                renderPlay={tracksData ? tracksData.length > 0 : false}
                toId={myPlaylistsData[params.number - 1].tracks && myPlaylistsData[params.number - 1].tracks}
                displayOption={false}
            >
                {tracksData &&
                    tracksData.length > 0 &&
                    tracksData.map((item, index) => (
                        <MobileCardItem
                            key={item.id}
                            isTrack={true}
                            isPlaylistPage={true}
                            img={item.album.images[0].url}
                            title={item.name}
                            type={item.type}
                            artistsData={item.artists}
                            toId={item.id}
                            albumId={item.album.id}
                        />
                    ))}

                {pages > 1 && (
                    <PageTurnBtn
                        pages={pages}
                        setOffset={setOffset}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </PageContentMobileLayout>
        ) : (
            <PageContentLayout
                myPlaylist
                imgUrl={initialImg !== '' ? initialImg : tracksData ? tracksData[0]?.album.images[0].url : null}
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
                                            loading="lazy"
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
                            {tracksData && tracksData.length > 0 && (
                                <span className={cx('header-duration')}>
                                    {totalTime(tracksData) > 3599000
                                        ? convertMsToHM(totalTime(tracksData))
                                        : msToMinAndSeconds(totalTime(tracksData))}
                                </span>
                            )}
                        </div>
                    </>
                }
                contextMenu={contextMenu['my-playlist']}
                renderPlay={tracksData && tracksData.length > 0}
                toId={myPlaylistsData[params.number - 1].tracks && myPlaylistsData[params.number - 1].tracks}
                loading={false}
            >
                {tracksData && tracksData.length > 0 && (
                    <Segment
                        data={tracksData}
                        songs
                        isPlaylist
                        isMyPlaylist
                        columnHeader
                        colHeaderIndex
                        colHeaderTitle
                        colHeaderAlbum
                        colHeaderDate
                        colHeaderDuration
                        toPlaylistId={params.number - 1}
                        thisMyPlaylistData={myPlaylistsData[params.number - 1]?.tracks}
                    />
                )}

                {showSearch ? (
                    <>
                        <div className={cx('wrapper-search-track')}>
                            <div className={cx('search-track')}>
                                <h4>Let's find something for your playlist</h4>
                                <SearchForm
                                    playlist
                                    placeholder={'Search for songs'}
                                    setFunc={setMyPlaylistPageInputValue}
                                    inputValue={myPlaylistPageInputValue}
                                />
                            </div>
                            <ButtonPrimary
                                icon
                                dark
                                className={cx('close-search-btn')}
                                onClick={() => {
                                    setMyPlaylistPageInputValue('');
                                    setShowSearch(false);
                                }}
                            >
                                <CloseIcon />
                            </ButtonPrimary>
                        </div>
                        {myPlaylistPageInputValue && <Outlet />}
                    </>
                ) : (
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
            </PageContentLayout>
        );
    }
}

export default MyPlaylist;
