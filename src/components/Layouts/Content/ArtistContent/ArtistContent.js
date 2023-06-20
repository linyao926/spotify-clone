import { extractColors } from 'extract-colors';
import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link } from 'react-router-dom';
import { HeartIcon, DotsIcon, ArtistIcon } from '~/assets/icons';
import { BsFillPlayFill } from 'react-icons/bs';
import Button from '~/components/Button';
import ContentFrame from '../../ContentFrame';
import ContentFooter from '../ContentFooter';
import classNames from 'classnames/bind';
import styles from './ArtistContent.module.scss';

const cx = classNames.bind(styles);

function ArtistContent({follow}) {
    const { tempUrl, fetchWebApi, msToMinAndSeconds, totalDuration, convertMsToHM, bgHeaderColor, setBgHeaderColor, columnCount } = useContext(AppContext);
    const [urls, setUrls] = useState(null);
    const [resultData, setResultData] = useState([]);
    const [hasData, setHasData] = useState(false);  
    const [colors, setColors] = useState(null);
    
    const ref = useRef(null);

    const id = '6HaGTQPmzraVmaVxvz6EUc';
    const typeData = ['albums', 'appears_on', 'top-tracks', 'related-artists']

    const date = new Date(resultData.release_date);
    const year = date.getFullYear();
    const month = date.toLocaleDateString("en-GB", {month: 'long'});
    const day = date.getDate();

    useEffect((limit = columnCount, offset = 0) => {
        let endpoint = `https://api.spotify.com/v1/artists/${id}`;
        setUrls((prev) => ({
            ...prev,
            main: endpoint,
        }));

        for (let key of typeData) {
            switch (key) {
                case 'albums':
                    setUrls((prev) => ({
                        ...prev,
                        [key]: `${endpoint}/albums?include_groups=album%2Csingle&limit=${limit}&offset=${offset}`,
                    }));
                    break;
                case 'appears_on':
                    setUrls((prev) => ({
                        ...prev,
                        [key]: `${endpoint}/albums?include_groups=appears_on&limit=${limit}&offset=${offset}`,
                    }));
                    break;
                case 'top-tracks':
                    setUrls((prev) => ({
                        ...prev,
                        [key]: `${endpoint}/top-tracks?market=VN`,
                    }));
                    break;
                case 'related-artists':
                    setUrls((prev) => ({
                        ...prev,
                        [key]: `${endpoint}/related-artists`,
                    }));
                    break;
            }
        }
    }, [])

    useEffect(() => {
        let isMounted = true;
        
        if (urls) {
            const fetchData = async () => {
                try {
                    const data = await Promise.all(
                        Object.keys(urls).map((key) => fetchWebApi(urls[key], 'GET'))
                    );
    
                    if (isMounted) {
                        setHasData(true);
                        Object.keys(urls).map((key, index) => {
                            setResultData((prev) => ({
                                ...prev,
                                [key]: data[index],
                            }));
                        })
                  }
                } catch (error) { 
                    console.log(error);
                }
            }; 

            fetchData();
        }
        
        return () => (isMounted = false);
    }, [urls, columnCount]);

    useEffect(() => {
        if (hasData) {
            extractColors(resultData.main.images[0].url, {crossOrigin: 'Anonymous'})
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

    if (hasData) {
        // const tracksData = resultData.main.tracks.items;
        // console.log(tracksData)

        // let totalTime = totalDuration(tracksData); 
        console.log(resultData['related-artists'].artists)
        return (
            <div className={cx('wrapper')}
                ref={ref}
            >
                <header className={cx('header')}>
                    {resultData.main.images.length > 0 
                        ? <img src={resultData.main.images[0].url} alt={`Image of ${resultData.main.name}`} className={cx('header-img')} /> 
                        : <div className={cx('header-img')}>
                            <ArtistIcon />
                        </div>
                    }
                   
                    <div className={cx('header-title')}>
                        <h5>Artist</h5>
                        <h1>{resultData.main.name}</h1>
                        <span className={cx('header-total')}>
                            {`${resultData.main.followers.total} Follower`}
                        </span>
                    </div>
                </header>
                <div className={cx('interact')}>
                    <Button primary rounded large className={cx('play-btn')}>
                        <BsFillPlayFill />
                    </Button>
                    {!follow 
                        ? <Button dark outline className={cx('follow-btn')}>
                            follow
                        </Button>
                        : <Button dark outline className={cx('follow-btn', 'following')}>
                            following
                        </Button>
                    }
                    <span className={cx('option-icon', 'tooltip')}>
                        <DotsIcon />
                        <span className={cx('tooltiptext')}>More options for {resultData.main.name}</span>
                    </span>
                </div>
                {/* <ContentFrame data={tracksData} songs isAlbum />
                <div className={cx('copyrights-label')}>
                    <span className={cx('release-time')}>{`${month} ${day}, ${year}`}</span>
                    {resultData.main.copyrights.map((item) => 
                        <span key={item.type}>
                            {`${item.type === 'P' ? '℗' : '©' } ${item.text}`}
                        </span>
                    )}
                </div> */}
                <ContentFrame data={resultData['top-tracks'].tracks} headerTitle='Popular' songs isArtist />
                <ContentFrame normal data={resultData.albums.items} headerTitle='Discography' showAll />
                <ContentFrame normal data={resultData['appears_on'].items} headerTitle='Appears On' showAll />
                <ContentFrame normal data={resultData['related-artists'].artists} artist headerTitle='Fans also like' showAll />
                <ContentFooter />
            </div>
        );
    }
}

export default ArtistContent;