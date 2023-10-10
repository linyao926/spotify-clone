import { extractColors } from 'extract-colors';
import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { PersonIcon } from '~/assets/icons';
import config from '~/config';
import Button from '~/components/Button';
import ContentFrame from '~/components/Layouts/ContentFrame';
import CollectionCard from '~/pages/Collection/CollectionCard';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';

const cx = classNames.bind(styles);

function Profile({ follow }) {
    const {
        spotifyApi,
        bgHeaderColor,
        setBgHeaderColor,
        userData,
        columnCount,
        myPlaylistsData,
        libraryArtistIds,
        libraryAlbumIds,
        libraryPlaylistIds,
        savedTracks,
        containerWidth,
        ctnHeaderTextHeight,
        setCtnHeaderTextHeight,
        ctnHeaderTextSize,
        existPlaylist,
    } = useContext(AppContext);

    const [id, setId] = useState(null);
    const [resultData, setResultData] = useState(null);
    const [myTopTracks, setMyTopTracks] = useState(null);
    const [userPlaylists, setUserPlaylists] = useState(null);
    const [followedArtists, setFollowedArtists] = useState(null);
    const [firstAlbum, setFirstAlbum] = useState(null);
    const [firstTrackSaved, setFirstTrackSaved] = useState(null);
    const [firstPlaylist, setFirstPlaylist] = useState(null);
    const [hasData, setHasData] = useState(false);
    const [isMe, setIsMe] = useState(false);
    const [marginLeft, setMarginLeft] = useState(null);
    const [colors, setColors] = useState(null);

    const ref = useRef(null);
    const textRef = useRef(null);

    const params = useParams();

    useEffect(() => {
        setId(params.id);
        setHasData(false);
    }, [params]);

    useEffect(() => {
        if (userData) {
            if (userData.id === id) {
                setIsMe(true);
                setHasData(false);
            }
        }
    }, [userData, id]);

    // console.log(libraryAlbumIds)

    useEffect(() => {
        let isMounted = true;

        if (userData) {
            if (!isMe && id) {
                async function loadData() {
                    const [user, playlists] = await Promise.all(
                        spotifyApi
                            .getUser(id)
                            .then((data) => data)
                            .catch((error) => console.log('Error', error)),

                        spotifyApi
                            .getUserPlaylists(id, {
                                limit: columnCount,
                            })
                            .then((data) => data)
                            .catch((error) => console.log('Error', error)),
                    );
                    // console.log(playlists)
                    if (isMounted) {
                        setHasData(true);
                        setResultData(user);
                        setUserPlaylists(playlists);
                    }
                }
                loadData();
            } else {
                async function loadData() {
                    const tracks = await spotifyApi.getMyTopTracks(
                        { limit: 4 }
                    )
                    .then(
                        function (data) {
                          return data;
                        },
                        function (err) {
                          console.error(err);
                        }
                    );

                    let playlist, artists, album, track;

                    function getDataFromApi (method, id) {
                        return (method(id)
                        .then(
                            function (data) {
                              return data;
                            },
                            function (err) {
                              console.error(err);
                            }
                        ));
                    }

                    if (libraryPlaylistIds.length > 0) {
                        playlist = await getDataFromApi(spotifyApi.getPlaylist, libraryPlaylistIds[0]);
                    }

                    if (libraryArtistIds.length > 0) {
                        artists = await Promise.all(
                            libraryArtistIds.map((id) => getDataFromApi(spotifyApi.getArtist, id)),
                        );
                    }

                    if (libraryAlbumIds.length > 0) {
                        album = await getDataFromApi(spotifyApi.getAlbum, libraryAlbumIds[0]);
                    }

                    if (savedTracks.length > 0) {
                        track = await getDataFromApi(spotifyApi.getTrack, savedTracks[0])
                    }

                    if (isMounted) {
                        setHasData(true);
                        setResultData(userData);
                        setMyTopTracks(tracks);
                        artists && setFollowedArtists(artists);
                        album && setFirstAlbum(album);
                        track && setFirstTrackSaved(track);
                        playlist && setFirstPlaylist(playlist);
                    }
                }
                loadData();
            }
        }

        return () => (isMounted = false);
    }, [id, columnCount, isMe, myPlaylistsData, libraryArtistIds, libraryAlbumIds, savedTracks, libraryPlaylistIds]);

    // console.log(firstTrackSaved)

    useEffect(() => {
        if (resultData?.images.length > 0) {
            extractColors(resultData.images[1].url, {crossOrigin: 'Anonymous'})
            .then(setColors)
            .catch(console.error);
        } else {
            setBgHeaderColor('rgb(83, 83, 83)');
        }
    }, [resultData?.images]);

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
        if (textRef.current && ctnHeaderTextSize) {
            if (ctnHeaderTextHeight) {
                setCtnHeaderTextHeight({
                    prev: ctnHeaderTextHeight >= 82.796875 * 2 ? 0 : ctnHeaderTextHeight.current,
                    current: textRef.current.getBoundingClientRect().height,
                });
            } else {
                setCtnHeaderTextHeight({
                    prev: 0,
                    current: textRef.current.getBoundingClientRect().height,
                });
            }
        }
    }, [textRef.current, ctnHeaderTextSize, containerWidth]);

    useEffect(() => {
        if (textRef.current && ctnHeaderTextSize) {
            switch (ctnHeaderTextSize) {
                case 9.6:
                    setMarginLeft('-5px');
                    break;
                case 7.2:
                    setMarginLeft('-4px');
                    break;
                case 4.8:
                    setMarginLeft('-2px');
                    break;
                case 3.2:
                    setMarginLeft('-1px');
                    break;
            }
        }
    }, [textRef.current, ctnHeaderTextSize]);

    // console.log(firstAlbum)

    // console.log(resultData.images)

    if (hasData) {
        return (
            <div className={cx('wrapper')} ref={ref}>
                <header className={cx('header')}>
                    {resultData.images.length > 0 ? (
                        <img
                            src={resultData.images[1].url}
                            alt={`Image of ${resultData.name}`}
                            className={cx('header-img')}
                        />
                    ) : (
                        <div className={cx('header-img')}>
                            <PersonIcon />
                        </div>
                    )}

                    <div className={cx('header-title')}>
                        <h5>Profile</h5>
                        <h1 ref={textRef} style={{ marginLeft: marginLeft }}>
                            {resultData.display_name}
                        </h1>
                        {isMe ? (
                            myPlaylistsData.length > 0 && <span className={cx('header-total')}>
                                {`${myPlaylistsData.length} Public Playlists`}
                            </span>
                        ) : (
                            userPlaylists.total > 0 && <span className={cx('header-total')}>
                                {`${userPlaylists.total} Public Playlists`}
                            </span>
                        )}
                        {isMe ? (
                            followedArtists && followedArtists.length > 0 && 
                            <Link className={cx('header-total', 'header-total-artists')}>
                                {`${followedArtists.length} Following`}
                            </Link>
                        ) : (
                            resultData.followers.total > 0 && <span className={cx('header-total')}>
                                {`${Intl.NumberFormat().format(resultData.followers.total)} Followers`}
                            </span>
                        )}
                    </div>
                </header>
                <div className={cx('content')}>
                    {!isMe ? (
                        <div className={cx('interact')}>
                            {follow ? (
                                <Button dark outline className={cx('follow-btn')}>
                                    follow
                                </Button>
                            ) : (
                                <Button dark outline className={cx('follow-btn', 'following')}>
                                    following
                                </Button>
                            )}
                        </div>
                    ) : null}

                    {isMe && (
                        <ContentFrame
                            data={myTopTracks && myTopTracks.items}
                            songs
                            songCol4
                            showAll
                            headerTitle="Top tracks this month"
                            currentUser
                            type="top-tracks"
                        />
                    )}

                    {existPlaylist && <>
                        <header className={cx('collection-header')}><h4>Your collection</h4></header>
                        <div className={cx('your-collection')}
                            style={{
                                gridTemplateColumns: `repeat(${Math.round(columnCount/2)} ,minmax(0,1fr))`
                            }}
                        >
                            {firstTrackSaved && <CollectionCard 
                                imgUrl={firstTrackSaved.album.images[0].url}
                                title={firstTrackSaved.name}
                                ownName={firstTrackSaved.artists.map((artist, index) => (
                                    <div key={artist.id}
                                        style={{
                                            display: 'inline-block',
                                            marginRight: '3px'
                                        }}
                                    >
                                        <Link 
                                            className={cx('header-creator')}
                                            to={`/artist/${artist.id}`}
                                        >
                                            {artist.name}
                                        </Link>
                                        {index !== firstTrackSaved.artists.length - 1 && ' •'}
                                    </div>
                                ))}
                                itemName='Liked Songs'
                                subTitle={`${savedTracks.length} liked songs`}
                                toPage={config.routes.likedTracks}
                            />}
                            {firstPlaylist && <CollectionCard 
                                imgUrl={firstPlaylist.images.length > 0 ? firstPlaylist.images[0].url : null}
                                title={firstPlaylist.name}
                                ownName={<Link className={cx('header-creator')}
                                    to={`/profile/${firstPlaylist.owner.id}`}
                                >
                                    {`By ${firstPlaylist.owner.display_name}`}
                                </Link>}
                                itemName='Saved Playlist'
                                subTitle={`${myPlaylistsData?.length + libraryPlaylistIds.length} playlists`}
                                toPage={config.routes.savedPlaylist}
                            />}
                            {(!firstPlaylist && myPlaylistsData.length > 0) && <CollectionCard 
                                imgUrl={myPlaylistsData[0].img ? URL.createObjectURL(myPlaylistsData[0].img) : null}
                                title={myPlaylistsData[0].name}
                                ownName={`By ${userData.display_name}`}
                                itemName='Saved Playlist'
                                subTitle={`${myPlaylistsData.length} playlists`}
                                toPage={config.routes.savedPlaylist}
                            />}
                            {firstAlbum && <CollectionCard 
                                imgUrl={firstAlbum.images[0].url}
                                title={firstAlbum.name}
                                ownName={firstAlbum.artists.map((artist, index) => (
                                    <div key={artist.id}
                                        style={{
                                            display: 'inline-block',
                                            marginRight: '3px'
                                        }}
                                    >
                                        <Link 
                                            className={cx('header-creator')}
                                            to={`/artist/${artist.id}`}
                                        >
                                            {artist.name}
                                        </Link>
                                        {index !== firstAlbum.artists.length - 1 && ' •'}
                                    </div>
                                ))}
                                itemName='Liked Albums'
                                subTitle={`${libraryAlbumIds.length} liked albums`}
                                toPage={config.routes.likedAlbums}
                            />}
                            {followedArtists && <CollectionCard 
                                imgUrl={followedArtists[0].images[0].url}
                                title={followedArtists[0].name}
                                itemName='Followed Artists'
                                subTitle={`${libraryArtistIds.length} following`}
                                toPage={config.routes.followArtists}
                            />}
                        </div>
                    </>}

                    {!isMe && userPlaylists.items.filter((item) => item.public).length > 0 && (
                        <ContentFrame
                            isPlaylist
                            normal
                            data={userPlaylists.items.filter((item) => item.public)}
                            headerTitle="Public Playlists"
                            showAll={userPlaylists.total > columnCount}
                            type="playlists"
                        />
                    )}
                    {isMe && myPlaylistsData.length > 0 && (
                        <ContentFrame
                            myPlaylist={isMe}
                            normal
                            data={myPlaylistsData}
                            headerTitle="Public Playlists"
                            showAll={myPlaylistsData.length > columnCount}
                            type="playlists"
                        />
                    )}
                    {isMe && followedArtists?.length > 0 && (
                        <ContentFrame
                            isArtist
                            normal
                            data={followedArtists}
                            headerTitle="Following"
                            showAll={followedArtists.length > columnCount}
                            type="following"
                        />
                    )}
                </div>
                <ContentFooter />
            </div>
        );
    }
}

export default Profile;
