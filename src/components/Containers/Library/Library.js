import { useRef, useState, useEffect, useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import { useNavigate } from 'react-router-dom';
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import config from '~/config';
import { FillPinIcon, PinIcon } from '~/assets/icons';
import LibraryItem from '~/components/Blocks/LibraryItem';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import classNames from 'classnames/bind';
import styles from './Library.module.scss';

const cx = classNames.bind(styles);

function Library(props) {
    const { all, isAlbum, isArtist, isPlaylist, isMyPlaylist, height } = props;
    const {
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
        searchLibraryInputValue,
        getData,
        getInitialList,
        tokenError,
        token,
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
    const [pinIds, setPinIds] = useState(getInitialList('LIST_PINS') || ['like-tracks-list']);
    const [searchItems, setSearchItems] = useState(null);
    const [searchError, setSearchError] = useState(false);
    const [gridTemplateColumns, setGridTemplateColumns] = useState('repeat(4, minmax(0,1fr))');

    const containerRef = useRef(null);
    const contentRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (tokenError) {
            setHasData(false);
        }
    }, [tokenError, token]);

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
        localStorage.setItem('LIST_PINS', JSON.stringify(pinIds));
    }, [pinIds]);

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

            if (libraryPlaylistIds) {
                playlists = await Promise.all(
                    libraryPlaylistIds.map((item) => getData(spotifyApi.getPlaylist, item.id))
                );
            }

            if (libraryArtistIds) {
                artists = await Promise.all(
                    libraryArtistIds.map((item) => getData(spotifyApi.getArtist, item.id)),
                );
            }

            if (libraryAlbumIds) {
                albums = await Promise.all(
                    libraryAlbumIds.map((item) => getData(spotifyApi.getAlbum, item.id)),
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
                setUnsortedList(removeDuplicates(arr));
            }
        }
        
        if (!hasData) {
            loadData();
        }

        return () => (isMounted = false);
    }, [libraryPlaylistIds, libraryAlbumIds, libraryArtistIds, myPlaylistsData, likeTracks, hasData]);

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
            let resultListPin = [];
            if (pinIds) {
                pinIds.map((id) => {
                    const index = arr.findIndex((elem) => {
                        if (elem.item) {
                            return elem.item.id === id;
                        } else {
                            return elem.id === id;
                        }
                    });

                    if (index > -1) {
                        if (resultListPin) {
                            const tempPin = [...resultListPin, arr[index]];
                            resultListPin = removeDuplicates(tempPin, 'object', 'id');
                        } else {
                            resultListPin.push(arr[index]);
                        }
                        arr.splice(index, 1);
                    } 
                });
            }
           
            setPinListData(resultListPin);

            if (!sortByCreator) {
                setSortList(arr.sort((a, b) => {
                    if (a.item) {
                        if (b.item) {
                            return sortLibrary(a.item.name, b.item.name)
                        } else {
                            return sortLibrary(a.item.name, b.name)
                        }
                    } else {
                        if (b.item) {
                            return sortLibrary(a.name, b.item.name)
                        } else {
                            return sortLibrary(a.name, b.name)
                        }
                    }
                }));
            } else {
                // console.log(arr)
                const index = arr.findIndex((item) => { 
                    if (!item.item) {
                        return item.type === 'saved'}
                    });
                if (index > -1) {
                    arr.splice(index, 1);
                }

                setSortList(
                    arr.sort((a, b) => {
                        function getItemCreator (item) {
                            let creator;
                            if (item?.type) {
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

    useEffect(() => {
        if (searchLibraryInputValue.length > 0) {
            let result = [];

            const pushValue = (obj, isPin) => {
                if (obj.name.toLowerCase().includes(searchLibraryInputValue.toLowerCase())) {
                    result.push({
                        ...obj,
                        isPin: isPin,
                    });
                    result = removeDuplicates(result, 'object', 'name')
                }
            }
            
            if (pinListData) {
                pinListData.map((elem) => {
                    if (elem.item) {
                        pushValue(elem.item, true)
                    } else {
                        pushValue(elem, true)
                    }
                });
            } 
            if (sortList) {
                sortList.map((elem) => {
                    if (elem.item) {
                        pushValue(elem.item, false)
                    } else {
                        pushValue(elem, false)
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
    }, [searchLibraryInputValue]);

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
        let subTitle, toPage, img, imgUrl, subMenu, isMyPlaylist, dateRelease, item, artistData = false;
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
                    artistData = item.artists;
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
                            title: isPin ? 'Unpin playlist' : 'Pin playlist',
                            'handle-pin-item': 1,
                            lefticon: isPin ? <FillPinIcon /> : <PinIcon />,
                            lIconActive: isPin,
                        },
                    ];
            }
        } else {
            if (Object.keys(item).length > 0) {
                subTitle = compactLibrary ? `Playlist` : `Playlist • ${userData?.display_name}`;
                toPage = `/my-playlist/${item.id}`;
                subMenu = contextMenu['library-my-playlist'];
                imgUrl = item.img?.name ? URL.createObjectURL(item.img) : (item.fallbackImage ? item.fallbackImage : false);
                img = imgUrl ? true : false;
                isMyPlaylist = true;
                dateRelease = element['date_added'];
            } else {
                return null;
            }
        }

        let type;
        if (isMyPlaylist) {
            type = 'myPlaylist';
        } else if (item.type === 'saved') {
            type = 'likedTracks';
        } else {
            type = item.type;
        }

        return <LibraryItem
            key={item.id}
            title={item.name}
            subTitle={subTitle}
            img={img}
            imgUrl={img && imgUrl}
            submenu={subMenu}
            toPage={toPage}
            isArtist={item.type === 'artist'}
            isLikedSongs={item.type === 'saved'}
            isAlbum={item.type === 'album'}
            handleClickPinItem={() => handlePinItemClick(item)}
            toId={item.id}
            isPin={isPin}
            isMyPlaylist={isMyPlaylist}
            isPlaylist={item.type === 'playlist'}
            dateRelease={dateRelease}
            artistData={artistData}
            type={type}
        />;
    };

    const displayItemWithCondition = (elem, component) => {
        if ((all || isPlaylist) && !isMyPlaylist) {
            if (elem.item?.type === 'playlist' || elem.type === 'saved') {
                return component;
            }
        }

        if (all || isAlbum) {
            if (elem.item?.type === 'album') {
                return component;
            }
        }

        if (all || isArtist) {
            if (elem.item?.type === 'artist') {
                return component;
            }
        }

        if (all || isPlaylist) {
            if (!elem.item?.type) {
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

    // console.log(rect)

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
                                if (Object.keys(item).length > 0) {
                                    const comp = returnComponent(item, item.isPin);
                                    return displayItemWithCondition(item, comp);
                                }
                                // console.log(item)
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
                    <ButtonPrimary
                        className={cx('create-btn')}
                        onClick={() => {
                            createPlaylist(setMyPlaylistsData, myPlaylistsData);
                            navigate(`/my-playlist/${myPlaylistsData.length + 1}`);
                        }}
                    >
                        Create playlist
                    </ButtonPrimary>
                </div>
            </div>
        );
    }
}

export default Library;
