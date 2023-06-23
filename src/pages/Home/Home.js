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
    const { isLogin, popularAlbumsId, popularArtistsId, spotifyApi, setBgHeaderColor } = useContext(AppContext);
    const [albumsData, setAlbumsData] = useState(null);
    const [artistsData, setArtistsData] = useState(null);
    const [hasData, setHasData] = useState(false);

    const ref = useRef(null);

    useEffect(() => {
        let isMounted = true;

        if (isLogin) {
            
            async function loadData () {
                const [popularArtists, popularAlbums] =  await Promise.all([
                    spotifyApi.getArtists(popularArtistsId),
                    spotifyApi.getAlbums(popularAlbumsId),
                ]);
                if (isMounted) {
                    setHasData(true);
                    setAlbumsData(popularAlbums);
                    setArtistsData(popularArtists);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [isLogin]);

    useEffect(() => {
        setBgHeaderColor('#121212');
    }, []);
    
    return ( 
        isLogin 
        ? hasData && (<div className={cx('wrapper', 'logged')} ref={ref}>
            <ContentFrame normal isAlbum data={albumsData.albums} headerTitle='Popular Albums' />
            <ContentFrame normal isArtist data={artistsData.artists} artist headerTitle='Popular Artists' />
            {/* <ContentFrame normal data={resultData.albums.items} headerTitle='New Releases' showAll />  */}
            <ContentFooter />
        </div>)
        : <div className={cx('wrapper')}>
            <img src={images.logo} alt="Spotify logo" className={cx('logo-img')} />
        </div>);
    
    
}


