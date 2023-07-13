import { useContext, useState, useEffect, useRef  } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams, NavLink } from 'react-router-dom';
import TrackItem from '~/components/Layouts/TrackItem';
import ContentFrame from '~/components/Layouts/ContentFrame';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';
import classNames from 'classnames/bind';
import styles from './Queue.module.scss';

const cx = classNames.bind(styles);

function Queue() {
    const { spotifyApi } = useContext(AppContext);

    const [tracksData, setTracksData] = useState(null);
    const [hasData, setHasData] = useState(false);

    const id = '2MV9MRVSXNTIS3ny31cx9c';

    useEffect(() => {
        let isMounted = true;

        if (id) {
            
            async function loadData () {
                const [tracks] =  await Promise.all([
                    spotifyApi.getMyCurrentPlayingTrack()
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)),
                ])
                if (isMounted) {
                    setHasData(true);
                    setTracksData(tracks);
                }
            }
            loadData();
        }
        
        return () => (isMounted = false);
    }, [id]);

    // console.log(tracksData)

    if (hasData) {
        return ( 
            <>
                <div className={cx('wrapper')}>
                    <h3>Queue</h3>
                    <div className={cx("frame")}>
                        <TrackItem />
                    </div>
                    <div className={cx("frame")}>
                        <ContentFrame />
                    </div>
                </div>
                <ContentFooter />
            </>
        );
    }
}

export default Queue;