import { useState, useContext, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { MusicNotesIcon } from '~/assets/icons';
import Collection from '../Collection';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import Segment from '~/components/Containers/Segment';
import classNames from 'classnames/bind';
import styles from './CollectionPlaylists.module.scss';
import Loading from '~/components/Blocks/Loading';

const cx = classNames.bind(styles);

function CollectionPlaylists() {
    const {
        spotifyApi,
        setTokenError,
        createPlaylist,
        setMyPlaylistsData,
        myPlaylistsData,
        libraryPlaylistIds,
        smallerWidth
    } = useContext(AppContext);

    const [playlistsData, setPlaylistsData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            let playlists;

            if (libraryPlaylistIds) {
                playlists = await Promise.all(
                    libraryPlaylistIds.map((item) => spotifyApi.getPlaylist(item.id)
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
                let arr = [];
                if (playlists) {
                    arr = arr.concat(playlists);
                };
                if (myPlaylistsData.length > 0) {
                    arr = arr.concat(myPlaylistsData);
                };
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
                    {playlistsData ? <Segment normal
                        data={playlistsData} 
                        headerTitle='Playlist'
                        notSwip
                        collection
                    /> : <Loading 
                        height={smallerWidth ? 'calc(100vh - 120px - 12px - 36px)' : 'calc(100vh - 64px - 72px - 16px - 24px)'}
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