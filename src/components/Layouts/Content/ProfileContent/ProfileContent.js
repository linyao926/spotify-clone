import { extractColors } from 'extract-colors';
import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link } from 'react-router-dom';
import { HeartIcon, DotsIcon, PersonIcon } from '~/assets/icons';
import { BsFillPlayFill } from 'react-icons/bs';
import Button from '~/components/Button';
import ContentFrame from '../../ContentFrame';
import ContentFooter from '../ContentFooter';
import classNames from 'classnames/bind';
import styles from './ProfileContent.module.scss';

const cx = classNames.bind(styles);

function ProfileContent({follow}) {
    const { tempUrl, fetchWebApi, msToMinAndSeconds, totalDuration, convertMsToHM, bgHeaderColor, setBgHeaderColor } = useContext(AppContext);
    const [resultData, setResultData] = useState([]);
    const [hasData, setHasData] = useState(false);
    
    const ref = useRef(null);

    const id = 'hz3ff7epsoumih578n2q5a480';
    const currentUserId = '31qkbbx4hcd6q4tykaqxsmn5vqzm';
    const otherUserBgColor = 'rgb(83, 83, 83)';
    const currentUserBgColor = 'rgb(64, 72, 160)';

    // const date = new Date(resultData.release_date);
    // const year = date.getFullYear();
    // const month = date.toLocaleDateString("en-GB", {month: 'long'});
    // const day = date.getDate();

    useEffect(() => {
        let isMounted = true;
        const url = tempUrl({
            ep: 'users',
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

    useEffect(() => {
        if (ref.current) {
            ref.current.style.setProperty('--background-noise', 'rgb(83, 83, 83)');
        }
    }, [hasData]);

    console.log(resultData)

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
                            {`${resultData.followers.total} Followers`}
                        </span>
                    </div>
                </header>
                <div className={cx('interact')}>
                    {follow 
                        ? <Button dark outline className={cx('follow-btn')}>
                            follow
                        </Button>
                        : <Button dark outline className={cx('follow-btn', 'following')}>
                            following
                        </Button>
                    }
                    <span className={cx('option-icon', 'tooltip')}>
                        <DotsIcon />
                        <span className={cx('tooltiptext')}>More option for {resultData.display_name}</span>
                    </span>
                </div>
                {/* <ContentFrame data={tracksData} songs isAlbum />
                <div className={cx('copyrights-label')}>
                    <span className={cx('release-time')}>{`${month} ${day}, ${year}`}</span>
                    {resultData.copyrights.map((item) => 
                        <span key={item.type}>
                            {`${item.type === 'P' ? '℗' : '©' } ${item.text}`}
                        </span>
                    )}
                </div>
                 */}
                <ContentFooter />
            </div>
        );
    }
}

export default ProfileContent;