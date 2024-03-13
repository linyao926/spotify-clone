import { useState, useContext, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { ArtistIcon } from '~/assets/icons';
import Collection from '../Collection';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import Segment from '~/components/Containers/Segment';
import classNames from 'classnames/bind';
import styles from './CollectionArtists.module.scss';

const cx = classNames.bind(styles);

function CollectionArtists() {
    const {
        spotifyApi,
        libraryArtistIds,
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
                    .catch((error) => console.log('Error', error)))
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
                    {artistsData && <Segment normal
                        data={artistsData} 
                        headerTitle='Artist'
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