import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { DotsIcon, PersonIcon } from '~/assets/icons';
import Button from '~/components/Button';
import ContentFrame from '~/components/Layouts/ContentFrame';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';

const cx = classNames.bind(styles);

function Profile({follow}) {
    const { spotifyApi, setBgHeaderColor, userData, columnCount } = useContext(AppContext);
    const [id, setId] = useState(null);
    const [resultData, setResultData] = useState(null);
    const [myTopTracks, setMyTopTracks] = useState(null);
    const [userPlaylists, setUserPlaylists] = useState(null);
    const [followedArtists, setFollowedArtists] = useState(null);
    const [hasData, setHasData] = useState(false);
    const [isMe, setIsMe] = useState(false);
    
    const ref = useRef(null);
    const params = useParams();

    const otherUserBgColor = 'rgb(83, 83, 83)';
    const currentUserBgColor = 'rgb(64, 72, 160)';

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

    useEffect(() => {
        let isMounted = true;

        if (userData) {
            if (!isMe) {
                async function loadData () {
                    const [user, playlists] =  await Promise.all([
                        spotifyApi.getUser(id)
                        .then((data) => data, 
                            (error) => console.log('Error', error)
                        ),
                        spotifyApi.getUserPlaylists(id)
                        .then((data) => data, 
                            (error) => console.log('Error', error)
                        )
                    ])
                    if (isMounted) {
                        setHasData(true);
                        setResultData(user);
                        setUserPlaylists(playlists);
                    }
                }
                loadData();
            } else {
                async function loadData () {
                    const [tracks, playlists, artists] =  await Promise.all([
                        spotifyApi.getMyTopTracks({limit: 4})
                        .then((data) => data, 
                            (error) => console.log('Error', error)
                        ),
                        spotifyApi.getUserPlaylists(id)
                        .then((data) => data, 
                            (error) => console.log('Error', error)
                        ),
                        spotifyApi.getFollowedArtists()
                        .then((data) => data, 
                            (error) => console.log('Error', error)
                        ),
                    ])
                    if (isMounted) {
                        setHasData(true);
                        setResultData(userData);
                        setMyTopTracks(tracks);
                        setUserPlaylists(playlists);
                        setFollowedArtists(artists);
                    }
                }
                loadData();
            }
        }
        
        return () => (isMounted = false);
    }, [id, columnCount, isMe]);

    useEffect(() => {
        if (isMe) {
            setBgHeaderColor(currentUserBgColor);
        } else {
            setBgHeaderColor(otherUserBgColor);
        }
        
    }, [hasData, isMe]);

    useEffect(() => {
        if (ref.current) {
            if (isMe) {
                ref.current.style.setProperty('--background-noise', currentUserBgColor);
            } else {
                ref.current.style.setProperty('--background-noise', otherUserBgColor);
            }
        }
    }, [hasData]);

    if (hasData) {
        return (
            <div className={cx('wrapper')}
                ref={ref}
            >
                <header className={cx('header')}>
                    {resultData.images.length > 0 
                        ? <img src={resultData.images[0].url} alt={`Image of ${resultData.name}`} className={cx('header-img')} /> 
                        : <div className={cx('header-img')}>
                            <PersonIcon />
                        </div>
                    }
                    
                    <div className={cx('header-title')}>
                        <h5>Profile</h5>
                        <h1>{resultData.display_name}</h1>
                        <span className={cx('header-total')}>
                                    {userPlaylists.items.filter((item) => item.public).length > 0 && `${userPlaylists.items.filter((item) => item.public).length} Public Playlists`}
                                </span>
                        {isMe 
                            ? <Link className={cx('header-total', 'header-total-artists')}>
                                    {followedArtists && followedArtists.artists.items.length > 0 && `${followedArtists.artists.items.length} Following`}
                                </Link>
                            : <span className={cx('header-total')}>
                                {`${Intl.NumberFormat().format(resultData.followers.total)} Followers`}
                            </span>
                        }
                    </div>
                </header>
                <div className={cx('interact')}>
                    {!isMe 
                        ? <>
                            {follow 
                            ? <Button dark outline className={cx('follow-btn')}>
                                follow
                            </Button>
                            : <Button dark outline className={cx('follow-btn', 'following')}>
                                following
                            </Button>}
                            <span className={cx('option-icon', 'tooltip')}>
                                <DotsIcon />
                            <span className={cx('tooltiptext')}>
                                More option for {resultData.display_name}</span>
                            </span>
                        </>
                        : null
                    }
                    
                </div>
                {isMe && <ContentFrame data={myTopTracks && myTopTracks.items} 
                    songs songCol4 showAll 
                    headerTitle='Top tracks this month'
                    currentUser
                    type='top-tracks'
                />}
                <ContentFrame 
                    myPlaylist={isMe}
                    isPlaylist 
                    normal 
                    data={userPlaylists.items.filter((item) => item.public)} 
                    headerTitle='Public Playlists'
                    showAll={userPlaylists.items.filter((item) => item.public).length > columnCount}
                    type='playlists'
                />
                {isMe && <ContentFrame isArtist normal 
                        data={followedArtists && followedArtists.artists.items} 
                        headerTitle='Following'
                        showAll={followedArtists && followedArtists.artists.items.length > columnCount}
                        type='following'
                    />
                }
                <ContentFooter />
            </div>
        );
    }
}

export default Profile;