import { useState, useContext, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { ArtistIcon } from '~/assets/icons';
import Collection from '../Collection';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import Segment from '~/components/Containers/Segment';
import classNames from 'classnames/bind';
import styles from './CollectionArtists.module.scss';
import Loading from '~/components/Blocks/Loading';

const cx = classNames.bind(styles);

function CollectionArtists() {
    const {
        spotifyApi,
        setTokenError,
        libraryArtistIds,
        smallerWidth
    } = useContext(AppContext);

    const [artistsData, setArtistsData] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            let artists;

            if (libraryArtistIds) {
                artists = await Promise.all(
                    libraryArtistIds .map((item) => spotifyApi.getArtist(item.id)
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    }))
                );
            } 

            if (isMounted) {
                artists && setArtistsData(artists);
            }
        }
        loadData();

        return () => (isMounted = false);
    }, [libraryArtistIds]);

    return ( 
        <Collection>
            {libraryArtistIds
                ? <div className='content'>
                    {artistsData ? <Segment normal
                        data={artistsData} 
                        headerTitle='Artist'
                        notSwip
                        collection
                    /> : <Loading 
                        height={smallerWidth ? 'calc(100vh - 120px - 12px - 36px)' : 'calc(100vh - 64px - 72px - 16px - 24px)'}
                    />}
                </div>
                : (
                    <div className={cx('no-tracks-content')}>
                        <span className={cx('content-icon')}>
                            <ArtistIcon />
                        </span>
                        <h4 className={cx('content-title')}>Follow your first artist</h4>
                        <span className={cx('content-subtitle')}>Follow artists you like by tapping the follow button.</span>
                        <ButtonPrimary>Find artists</ButtonPrimary>
                    </div>
                )
            }
        </Collection>
    );
}

export default CollectionArtists;