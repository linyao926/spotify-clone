import { useState, useContext, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { AlbumFallbackIcon } from '~/assets/icons';
import Collection from '../Collection';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import Segment from '~/components/Containers/Segment';
import classNames from 'classnames/bind';
import styles from './CollectionAlbums.module.scss';
import Loading from '~/components/Blocks/Loading';

const cx = classNames.bind(styles);

function CollectionAlbums() {
    const {
        spotifyApi,
        setTokenError,
        libraryAlbumIds,
        smallerWidth
    } = useContext(AppContext);

    const [albumsData, setAlbumsData] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            let albums;

            if (libraryAlbumIds) {
                albums = await Promise.all(
                    libraryAlbumIds .map((item) => spotifyApi.getAlbum(item.id)
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
                albums && setAlbumsData(albums);
            }
        }
        loadData();

        return () => (isMounted = false);
    }, [libraryAlbumIds]);

    return ( 
        <Collection>
            {libraryAlbumIds
                ? <div className='content'>
                    {albumsData ? <Segment normal
                        data={albumsData} 
                        headerTitle='Album'
                        notSwip
                        collection
                    /> : <Loading 
                        height={smallerWidth ? 'calc(100vh - 120px - 12px - 36px)' : 'calc(100vh - 64px - 72px - 16px - 24px)'}
                    />}
                </div>
                : (
                    <div className={cx('no-tracks-content')}>
                        <span className={cx('content-icon')}>
                            <AlbumFallbackIcon />
                        </span>
                        <h4 className={cx('content-title')}>Follow your first album</h4>
                        <span className={cx('content-subtitle')}>Save albums by tapping the heart icon.</span>
                        <ButtonPrimary>Find albums</ButtonPrimary>
                    </div>
                )
            }
        </Collection>
    );
}

export default CollectionAlbums;