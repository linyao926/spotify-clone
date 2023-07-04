import { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import ContentFrame from '~/components/Layouts/ContentFrame';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';
import images from '~/assets/images';
import config from '~/config';
import classNames from "classnames/bind";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

export default function Home() {
    const { isLogin, spotifyApi, setBgHeaderColor, columnCount } = useContext(AppContext);
    const [myTopArtists, setMyTopArtists] = useState(null);
    const [featuredPlaylists, setFeaturedPlaylists] = useState(null);
    const [newReleases, setNewReleases] = useState(null);
    const [recentlyTracks, setRecentlyTracks] = useState(null);
    const [hasData, setHasData] = useState(false);

    const ref = useRef(null);

    useEffect(() => {
        let isMounted = true;

        if (isLogin) {
            
            async function loadData () {
                const [topArtists, featured, releases, recently] =  await Promise.all([
                    spotifyApi.getMyTopArtists({limit: columnCount}),
                    spotifyApi.getFeaturedPlaylists({limit: columnCount}),
                    spotifyApi.getNewReleases({limit: columnCount}),
                    spotifyApi.getMyRecentlyPlayedTracks({limit: columnCount})
                ]);
                if (isMounted) {
                    // console.log(recently)
                    setHasData(true);
                    setMyTopArtists(topArtists);
                    setFeaturedPlaylists(featured);
                    setNewReleases(releases);
                    setRecentlyTracks(recently);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [isLogin, columnCount]);

    useEffect(() => {
        setBgHeaderColor('#121212');
    }, []);
    
    return ( 
        isLogin 
        ? hasData && (<div className={cx('wrapper', 'logged')} ref={ref}>
            {myTopArtists && <ContentFrame normal isArtist 
                data={myTopArtists.items} 
                headerTitle='Your Top Artist' 
                showAll={myTopArtists.total > columnCount} 

            />}
            {featuredPlaylists && <ContentFrame normal isPlaylist 
                data={featuredPlaylists.playlists.items} 
                headerTitle='Featured Playlists' 
                showAll={featuredPlaylists.playlists.total > columnCount} 
                
            />}
            {newReleases && <ContentFrame normal isAlbum
                data={newReleases.albums.items} 
                headerTitle='New Releases' 
                showAll={newReleases.albums.total > columnCount} 
                
            />}
            {recentlyTracks && <ContentFrame normal isTrack
                data={recentlyTracks.items} 
                headerTitle='Recently Tracks' 
                showAll
                
            />}

            <ContentFooter />
        </div>)
        : <div className={cx('wrapper')}>
            <img src={images.logo} alt="Spotify logo" className={cx('logo-img')} />
        </div>);
    
    
}


