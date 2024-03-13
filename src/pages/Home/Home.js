import { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import images from '~/assets/images';
import Segment from '~/components/Containers/Segment';
import MainFooter from '~/components/Blocks/MainFooter';
import classNames from "classnames/bind";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

export default function Home() {
    const { isLogin, spotifyApi, setBgHeaderColor, columnCount, removeDuplicates, containerWidth } = useContext(AppContext);
    
    const [myTopArtists, setMyTopArtists] = useState(null);
    const [featuredPlaylists, setFeaturedPlaylists] = useState(null);
    const [newReleases, setNewReleases] = useState(null);
    const [recentlyTracks, setRecentlyTracks] = useState(null);
    const [hasData, setHasData] = useState(false);
    const [greetingBgColor, setGreetingBgColor] = useState('');
    const [greetingColor, setGreetingColor] = useState('#fff');
    const [greeting, setGreeting] = useState('');
    const [hour, setHour] = useState(null);

    const ref = useRef(null);
    const date = new Date();

    useEffect(() => {
        setHour(date.getHours());
    }, [date])

    useEffect(() => {
        if (hour >= 6 && hour < 12) {
            setGreetingBgColor('#4CAF50');
            setGreeting('Good morning');
        } else if (hour >= 12 && hour < 18) {
            setGreetingBgColor('#FF9800'); 
            setGreeting('Good afternoon');
        } else if (hour >= 18 && hour < 22) {
            setGreetingBgColor('#1d434c'); 
            setGreeting('Good evening');
        } else {
            setGreetingBgColor('#082541'); 
            setGreeting('Good night');
        }
    }, [hour]);

    useEffect(() => {
        let isMounted = true;

        if (isLogin) {
            
            async function loadData () {
                const [topArtists, featured, releases, recently] =  await Promise.all([
                    spotifyApi.getMyTopArtists({limit: columnCount})
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)),

                    spotifyApi.getFeaturedPlaylists({limit: columnCount})
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)),
                    spotifyApi.getNewReleases({limit: columnCount})
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)),

                    spotifyApi.getMyRecentlyPlayedTracks()
                    .then((data) => {
                        let arr = [];
                        data.items.map(item => {
                            arr.push(item.track);
                        })
                        return removeDuplicates(arr, 'object', 'id');
                    })
                    .catch((error) => console.log('Error', error)),
                ]);
                if (isMounted) {
                    setHasData(true);
                    setMyTopArtists(topArtists);
                    setFeaturedPlaylists(featured);
                    setNewReleases(releases);
                    setRecentlyTracks(recently);
                    // console.log(recently.length)
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [isLogin, columnCount]);

    // console.log(newReleases)

    useEffect(() => {
        if (isLogin) {
            setBgHeaderColor(greetingBgColor);
        } else {
            setBgHeaderColor('#121212');
        }
    }, [greetingBgColor]);

    return ( 
        isLogin 
        ? (<div className={cx('wrapper', 'logged')} ref={ref}
            style={{
                backgroundImage: `linear-gradient(${greetingBgColor} 0 ,#121212 300px), url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=")`
            }}
        >
            <div className={cx('greeting')}
                style={{
                    color: greetingColor,
                    width: `${containerWidth}px`,
                    padding: `0 clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px) clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px)`,
                    fontSize: `clamp(4.7rem,4.7rem + (${containerWidth} - 372)/200 * 2.5rem,7.2rem)`,
                }}
            >
                {greeting}
            </div>
            {hasData && <>
                {recentlyTracks && <Segment normal isTrack
                    data={recentlyTracks.filter((item,index) => {
                        if (index < columnCount) {
                            return item;
                        }
                    })} 
                    headerTitle='Recently Tracks' 
                    showAll={recentlyTracks.length > columnCount}
                    type='recently'
                    
                />}
                {myTopArtists && <Segment normal isArtist 
                    data={myTopArtists.items} 
                    headerTitle='Your Top Artist' 
                    showAll={myTopArtists.total > columnCount} 
                    type='top-artists'
                />}
                {featuredPlaylists && <Segment normal isPlaylist 
                    data={featuredPlaylists.playlists.items} 
                    headerTitle='Featured Playlists' 
                    showAll={featuredPlaylists.playlists.total > columnCount} 
                    type='featured'
                />}
                {newReleases && <Segment normal isAlbum
                    data={newReleases.albums.items} 
                    headerTitle='New Releases' 
                    showAll={newReleases.albums.total > columnCount} 
                    type='new-releases'
                />}
            </> }
            <MainFooter />
        </div>)
        : <div className={cx('wrapper')}>
            <img src={images.logo} alt="Spotify logo" className={cx('logo-img')} />
        </div>);
}


