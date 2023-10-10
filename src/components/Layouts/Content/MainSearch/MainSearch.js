import { useContext, useState, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Outlet } from 'react-router-dom';
import ContentFrame from '~/components/Layouts/ContentFrame';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';
import classNames from 'classnames/bind';
import styles from './MainSearch.module.scss';

const cx = classNames.bind(styles);

function MainSearch() {
    const { spotifyApi, searchPageInputValue, columnCount, typeSearch } = useContext(AppContext);

    const [resultData, setResultData] = useState(null);
    const [error, setError] = useState(true);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        let isMounted = true;

        if (searchPageInputValue) {
            async function loadData() {
                const data = await spotifyApi
                    .search(searchPageInputValue, ['album', 'artist', 'playlist', 'track'], {
                        limit: columnCount,
                    })
                    .then((data) => {
                        if (
                            data.albums.total === 0 &&
                            data.playlists.total === 0 &&
                            data.tracks.total === 0 &&
                            data.artists.total === 0
                        ) {
                            setError(true);
                        } else {
                            setError(false);
                            return data;
                        }
                    })
                    .catch((error) => {
                        console.log('Error', error);
                        setError(true);
                    });
                if (isMounted) {
                    // console.log(data);
                    setResultData(data);
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, [searchPageInputValue, columnCount]);

    useEffect(() => {
        if (error) {
            setHasData(false);
        } else if (resultData && resultData !== 'undefined') {
            setHasData(true);
        }
    }, [error, resultData]);

    if (hasData) {
        return (
            <div className={cx('wrapper')}>
                {typeSearch === '' ? (
                    <>
                        <div className={cx('result-top-content')}>
                            {resultData.playlists && resultData.playlists.total > 0 && (
                                <ContentFrame data={resultData.playlists.items[0]} searchAll headerTitle="Top result" />
                            )}
                            {resultData.tracks && resultData.tracks.total > 0 && (
                                <ContentFrame data={resultData.tracks.items} songs searchAll headerTitle="Songs" />
                            )}
                        </div>
                        {resultData.artists && resultData.artists.total > 0 && (
                            <ContentFrame
                                normal
                                isArtist
                                data={resultData.artists.items}
                                artist
                                headerTitle="Artists"
                            />
                        )}
                        {resultData.albums && resultData.albums.total > 0 && (
                            <ContentFrame normal isAlbum data={resultData.albums.items} headerTitle="Albums" />
                        )}
                        {resultData.playlists && resultData.playlists.total > 0 && (
                            <ContentFrame normal isPlaylist data={resultData.playlists.items} headerTitle="Playlists" />
                        )}
                    </>
                ) : (
                    <Outlet />
                )}
                <ContentFooter />
            </div>
        );
    } else if (error) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('not-found')}>
                    <h4>No results found for '{searchPageInputValue}'</h4>
                    <p>Please make sure your words are spelled correctly, or use fewer or different keywords.</p>
                </div>
                <ContentFooter />
            </div>
        );
    }
}

export default MainSearch;
