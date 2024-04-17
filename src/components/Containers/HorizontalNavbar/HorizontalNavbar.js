import { useContext, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import Item from '../Sidebar/Item';
import classNames from 'classnames/bind';
import styles from './HorizontalNavbar.module.scss';
import { useWindowSize } from 'react-use';

const cx = classNames.bind(styles);

function HorizontalNavbar () {
    const { 
        SIDEBAR_ITEMS, 
        setShowSubContent,
        libraryPlaylistIds,
        libraryAlbumIds,
        libraryArtistIds,
        myPlaylistsData,
        savedTracks,
        setExistPlaylist
    } = useContext(AppContext);

    const { width } = useWindowSize();

    useEffect(() => {
        if (
            libraryPlaylistIds ||
            libraryAlbumIds ||
            libraryArtistIds ||
            myPlaylistsData.length > 0 ||
            savedTracks.length > 0
        ) {
            setExistPlaylist(true);
        }

        if (
            libraryPlaylistIds &&
            libraryAlbumIds &&
            libraryArtistIds &&
            myPlaylistsData.length === 0 &&
            savedTracks.length === 0
        ) {
            setExistPlaylist(false);
        }

    }, [
        libraryPlaylistIds,
        libraryAlbumIds,
        libraryArtistIds,
        myPlaylistsData,
        savedTracks
    ]);

    return (
        <ul className={cx('navbar')}>
            <Item item={SIDEBAR_ITEMS[0]} onClick={() => setShowSubContent(false)} />
            <Item item={SIDEBAR_ITEMS[1]} />
            <Item item={SIDEBAR_ITEMS[2]} /> 
        </ul>
    );
}

export default HorizontalNavbar;