import { extractColors } from 'extract-colors';
import { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useContextMenu } from '~/hooks';
import config from '~/config';
import { AlbumFallbackIcon } from '~/assets/icons';
import { BsFillPlayFill } from 'react-icons/bs';
import { VscHeartFilled } from 'react-icons/vsc';
import Collection from '../Collection';
import CollectionCard from '../CollectionCard';
import Button from '~/components/Button';
import SubMenu from '~/components/Layouts/SubMenu';
import ContentFrame from '~/components/Layouts/ContentFrame';
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
                    {albumsData && <ContentFrame normal
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
                        <Button 
                            
                        >Find albums</Button>
                    </div>
                )
            }
        </Collection>
    );
}

export default CollectionAlbums;