import { useContext, useState, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Outlet } from 'react-router-dom';
import Segment from '~/components/Containers/Segment';
import MainFooter from '~/components/Blocks/MainFooter';
import classNames from 'classnames/bind';
import styles from './SearchedContent.module.scss';

const cx = classNames.bind(styles);

function SearchedContent() {
    const { spotifyApi, searchPageInputValue, columnCount, typeSearch, containerWidth, getSearchTopResult } = useContext(AppContext);

    const [resultData, setResultData] = useState(null);
    const [error, setError] = useState(true);
    const [hasData, setHasData] = useState(false);
    const [topResult, setTopResult] = useState(null);

    useEffect(() => {
        let isMounted = true;

        if (searchPageInputValue) {
            async function loadData() {
                const data = await spotifyApi
                    .search(searchPageInputValue, ['album', 'artist', 'playlist', 'track'], {
                        limit: 10,
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
                    if (
                        data.albums.total > 0 &&
                        data.playlists.total > 0 &&
                        data.tracks.total > 0 &&
                        data.artists.total > 0
                    ) {
                        setTopResult(getSearchTopResult(data.tracks.items[0], data.artists.items[0], data.albums.items[0], data.playlists.items[0], searchPageInputValue))
                    }
                    setResultData(data);
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, [searchPageInputValue]);

    // console.log(resultData)

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
                        <div className={cx('result-top-content')}
                            style={{
                                width: `${containerWidth}px`,
                                flexWrap: containerWidth < 825 ? 'wrap' : 'nowrap',
                            }}
                        >
                            {topResult && (
                                <Segment data={topResult} searchAll headerTitle="Top result" />
                            )}
                            {resultData.tracks && resultData.tracks.total > 0 && (
                                <Segment data={resultData.tracks.items.filter((item, index) => index < 4)} songs searchAll 
                                    headerTitle="Songs" 
                                    colHeaderDuration
                                />
                            )}
                        </div>
                        {resultData.artists && resultData.artists.total > 0 && (
                            <Segment
                                normal
                                isArtist
                                data={resultData.artists.items.filter((item, index) => index < columnCount)}
                                artist
                                headerTitle="Artists"
                            />
                        )}
                        {resultData.albums && resultData.albums.total > 0 && (
                            <Segment normal isAlbum data={resultData.albums.items.filter((item, index) => index < columnCount)} headerTitle="Albums" />
                        )}
                        {resultData.playlists && resultData.playlists.total > 0 && (
                            <Segment normal isPlaylist data={resultData.playlists.items.filter((item, index) => index < columnCount)} headerTitle="Playlists" />
                        )}
                    </>
                ) : (
                    <Outlet />
                )}
                <MainFooter />
            </div>
        );
    } else if (error) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('not-found')}>
                    <h4>No results found for '{searchPageInputValue}'</h4>
                    <p>Please make sure your words are spelled correctly, or use fewer or different keywords.</p>
                </div>
                <MainFooter />
            </div>
        );
    }
}

export default SearchedContent;
