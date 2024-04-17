import { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { AppContext } from '~/context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import ButtonPrimary from '../Buttons/ButtonPrimary';
import SearchForm from '../SearchForm';
import SubmenuItem from './SubmenuItem';
import classNames from 'classnames/bind';
import styles from './SubMenu.module.scss';

const cx = classNames.bind(styles);

function SubMenu({
    isTrack = false,
    isAlbum = false,
    isPlaylist = false,
    isMyPlaylist = false,
    isPin = false,
    isRemove = false,
    trackIds,
    renderFunc,
    artistSubmenu = false,
    getPinId,
    queueId,
    toId,
    toAlbumId,
    toArtistId,
    menu,
    language,
    posLeft,
    pointY,
    pointX,
    icon,
    top,
    bottom,
    left,
    right,
    sidebar,
    dots,
    handleCloseSubMenu,
    children,
    className,
    ...passProps
}) {
    const {
        spotifyApi,
        handleLogout,
        mainContainer,
        widthNavbar,
        nowPlayingId,
        setNextQueueId,
        nextQueueId,
        setNextFromId,
        createPlaylist,
        setMyPlaylistsData,
        myPlaylistsData,
        libraryPlaylistIds,
        libraryAlbumIds,
        libraryArtistIds,
        savedTracks,
        setLibraryPlaylistIds,
        setLibraryAlbumIds,
        setLibraryArtistIds,
        setSavedTracks,
        removeDuplicates,
        setSortByCreator,
        renderModal,
        setMyPlaylistId,
        searchMyPlaylistValue,
        setSearchMyPlaylistValue,
        setRemindText,
        setShowRemind,
        handleRemoveData,
        handleSaveItemToList,
        setCurrentPlayingIndex,
        setCompactLibrary,
        setGridLibrary,
        setTokenError,
        tokenError,
        setRemindAddToMyPlaylist,
        setAlbumIsAllAdded,
        setAddNewOnesOfAlbum,
        setIdToMyplaylist,
        setMyPlaylistCurrentId,
    } = useContext(AppContext);

    const params = useParams();

    const [renderMyPlaylist, setRenderMyPlaylist] = useState([]);
    const [albumTrackIds, setAlbumTrackIds] = useState(null);
    const [queueTrackIds, setQueueTrackIds] = useState(null);

    const navigate = useNavigate();

    const menuRef = useRef(null);
    const childRef = useRef(null);

    const searchForm = [{
        title: (
            <SearchForm
                submenu
                placeholder={'Find a playlist'}
                inputValue={searchMyPlaylistValue}
                setFunc={setSearchMyPlaylistValue}
            />
        ),
        isSearch: 1,
    },
    {
        title: 'Create playlist',
        border: 1,
        'handle-create-playlist': 1,
    },]

    const classes = cx(
        'submenu-content',
        {
            [className]: className,
            language,
            icon,
        },
        posLeft && 'l-pos',
    );

    useEffect(() => {
        let isMounted = true;

        if (toId && isAlbum) {
            async function loadData() {
                const data = await spotifyApi
                    .getAlbum(toId)
                    .then((data) => data.tracks.items)
                    .catch((error) => {
                        console.log('Error', error)
                        if (error.status === 401) {
                            setTokenError(true);
                        }
                    });
                if (isMounted) {
                    setAlbumTrackIds(data.map((item) => item.id));
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, [toId, isAlbum, tokenError]);

    useEffect(() => {
        if (menuRef.current) {
            if (dots) {
                menuRef.current.style.top = `${pointY}px`;
            } else if (pointY + menuRef.current.clientHeight > window.innerHeight) {
                if (sidebar) {
                    menuRef.current.style.bottom = `${bottom/2}px`;
                } else {
                    menuRef.current.style.bottom = `${bottom}px`;
                }
            } else {
                menuRef.current.style.top = `${pointY}px`;
            }

            if (sidebar) {
                menuRef.current.style.left = `${right}px`;
            } else if (pointX - widthNavbar - 16 + menuRef.current.clientWidth > mainContainer.width) {
                menuRef.current.style.right = `${right}px`;
            } else {
                menuRef.current.style.left = `${pointX}px`;
            }
        }
    }, [menuRef.current]);

    useEffect(() => {
        if (searchMyPlaylistValue.length > 0 && myPlaylistsData.length > 0) {
            let arr = [...renderMyPlaylist];

            if (arr.length > 2) {
                let i = 2;
                while (i < arr.length) {
                    if (!arr[i].title.toLowerCase().includes(searchMyPlaylistValue.toLowerCase())) {
                        arr.splice(i, 1);
                    } else {
                        i++;
                    }
                }
            }

            myPlaylistsData.map((elem) => {
                if (Object.keys(elem).length > 0) {
                    if (elem.name.toLowerCase().includes(searchMyPlaylistValue.toLowerCase())) {
                        arr.push({
                            title: elem.name,
                            'handle-add-data': 1,
                            id: elem.id,
                        });
                        arr = removeDuplicates(arr, 'object', 'title');
                    }
                }
            });

            setRenderMyPlaylist(arr);
        } else {
            setRenderMyPlaylist([]);
        }
    }, [searchMyPlaylistValue, myPlaylistsData]);

    useEffect(() => {
        let isMounted = true;

        if (toId) {
            async function loadData() {
                let listIds;

                if (isAlbum) {
                    listIds = await spotifyApi
                        .getAlbumTracks(toId, {
                            limit: 50,
                        })
                        .then((data) => {
                            return data.items.map((item) => item.id);
                        })
                        .catch((error) => {
                            console.log('Error', error)
                            if (error.status === 401) {
                                setTokenError(true);
                            }
                        });
                }

                if (isPlaylist && !isMyPlaylist) {
                    listIds = await spotifyApi
                        .getPlaylistTracks(toId, { limit: 50 })
                        .then((data) => {
                            return data.items.map((item) => item.track.id);
                        })
                        .catch((error) => {
                            console.log('Error', error)
                            if (error.status === 401) {
                                setTokenError(true);
                            }
                        });
                }

                if (isMounted) {
                    setQueueTrackIds(listIds);
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, [toId, isPlaylist, isMyPlaylist, isAlbum]);

    useEffect(() => {
        if (isMyPlaylist) {
            if (myPlaylistsData[toId - 1]) {
                if (myPlaylistsData[toId - 1].tracks && myPlaylistsData[toId - 1].tracks.length > 0) {
                    const result = [];
                    myPlaylistsData[toId - 1].tracks.map(item => result.push(item.id))
                    setQueueTrackIds(result);
                }
            } else {
                if (toId.length > 0) {
                    setQueueTrackIds([...toId]);
                }
            }
        }
    }, []);

    const handleDataRelatedLibrary = (data, id, date) => {
        let result;
        if (data) {
            const temp = [...data];
            let i = -1;
            temp.map((item, index) => {
                if (item.id === id) {
                    i = index;
                }
            });
            if (i > -1) {
                getPinId();
                temp.splice(i, 1);
                result = temp;
            } else {
                const arr = [...data, { id: id, date_added: date }];
                result = removeDuplicates(arr);
            }
        } else {
            result = [{ id: id, date_added: date }];
        }

        return result;
    };

    // Handle click
    const handleDataWithQueue = (e) => {
        e.preventDefault();
        const arr = nextQueueId ? [...nextQueueId] : [];
        console.log('click queue');
    
        if (isTrack) {
            if (nowPlayingId) {
                arr.push(toId);
            } else {
                setCurrentPlayingIndex(0);
                setNextFromId({
                    id: toId,
                    type: 'track',
                });
            }
        } else {
            if (nowPlayingId) {
                queueTrackIds && arr.push(...queueTrackIds);
            } else {
                setCurrentPlayingIndex(0);
                queueTrackIds && arr.push(...queueTrackIds);
                queueTrackIds &&
                    setNextFromId({
                        id: arr.splice(0, 1),
                        type: 'track',
                    });
            }
        }
    
        setShowRemind(true);
        setRemindText('Added to queue');
        setNextQueueId(arr);
    };

    const handleCreatePlaylist = (e) => {
        e.preventDefault();
        createPlaylist(setMyPlaylistsData, myPlaylistsData);
        navigate(`/my-playlist/${myPlaylistsData.length + 1}`);
    };

    return (
        <div
            className={cx('wrapper-submenu')}
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setSearchMyPlaylistValue('');
                handleCloseSubMenu && handleCloseSubMenu();
            }}
        >
            <div className={classes} ref={menuRef}>
                {menu.map((item, index) => {
                    let path;
                    let child;
                    let isArtistSubmenu;

                    if (item.to) {
                        if (artistSubmenu) {
                            if (item.to == '/artist') {
                                item.child = true;
                            } else if (item.routed) {
                                path = item.to + '/' + toAlbumId;
                            } else {
                                path = item.to;
                            }
                        } else {
                            if (item.to == '/artist') {
                                path = item.to + '/' + toArtistId;
                            } else if (item.routed) {
                                path = item.to + '/' + toAlbumId;
                            } else {
                                path = item.to;
                            }
                        }
                    } else if (item.href) {
                        path = item.href;
                    }

                    if (item.child) {
                        if (item.to === '/artist') {
                            child = artistSubmenu;
                            isArtistSubmenu = true;
                        } else {
                            child = searchForm.concat(renderMyPlaylist);
                            isArtistSubmenu = false;
                        }
                    }

                    const handleClick = (e) => {
                        if (item.logout) {
                            handleLogout();
                        }

                        if (item.sort) {
                            e.preventDefault();
                            setSortByCreator(item.value === 'creator');
                        }

                        if (item.value === 'compact') {
                            e.preventDefault();
                            setCompactLibrary(true);
                        }

                        if (item.value === 'grid') {
                            e.preventDefault();
                            setGridLibrary(true);
                            setCompactLibrary(false);
                        }

                        if (item.value === 'list') {
                            e.preventDefault();
                            setGridLibrary(false);
                            setCompactLibrary(false);
                        }

                        if (item['handle-data-with-queue']) {
                            handleDataWithQueue(e);
                        }

                        if (item['handle-create-playlist']) {
                            handleCreatePlaylist(e);
                        }

                        const date = new Date();

                        if (item.action === 'handle-playlist-library') {
                            e.preventDefault();
                            setLibraryPlaylistIds(handleDataRelatedLibrary(libraryPlaylistIds, toId, date));
                        }

                        if (item.action === 'handle-album-library') {
                            e.preventDefault();
                            setLibraryAlbumIds(handleDataRelatedLibrary(libraryAlbumIds, toId, date));
                        }

                        if (item.action === 'follow' || item.action === 'unfollow') {
                            e.preventDefault();
                            setLibraryArtistIds(handleDataRelatedLibrary(libraryArtistIds, toId, date));
                        }

                        if (item['handle-save']) {
                            e.preventDefault();
                            setSavedTracks(handleDataRelatedLibrary(savedTracks, toId, date));
                        }

                        if (item['handle-pin-item']) {
                            e.preventDefault();
                            getPinId();
                        }

                        if (item['handle-edit-details']) {
                            renderModal();
                            setMyPlaylistId(toId);
                        }

                        if (item['handle-delete-playlist']) {
                            const temp = [...myPlaylistsData];
                            temp[toId - 1] = {};
                            setMyPlaylistsData(temp);
                        }

                        if (item.child || item.isSearch) {
                            e.preventDefault();
                        }

                        if (item['handle-add-data']) {
                            const items = [...myPlaylistsData];
                            let temp = items[item.id - 1];
                            let hasThisId = false;
                            const checkId = (array, id) => {
                                let result = false;
                                array.map(element => {
                                    if (element.id) {
                                        if (element.id === id) {
                                            result = true;
                                        }
                                    } else {
                                        if (element === id) {
                                            result = true;
                                        }
                                    }
                                    return;
                                });

                                return result;
                            }

                            if (isAlbum) {
                                if (temp.albums) {
                                    hasThisId = checkId(temp.albums, toId);
                                    setIdToMyplaylist(queueTrackIds);
                                    const newOnes = queueTrackIds.filter(id => !checkId(temp.tracks, id));
                                    if (newOnes.length > 0) {
                                        setAddNewOnesOfAlbum(newOnes);
                                        setAlbumIsAllAdded(false);
                                    } else {
                                        setAddNewOnesOfAlbum([]);
                                        setAlbumIsAllAdded(true);
                                    }
                                }
                            } else {
                                if (temp.tracks) {
                                    setIdToMyplaylist(toId);
                                    hasThisId = checkId(temp.tracks, toId);
                                } 
                            }

                            if (hasThisId) {
                                setRemindAddToMyPlaylist(true);
                                setRemindText(item.title);
                                setMyPlaylistCurrentId(item.id - 1);
                            } else {
                                if (isAlbum) {
                                    temp.tracks = handleSaveItemToList(temp.tracks, queueTrackIds, date);
                                    if (temp.albums) {
                                        temp.albums.push(toId);
                                    } else {
                                        temp.albums = [toId];
                                    }
                                } else {
                                    temp.tracks = handleSaveItemToList(temp.tracks, toId, date);
                                }

                                items[item.id - 1] = temp;
                                setMyPlaylistsData(items);
                                setShowRemind(true);
                                setRemindText(`Added to ${item.title}`);
                            }
                        }

                        if (item['handle-remove-track']) {
                            handleRemoveData(myPlaylistsData, params.number - 1, setMyPlaylistsData, toId);
                        }

                        if (item['handle-remove-in-liked']) {
                            handleRemoveData(savedTracks, null, setSavedTracks, toId);
                        }

                        if (item['handle-remove-from-queue']) {
                            handleRemoveData(nextQueueId, null, setNextQueueId, toId);
                        }
                    };

                    const classes = [
                        cx(
                            'item',
                            item.child && 'children',
                            item.isSearch && 'search',
                            item.border && 'bd-bt',
                            item.disable && 'disable',
                            item.active && 'active',
                        ),
                    ];

                    let element = (
                        <SubmenuItem
                            key={item.title}
                            item={item}
                            path={path}
                            isTitle2={isPin}
                            isHref={item.href}
                            isTo={item.to}
                            handleClick={(e) => {
                                handleClick(e)
                            }}
                            handleCloseSubMenu={handleCloseSubMenu}
                            classes={classes}
                            child={item.child ? child : false}
                            ref={childRef}
                            parent={{
                                height: menuRef.current?.getBoundingClientRect().height,
                                width: menuRef.current?.clientWidth,
                            }}
                            pointX={pointX}
                            pointY={pointY}
                            itemIndex={index}
                            isSearch={item.isSearch}
                            toId={toId}
                            albumTrackIds={albumTrackIds}
                            searchMyPlaylistValue={searchMyPlaylistValue}
                            isArtistSubmenu={isArtistSubmenu}
                            isAlbum={isAlbum}
                            isRemove={isRemove}
                        />)

                    if (item.isAdd) {
                        if (!isRemove) {
                            return element;
                        }
                    } else if (item.isRemove) {
                        if (isRemove) {
                            return element;
                        }
                    } else {
                        return element;
                    }
                })}
            </div>
        </div>
    );
}

export default SubMenu;
