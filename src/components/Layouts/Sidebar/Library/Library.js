import { useRef, useState, useEffect, useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import { useNavigate } from 'react-router-dom';
import LibraryComponent from '~/components/LibraryComponent';
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars, ScrollbarsHidingPlugin, SizeObserverPlugin, ClickScrollPlugin } from 'overlayscrollbars';
import classNames from 'classnames/bind';
import styles from './Library.module.scss';
import Button from '~/components/Button/Button';
import config from '~/config';

const cx = classNames.bind(styles);

function Library(props) {
    const { all, isAlbum, isArtist, isPlaylist, isMyPlaylist, top, bottom } = props;
    const {
        isLogin,
        userData,
        spotifyApi,
        widthNavbar,
        compactLibrary,
        gridLibrary,
        contextMenu,
        existPlaylist,
        setExistPlaylist,
        collapse,
        createPlaylist,
        setMyPlaylistsData,
        myPlaylistsData,
        libraryArtistIds,
        libraryPlaylistIds,
        libraryAlbumIds,
        savedTracks,
        sortLibrary,
        sortByCreator,
        removeDuplicates,
        searchLibraryInputValue
    } = useContext(AppContext);

    const [hasData, setHasData] = useState(false);
    const [likeTracks, setLikeTracks] = useState({
        type: 'saved',
        name: 'Liked Songs',
        id: 'like-tracks-list',
    });
    const [unsortedList, setUnsortedList] = useState(null);
    const [sortList, setSortList] = useState(null);
    const [pinListData, setPinListData] = useState(null);
    const [pinIds, setPinIds] = useState(['like-tracks-list']);
    const [searchItems, setSearchItems] = useState(null);
    const [searchError, setSearchError] = useState(false);
    const [gridTemplateColumns, setGridTemplateColumns] = useState('repeat(4, minmax(0,1fr))');
    const [height, setHeight] = useState(0);

    // console.log(pinIds)

    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const defaultHeight = 237;

    const navigate = useNavigate();

    OverlayScrollbars.plugin(ClickScrollPlugin);
    if (containerRef.current) {
        OverlayScrollbars(
            {
                target: containerRef.current,
                elements: {
                    viewport: containerRef.current,
                },
            },
            {
                overflow: {
                    x: 'hidden',
                },
                scrollbars: {
                    theme: 'os-theme-light',
                    autoHide: 'move',
                    clickScroll: true,
                },
            },
        );

        containerRef.current.children[2].style.zIndex = '101';
    }

    useEffect(() => {
        if (top && bottom) {
            if (widthNavbar >= 584 && !gridLibrary) {
                setHeight(`${bottom - top - 18}px`);
            } else {
                setHeight(`${bottom - top}px`);
            }
        } else {
            setHeight(`${bottom - 212}px`);
        }
    }, [top, bottom])

    useEffect(() => {
        if (savedTracks?.length > 0) {
            setLikeTracks((prev) => ({
                ...prev,
                total: savedTracks.length,
            }));
        }
    }, [savedTracks]);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            let playlists, artists, albums;

            function getDataFromApi (method, id) {
                return method(id)
                .then((data) => data)
                .catch((error) => console.log('Error', error))
            }

            if (libraryPlaylistIds) {
                playlists = await Promise.all(
                    libraryPlaylistIds.map((item) => getDataFromApi(spotifyApi.getPlaylist, item.id))
                );
            }

            if (libraryArtistIds) {
                artists = await Promise.all(
                    libraryArtistIds.map((item) => getDataFromApi(spotifyApi.getArtist, item.id)),
                );
            }

            if (libraryAlbumIds) {
                albums = await Promise.all(
                    libraryAlbumIds.map((item) => getDataFromApi(spotifyApi.getAlbum, item.id)),
                );
            }

            if (isMounted) {
                setHasData(true);
                const arr = [];
                const addItemAndDateToArr = (items, array, source) => {
                    items.map((item, index) => {
                        array.push({
                            item: item,
                            'date_added': source[index]['date_added']
                        })
                    })
                };
                playlists && addItemAndDateToArr(playlists, arr, libraryPlaylistIds);
                albums && addItemAndDateToArr(albums, arr, libraryAlbumIds);
                artists && addItemAndDateToArr(artists, arr, libraryArtistIds);
                myPlaylistsData.length > 0 && myPlaylistsData.map(e => {
                    arr.push({
                        item: e,
                        'date_added': e.tracks ? e.tracks[0]['date_added'] : null,
                    })
                });
                likeTracks.total && arr.push(likeTracks);
                setUnsortedList(arr);
            }
        }
        loadData();

        return () => (isMounted = false);
    }, [libraryPlaylistIds, libraryAlbumIds, libraryArtistIds, myPlaylistsData, likeTracks]);

    useEffect(() => {
        if (
            savedTracks.length === 0 && 
            libraryPlaylistIds.length === 0 &&
            libraryAlbumIds.length === 0 &&
            libraryArtistIds.length === 0 &&
            myPlaylistsData.length === 0
        ) {
            setExistPlaylist(false);
        } else {
            setExistPlaylist(true);
        }
    }, [libraryPlaylistIds, savedTracks, libraryAlbumIds, libraryArtistIds, myPlaylistsData]);

    useEffect(() => {
        if (unsortedList) {
            const arr = [...unsortedList];
            if (pinIds) {
                setPinListData([]);
                pinIds.map((id) => {
                    const index = arr.findIndex((item) => item.id === id);

                    if (index > -1) {
                        if (pinListData) {
                            const tempPin = [...pinListData, arr[index]];
                            const unique = removeDuplicates(tempPin, 'object', 'id');
                            setPinListData(unique);
                        } else {
                            setPinListData([arr[index]]);
                        }
                        arr.splice(index, 1);
                    }
                });
            }

            if (!sortByCreator) {
                setSortList(arr.sort((a, b) => sortLibrary(a.item.name, b.item.name)));
            } else {
                const index = arr.findIndex((item) => item.item.type === 'saved');
                if (index > -1) {
                    arr.splice(index, 1);
                }

                setSortList(
                    arr.sort((a, b) => {
                        function getItemCreator (item) {
                            let creator;
                            if (item.type) {
                                switch (item.type) {
                                    case 'playlist':
                                        creator = item.owner.display_name;
                                        break;
                                    case 'album':
                                        creator = item.artists[0].name;
                                        break;
                                    case 'artist':
                                        creator = item.name;
                                        break;
                                }
                            } else {
                                creator = userData?.display_name;
                            }
                            return creator;
                        }

                        return sortLibrary(getItemCreator(a.item), getItemCreator(b.item));
                    }),
                );

                if (index > -1) {
                    const temp = [...arr, likeTracks];
                    setSortList(temp);
                }
            }
        }
    }, [pinIds, likeTracks, sortByCreator, hasData, unsortedList]);

    // console.log(pinListData);

    useEffect(() => {
        if (searchLibraryInputValue.length > 0) {
            let result = [];
            
            if (pinListData) {
                pinListData.map((elem) => {
                    if (elem.name.toLowerCase().includes(searchLibraryInputValue.toLowerCase())) {
                        result.push({
                            ...elem,
                            isPin: true,
                        });
                        result = removeDuplicates(result, 'object', 'name')
                    }
                });
            } 
            if (sortList) {
                sortList.map((elem) => {
                    if (elem.name.toLowerCase().includes(searchLibraryInputValue.toLowerCase())) {
                        result.push({
                            ...elem,
                            isPin: false,
                        });
                        result = removeDuplicates(result, 'object', 'name')
                    }
                });
            }

            setSearchItems(result);

            if (result.length === 0) {
                setSearchError(true);
            } else {
                setSearchError(false);
            }
        } else {
            setSearchError(false);
        }
    }, [searchLibraryInputValue])

    useEffect(() => {
        if (containerRef.current) {
            if (widthNavbar >= 584) {
                if (gridLibrary) {
                    containerRef.current.style.height = `${defaultHeight + 43}px`;
                } else {
                    containerRef.current.style.height = `${defaultHeight + 21}px`;
                }
            } else if (widthNavbar === 72) {
                containerRef.current.style.height = `${defaultHeight + 48}px`;
            } else {
                containerRef.current.style.height = `${defaultHeight}px`;
            }
        }
    }, [widthNavbar, gridLibrary]);

    useEffect(() => {
        if (containerRef.current) {
            if (widthNavbar >= 584 && widthNavbar < 700) {
                setGridTemplateColumns('repeat(4, minmax(0,1fr))');
            }
            if (widthNavbar >= 700 && widthNavbar < 840) {
                setGridTemplateColumns('repeat(5, minmax(0,1fr))');
            }
            if (widthNavbar >= 840) {
                setGridTemplateColumns('repeat(6, minmax(0,1fr))');
            }
        }
    }, [widthNavbar]);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.gridTemplateColumns = gridTemplateColumns;
        }
    }, [gridTemplateColumns]);

    const returnComponent = (element, isPin = false) => {
        let subTitle, toPage, img, imgUrl, subMenu, isMyPlaylist, dateRelease, item = false;
        if (element.item) {
            item = element.item;
        } else {
            item = element;
        }
        if (item.type) {
            img = item.images?.length > 0;
            imgUrl = img && item.images[0].url;

            if (item.type != 'saved') {
                dateRelease = element['date_added'];
            }
            switch (item.type) {
                case 'playlist':
                    subTitle = compactLibrary
                        ? `Playlist`
                        : `Playlist • ${item.owner.display_name}`;
                    toPage = `/playlist/${item.id}`;
                    subMenu = contextMenu['library-playlist'];
                    break;
                case 'album':
                    subTitle = compactLibrary ? (
                        <span>{item.album_type}</span>
                    ) : (
                        `${item.album_type} • ${item.artists[0].name}`
                    );
                    toPage = `/album/${item.id}`;
                    subMenu = contextMenu['library-album'];
                    break;
                case 'artist':
                    subTitle = 'Artist';
                    toPage = `/artist/${item.id}`;
                    subMenu = contextMenu['library-artist'];
                    break;
                case 'saved':
                    subTitle = compactLibrary
                        ? `Playlist`
                        : `Playlist • ${item.total} songs`;
                    img = false;
                    toPage = config.routes.likedTracks;
                    subMenu = [
                        {
                            title: item.isPin ? 'Unpin playlist' : 'Pin playlist',
                            'handle-pin-item': 1,
                        },
                    ];
            }
        } else {
            subTitle = compactLibrary ? `Playlist` : `Playlist • ${userData?.display_name}`;
            toPage = `/my-playlist/${item.id}`;
            subMenu = contextMenu['library-my-playlist'];
            img = item.img ? true : false;
            imgUrl = img && URL.createObjectURL(item.img);
            isMyPlaylist = true;
            dateRelease = element['date_added'];
        }

        return <LibraryComponent
            key={item.id}
            title={item.name}
            subTitle={subTitle}
            img={img}
            imgUrl={img && imgUrl}
            submenu={subMenu}
            toPage={toPage}
            isArtist={item.type === 'artist'}
            isLikedSongs={item.type === 'saved'}
            onClick={() => handlePinItemClick(item)}
            toId={item.id}
            isPin={isPin}
            isMyPlaylist={isMyPlaylist}
            dateRelease={dateRelease}
        />;
    };

    const displayItemWithCondition = (item, component) => {
        if ((all || isPlaylist) && !isMyPlaylist) {
            if (item.type === 'playlist' || item.type === 'saved') {
                return component;
            }
        }

        if (all || isAlbum) {
            if (item.type === 'album') {
                return component;
            }
        }

        if (all || isArtist) {
            if (item.type === 'artist') {
                return component;
            }
        }

        if (all || isPlaylist) {
            if (!item.type) {
                return component;
            }
        }
    };

    const handlePinItemClick = (item) => {
        const index = pinIds.findIndex(id => id === item.id);
        if (index > -1) {
            const temp = [...pinIds];
            temp.splice(index, 1);
            setPinIds(removeDuplicates(temp));
        } else {
            if (pinIds && (item.type ? item.type !== 'saved' : true)) {
                const arr = [...pinIds, item.id];
                const unique = removeDuplicates(arr);
                setPinIds(unique);
            } else {
                setPinIds([item.id]);
            }
        }
    };

    if (existPlaylist) {
        return (
            <div className={cx('wrapper')}>
                {widthNavbar >= 584 && !gridLibrary && (
                    <header className={cx('header')}>
                        <span className={cx('first')}>Title</span>
                        <span className={cx('var1')}>Date added</span>
                        <span className={cx('last')}>Played</span>
                    </header>
                )}
                {(hasData || myPlaylistsData.length > 0) && (
                <div
                    className={cx('container', widthNavbar === 72 && 'collapse-view')}
                    ref={containerRef}
                    style={{
                        height: height,
                    }}
                >
                    {searchLibraryInputValue.length > 0 
                    ? (
                        searchError 
                        ? <div className={cx('not-found')}>
                            <h4>Couldn't find '{searchLibraryInputValue}'</h4>
                            <p>Try searching again using a different spelling or keyword.</p>
                        </div>
                        : <div
                            className={cx('content', widthNavbar > 420 && gridLibrary && 'grid-view')}
                            ref={contentRef}
                        >
                            {searchItems && searchItems.map((item) => {
                                if (Object.keys(item.item).length > 0) {
                                    const comp = returnComponent(item, item.item.isPin);
                                    return displayItemWithCondition(item, comp);
                                }
                            })}
                        </div>
                    )
                    : <div
                        className={cx('content', widthNavbar > 420 && gridLibrary && 'grid-view')}
                        ref={contentRef}
                    >
                        {pinListData && pinListData.map((item) => {
                            if (Object.keys(item).length > 0) {
                                const comp = returnComponent(item, true);
                                return displayItemWithCondition(item, comp);
                            }
                        })}

                        {sortList && sortList.map((item) => {
                            if (Object.keys(item).length > 0) {
                                const comp = returnComponent(item);
                                return displayItemWithCondition(item, comp);
                            }
                        })}
                    </div>}
                </div>
                )}
            </div>
        );
    } else if (!collapse) {
        return (
            <div className={cx('wrapper', 'not-exist')}>
                <div className={cx('content', 'not-exist')}>
                    <h5>Create your first playlist</h5>
                    <span>It's easy, I'll help you</span>
                    <Button
                        className={cx('create-btn')}
                        onClick={() => {
                            createPlaylist(setMyPlaylistsData, myPlaylistsData);
                            navigate(`/my-playlist/${myPlaylistsData.length + 1}`);
                        }}
                    >
                        Create playlist
                    </Button>
                </div>
            </div>
        );
    }
}

export default Library;
