import { extractColors } from 'extract-colors';
import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link } from 'react-router-dom';
import { HeartIcon, DotsIcon } from '~/assets/icons';
import { BsFillPlayFill } from 'react-icons/bs';
import Button from '~/components/Button';
import ContentFrame from '../../ContentFrame';
import ContentFooter from '../ContentFooter';
import classNames from 'classnames/bind';
import styles from './PlaylistContent.module.scss';

const cx = classNames.bind(styles);

function PlaylistContent() {
    const { tempUrl, fetchWebApi, msToMinAndSeconds, totalDuration, convertMsToHM, bgHeaderColor, setBgHeaderColor } = useContext(AppContext);
    const [resultData, setResultData] = useState([]);
    const [hasData, setHasData] = useState(false);
    const [colors, setColors] = useState(null);

    const ref = useRef(null);

    const id = '19UeV9HYCsqmowfRg7bNxS';

    useEffect(() => {
        let isMounted = true;
        const url = tempUrl({
            ep: 'playlists',
            id: id,
        }) 
        const fetchData = async () => {
          try {
            const data = await fetchWebApi(url, 'GET');
            if (isMounted) {
              setHasData(true);
              setResultData(data);
            }
          } catch (error) { 
            console.log(error);
          }
        };
        
        fetchData();
        return () => (isMounted = false);
    }, []);
    // console.log(resultData)

    useEffect(() => {
        if (hasData) {
            extractColors(resultData.images[0].url, {crossOrigin: 'Anonymous'})
            .then(setColors)
            .catch(console.error);
        }
    }, [hasData]);

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
    }, [bgHeaderColor])

    if (hasData) {
        const tracksData = resultData.tracks.items;
        return (
            <div className={cx('wrapper')}
                ref={ref}
            >
                <header className={cx('header')}>
                    <img src={resultData.images[0].url} alt={`Image of ${resultData.name} playlist`} className={cx('header-img')} />
                   
                    <div className={cx('header-title')}>
                        <h5>Playlist</h5>
                        <h1>{resultData.name}</h1>
                        <Link className={cx('header-creator')}>{resultData.owner.display_name}</Link>
                        <span className={cx('header-total')}>
                            {` • ${resultData.followers.total} likes • ${resultData.tracks.total} songs, `}
                        </span>
                        <span className={cx('header-duration')}>{`about 4 hr`}</span>
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
                        <span className={cx('tooltiptext')}>More option for {resultData.name}</span>
                    </span>
                </div>
                <ContentFrame data={tracksData} songs isPlaylist />
                <ContentFooter />
            </div>
        );
    }
}

export default PlaylistContent;