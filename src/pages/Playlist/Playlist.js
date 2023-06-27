import { extractColors } from 'extract-colors';
import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useLocation } from 'react-router-dom';
import { HeartIcon, DotsIcon } from '~/assets/icons';
import { BsFillPlayFill } from 'react-icons/bs';
import Button from '~/components/Button';
import ContentFrame from '~/components/Layouts/ContentFrame';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';
import classNames from 'classnames/bind';
import styles from './Playlist.module.scss';

const cx = classNames.bind(styles);

function Playlist() {
    const { isLogin, spotifyApi, msToMinAndSeconds, totalDuration, convertMsToHM, bgHeaderColor, setBgHeaderColor } = useContext(AppContext);
    const [id, setId] = useState(null);
    const [playlistData, setPlaylistData] = useState([]);
    const [tracksData, setTracksData] = useState([]);
    const [hasData, setHasData] = useState(false);
    const [colors, setColors] = useState(null);

    const ref = useRef(null);
    const {pathname} = useLocation();

    useEffect(() => {
        const indexStart = pathname.indexOf('/', 1) + 1;
        setId(pathname.slice(indexStart))
    }, [pathname]);

    useEffect(() => {
        let isMounted = true;

        if (id) {
            
            async function loadData () {
                const [playlist, tracks] =  await Promise.all([
                    spotifyApi.getPlaylist(id),
                    spotifyApi.getPlaylist(id)
                    .then(function(data) {
                        return data.total;
                    })
                    .then(function(total) {
                        let limit = 100;
                        let offset = 0;
                        return spotifyApi.getPlaylistTracks(id, {
                            limit: limit,
                            offset: offset
                        })
                    })
                ])
                if (isMounted) {
                    setHasData(true);
                    setPlaylistData(playlist)
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [id]);
    // console.log(resultData)

    useEffect(() => {
        if (hasData) {
            extractColors(playlistData.images[0].url, {crossOrigin: 'Anonymous'})
            .then(setColors)
            .catch(console.error);
        }
    }, [hasData, id]);

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
    }, [ref.current, bgHeaderColor])

    if (hasData) {
        const tracksData = playlistData.tracks.items;
        // console.log(playlistData.tracks)
        let totalTime = () => {
            let total = 0;
            for (let val of tracksData) {
                // console.log(val.track.duration_ms)
                total += val.track.duration_ms;            
            }
            return total;
        }; 

        return (
            <div className={cx('wrapper')}
                ref={ref}
            >
                <header className={cx('header')}>
                    <img src={playlistData.images[0].url} alt={`Image of ${playlistData.name} playlist`} className={cx('header-img')} />
                   
                    <div className={cx('header-title')}>
                        <h5>Playlist</h5>
                        <h1>{playlistData.name}</h1>
                        {playlistData.description !== '' && 
                            <span className={cx('header-sub-title')}>
                                {playlistData.description}
                            </span>
                        }
                        <Link className={cx('header-creator')}
                            to={`/user/${playlistData.owner.id}`}
                        >{playlistData.owner.display_name}</Link>
                        <span className={cx('header-total')}>
                            {` • ${Intl.NumberFormat().format(playlistData.followers.total)} likes • ${playlistData.tracks.total} songs, `}
                        </span>
                        <span className={cx('header-duration')}>about {totalTime() > 3599000 
                            ? convertMsToHM(totalTime()) 
                            : msToMinAndSeconds(totalTime())}
                        </span>
                    </div>
                </header>
                <div className={cx('playlist-interact')}>
                    <Button primary rounded large className={cx('play-btn')}>
                        <BsFillPlayFill />
                    </Button>
                    <span className={cx('save-icon', 'tooltip')}>
                        <HeartIcon />
                        <span className={cx('tooltiptext')}>Save to Your Library</span>
                    </span>
                    <span className={cx('option-icon', 'tooltip')}>
                        <DotsIcon />
                        <span className={cx('tooltiptext')}>More option for {playlistData.name}</span>
                    </span>
                </div>
                <ContentFrame data={tracksData} songs isPlaylist />
                <ContentFooter />
            </div>
        );
    }
}

export default Playlist;