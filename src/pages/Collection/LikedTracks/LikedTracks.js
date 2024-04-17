import { useContext, useState, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link } from 'react-router-dom';
import { MusicalNoteIcon, PersonIcon } from '~/assets/icons';
import PageContentLayout from '~/components/Layouts/PageContentLayout';
import PageContentMobileLayout from '~/components/Layouts/PageContentMobileLayout';
import Segment from '~/components/Containers/Segment';
import MobileCardItem from '~/components/Blocks/MobileCardItem';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import PageTurnBtn from '~/components/Blocks/Buttons/PageTurnBtn';
import classNames from 'classnames/bind';
import styles from './LikedTracks.module.scss';

const cx = classNames.bind(styles);

function LikedTracks() {
    const {
        spotifyApi, 
        setTokenError,
        savedTracks,
        userData,
        smallerWidth,
    } = useContext(AppContext);

    // const [id, setId] = useState(null);
    const [tracksData, setTracksData] = useState(null);
    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        let isMounted = true;

        if (savedTracks.length > 0) {
            async function loadData () {
                const tracks = await Promise.all(
                    savedTracks.map((item) => spotifyApi.getTrack(item.id)
                    .then((data) => data)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    }))
                );

                if (isMounted) {
                    setTracksData(tracks);
                }
            }
            loadData();
        } 
        
        return () => (isMounted = false);
    }, [savedTracks]);

    if (userData) {
        if (smallerWidth) {
            return (
                <PageContentMobileLayout 
                    isLikedTracks
                    displayOption={false}
                    imgUrl={false}
                    title='Liked Songs'
                    type='Playlist'
                    fallbackIcon={<MusicalNoteIcon />}
                    subTitle={
                        <div className={cx('intro')}>
                            <span className={cx('header-total')}>
                                {savedTracks?.length > 0 && `${savedTracks.length} songs`}
                            </span>
                        </div>
                    }
                    renderPlay={savedTracks.length > 0}
                    toId={'/collection/tracks'}
                >
                    {savedTracks.length > 0 
                        ? (<>
                            {tracksData?.length > 0 && tracksData.map((item, index) => 
                            (
                                <MobileCardItem 
                                    key={item.id}
                                    isTrack={true}
                                    isPlaylistPage={true}
                                    img={item.album.images[0].url}
                                    title={item.name}
                                    type={item.type}
                                    artistsData={item.artists}
                                    toId={item.id}
                                    albumId={item.album.id}
                                    isClickPlay
                                    isLikedTracks
                                    index={index}
                                />
                            ))}
    
                            {pages > 1 && <PageTurnBtn 
                                pages={pages} 
                                setOffset={setOffset} 
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />}
                        </>)
                        : (
                            <div className={cx('no-tracks-content')}>
                                <span className={cx('content-icon')}>
                                    <MusicalNoteIcon />
                                </span>
                                <h4 className={cx('content-title')}>Songs you like will appear here</h4>
                                <span className={cx('content-subtitle')}>Save songs by tapping the heart icon.</span>
                                <ButtonPrimary>Find songs</ButtonPrimary>
                            </div>
                        )
                    }
                </PageContentMobileLayout >
            );
        } else {
            return (
                <PageContentLayout 
                    isLikedTracks
                    displayOption={false}
                    imgUrl={false}
                    title='Liked Songs'
                    type='Playlist'
                    fallbackIcon={<MusicalNoteIcon />}
                    subTitle={
                        <div className={cx('intro')}>
                            {userData && <div className={cx('header-creator-wrapper')}>
                                {userData.images.length > 0 
                                    ? <img src={userData.images[0].url} alt={`Image of ${userData.name}`} className={cx('creator-img')} /> 
                                    : <div className={cx('creator-img')}>
                                        <PersonIcon />
                                    </div>
                                }
                                <Link className={cx('header-creator')}
                                    to={`/user/${userData.id}`}
                                >{userData.display_name}</Link>
                            </div>}
                            <span className={cx('header-total')}>
                                {savedTracks?.length > 0 && ` • ${savedTracks.length} songs`}
                            </span>
                        </div>
                    }
                    renderPlay={savedTracks.length > 0}
                    toId={'/collection/tracks'}
                >
                    {savedTracks.length > 0 
                        ? (<>
                            {tracksData?.length > 0 && <Segment data={tracksData} 
                                songs isPlaylist likedTracks 
                                columnHeader
                                colHeaderIndex
                                colHeaderTitle
                                colHeaderAlbum
                                colHeaderDate
                                colHeaderDuration
                            />}
    
                            {pages > 1 && <PageTurnBtn 
                                pages={pages} 
                                setOffset={setOffset} 
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />}
                        </>)
                        : (
                            <div className={cx('no-tracks-content')}>
                                <span className={cx('content-icon')}>
                                    <MusicalNoteIcon />
                                </span>
                                <h4 className={cx('content-title')}>Songs you like will appear here</h4>
                                <span className={cx('content-subtitle')}>Save songs by tapping the heart icon.</span>
                                <ButtonPrimary>Find songs</ButtonPrimary>
                            </div>
                        )
                    }
                </PageContentLayout>
            );
        }
    } 
}

export default LikedTracks;