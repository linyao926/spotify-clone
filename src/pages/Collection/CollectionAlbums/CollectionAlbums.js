import { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { AlbumFallbackIcon } from '~/assets/icons';
import Collection from '../Collection';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import Segment from '~/components/Containers/Segment';
import classNames from 'classnames/bind';
import styles from './CollectionAlbums.module.scss';

const cx = classNames.bind(styles);

function CollectionAlbums() {
    const {
        spotifyApi,
        widthNavbar,
        contextMenu,
        libraryAlbumIds,
    } = useContext(AppContext);

    const [albumsData, setAlbumsData] = useState(null);

    const contentRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            let albums;

            if (libraryAlbumIds) {
                albums = await Promise.all(
                    libraryAlbumIds .map((item) => spotifyApi.getAlbum(item.id)
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)))
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
                    {albumsData && <Segment normal
                        data={albumsData} 
                        headerTitle='Album'
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