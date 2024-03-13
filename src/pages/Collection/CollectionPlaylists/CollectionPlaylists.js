import { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { MusicNotesIcon } from '~/assets/icons';
import Collection from '../Collection';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import Segment from '~/components/Containers/Segment';
import classNames from 'classnames/bind';
import styles from './CollectionPlaylists.module.scss';

const cx = classNames.bind(styles);

function CollectionPlaylists() {
    const {
        spotifyApi,
        createPlaylist,
        setMyPlaylistsData,
        myPlaylistsData,
        libraryPlaylistIds,
    } = useContext(AppContext);

    const [playlistsData, setPlaylistsData] = useState(null);

    const contentRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            let playlists;

            if (libraryPlaylistIds) {
                playlists = await Promise.all(
                    libraryPlaylistIds.map((item) => spotifyApi.getPlaylist(item.id)
                    .then((data) => data)
                    .catch((error) => console.log('Error', error)))
                );
            }

            if (isMounted) {
                const arr = [];
                playlists && arr.push(...playlists);
                myPlaylistsData.length > 0 && arr.push(...myPlaylistsData);
                setPlaylistsData(arr);
            }
        }
        loadData();

        return () => (isMounted = false);
    }, [libraryPlaylistIds, myPlaylistsData]);

    return ( 
        <Collection>
            {(libraryPlaylistIds || myPlaylistsData.length > 0)
                ? <div className='content'>
                    {playlistsData && <Segment normal
                        data={playlistsData} 
                        headerTitle='Playlist'
                    />}
                </div>
                : (
                    <section className={cx('no-tracks-content')}>
                        <span className={cx('content-icon')}>
                            <MusicNotesIcon />
                        </span>
                        <h4 className={cx('content-title')}>Create your first playlist</h4>
                        <span className={cx('content-subtitle')}>It's easy, I'll help you.</span>
                        <ButtonPrimary 
                            onClick={() => {
                                createPlaylist(setMyPlaylistsData, myPlaylistsData);
                                navigate(`/my-playlist/${myPlaylistsData.length + 1}`);
                            }}
                        >Create playlist</ButtonPrimary>
                    </section>
                )
            }
        </Collection>
    );
}

export default CollectionPlaylists;