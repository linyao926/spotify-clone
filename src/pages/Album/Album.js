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
import styles from './Album.module.scss';

const cx = classNames.bind(styles);

function Album() {
    const { spotifyApi, msToMinAndSeconds, totalDuration, convertMsToHM, bgHeaderColor, setBgHeaderColor } = useContext(AppContext);
    const [id, setId] = useState(null);
    const [resultData, setResultData] = useState([]);
    const [hasData, setHasData] = useState(false);
    const [colors, setColors] = useState(null);
    
    const ref = useRef(null);
    const {pathname} = useLocation();

    const date = new Date(resultData.release_date);
    const year = date.getFullYear();
    const month = date.toLocaleDateString("en-GB", {month: 'long'});
    const day = date.getDate();

    useEffect(() => {
        const indexStart = pathname.indexOf('/', 1) + 1;
        setId(pathname.slice(indexStart));
        setHasData(false);
    }, [pathname]);

    useEffect(() => {
        let isMounted = true;

        if (id) {
            
            async function loadData () {
                const data =  await spotifyApi.getAlbum(id)
                if (isMounted) {
                    setHasData(true);
                    setResultData(data)
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [id])

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
    }, [bgHeaderColor]);

    // console.log(resultData)

    if (hasData) {
        const tracksData = resultData.tracks.items;
        // console.log(tracksData)

        let totalTime = totalDuration(tracksData); 

        return (
            <div className={cx('wrapper')}
                ref={ref}
            >
                <header className={cx('header')}>
                    <img src={resultData.images[0].url} alt={`Image of ${resultData.name}`} className={cx('header-img')} />
                   
                    <div className={cx('header-title')}>
                        <h5>Album</h5>
                        <h1>{resultData.name}</h1>
                        <Link className={cx('header-creator')}>
                            {resultData.artists[0].name}
                        </Link>
                        <span className={cx('header-total')}>
                            {` • ${year} • ${resultData.total_tracks} songs, `}
                        </span>
                        <span className={cx('header-duration')}>
                            {totalTime > 3599000 
                            ? convertMsToHM(totalTime) 
                            : msToMinAndSeconds(totalTime)}
                        </span>
                    </div>
                </header>
                <div className={cx('interact')}>
                    <Button primary rounded large className={cx('play-btn')}>
                        <BsFillPlayFill />
                    </Button>
                    <span className={cx('save-icon', 'tooltip')}>
                        <HeartIcon />
                        <span className={cx('tooltiptext')}>Save to Your Library</span>
                    </span>
                    <span className={cx('option-icon', 'tooltip')}>
                        <DotsIcon />
                        <span className={cx('tooltiptext')}>More options for {resultData.name}</span>
                    </span>
                </div>
                <ContentFrame data={tracksData} songs isAlbum />
                <div className={cx('copyrights-label')}>
                    <span className={cx('release-time')}>{`${month} ${day}, ${year}`}</span>
                    {resultData.copyrights.map((item) => 
                        <span key={item.type}>
                            {`${item.type === 'P' ? '℗' : '©' } ${item.text}`}
                        </span>
                    )}
                </div>
                <ContentFooter />
            </div>
        );
    }
}

export default Album;