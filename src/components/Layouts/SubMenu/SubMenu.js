import { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Notification from '~/components/Notification';
import { RowRightIcon } from '~/assets/icons/icons';
import SearchForm from '~/components/SearchForm';
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
    trackIds,
    renderFunc,
    artistSubmenu,
    getPinId,
    queueId,
    toId,
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
    children,
    className,
    onClick,
    ...passProps
}) {
    const {
        spotifyApi,
        handleLogout,
        mainContainer,
        widthNavbar,
        nowPlayingId,
        setNowPlayingId,
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
        sortByCreator,
        setSortByCreator,
        renderModal,
        myPlaylistId,
        setMyPlaylistId,
        searchMyPlaylistValue,
        setSearchMyPlaylistValue,
        setRemindText,
        setShowRemind,
        handleRemoveData,
        handleSaveItemToList,
        setCurrentPlayingIndex,
    } = useContext(AppContext);

    const params = useParams();

    const [renderMyPlaylist, setRenderMyPlaylist] = useState([
        {
            title: (
                <SearchForm
                    submenu
                    placeholder={'Find a playlist'}
                    setFunc={setSearchMyPlaylistValue}
                    inputValue={searchMyPlaylistValue}
                />
            ),
            isSearch: 1,
        },
        {
            title: 'Create playlist',
            border: 1,
            'handle-create-playlist': 1,
        },
    ]);
    const [albumTrackIds, setAlbumTrackIds] = useState(null);
    const [queueTrackIds, setQueueTrackIds] = useState(null);

    const navigate = useNavigate();

    const menuRef = useRef(null);
    const childRef = useRef(null);

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
                    .catch((error) => console.log('Error', error));
                if (isMounted) {
                    setAlbumTrackIds(data.map((item) => item.id));
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, [toId, isAlbum]);

    // console.log(albumTrackIds)

    useEffect(() => {
        if (menuRef.current) {
            if (pointY + menuRef.current.clientHeight > mainContainer.height) {
                menuRef.current.style.bottom = `${bottom}px`;
            } else {
                menuRef.current.style.top = `${pointY}px`;
            }

            if (pointX - widthNavbar - 16 + menuRef.current.clientWidth > mainContainer.width) {
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
                if (elem.name.toLowerCase().includes(searchMyPlaylistValue.toLowerCase())) {
                    arr.push({
                        title: elem.name,
                        'handle-add-data': 1,
                        id: elem.id,
                    });
                    arr = removeDuplicates(arr, 'object', 'title');
                }
            });

            setRenderMyPlaylist(arr);
        } else {
            setRenderMyPlaylist([
                {
                    title: <SearchForm submenu placeholder={'Find a playlist'} />,
                    isSearch: 1,
                },
                {
                    title: 'Create playlist',
                    border: 1,
                    'handle-create-playlist': 1,
                },
            ]);
        }
    }, [searchMyPlaylistValue, myPlaylistsData]);

    // console.log(searchMyPlaylistValue)

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
                        .catch((error) => console.log('Error', error));
                }

                if (isPlaylist) {
                    listIds = await spotifyApi
                        .getPlaylistTracks(toId, { limit: 100 })
                        .then((data) => {
                            // console.log(data)
                            return data.items.map((item) => item.track.id);
                        })
                        .catch((error) => console.log('Error', error));
                }

                // console.log(listIds)

                if (isMounted) {
                    setQueueTrackIds(listIds);
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, []);

    useEffect(() => {
        if (isMyPlaylist) {
            if (myPlaylistsData[toId - 1]) {
                if (myPlaylistsData[toId - 1].tracks && myPlaylistsData[toId - 1].tracks.length > 0) {
                    setQueueTrackIds([...myPlaylistsData[toId - 1].tracks]);
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
            const index = temp.findIndex((value) => value === id);
            if (index > -1) {
                getPinId();
                temp.splice(index, 1);
                result = temp;
            } else {
                const arr = [...data, { id: id, date_added: date }];
                result = removeDuplicates(arr);
            }
        } else {
            result = [{ id: id, date_added: date }];
        }

        // console.log(result)
        return result;
    };

    return (
        <div
            className={cx('wrapper-submenu')}
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onClick && onClick();
            }}
        >
            <div className={classes} ref={menuRef}>
                {menu.map((item, index) => {
                    let path;
                    let child;

                    if (item.to) {
                        if (item.routed) {
                            path = item.to + '/' + toId;
                        } else {
                            path = item.to;
                        }

                        if (artistSubmenu) {
                            if (item.to == '/artist') {
                                item.child = true;
                            }
                        } else {
                            if (item.to == '/artist') {
                                path = item.to + '/' + toId;
                            }
                        }
                    } else if (item.href) {
                        path = item.href;
                    }

                    if (item.child) {
                        if (item.to === '/artist') {
                            child = artistSubmenu;
                        } else {
                            child = renderMyPlaylist;
                        }
                    }

                    const handleClick = (e) => {
                        if (item.logout) {
                            handleLogout();
                        }

                        if (item.sort) {
                            e.preventDefault();
                            if (item.value === 'creator') {
                                setSortByCreator(true);
                            } else {
                                setSortByCreator(false);
                            }
                        }

                        if (item['handle-data-with-queue']) {
                            e.preventDefault();
                            const arr = nextQueueId ? [...nextQueueId] : [];

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

                            // console.log(queueTrackIds)
                            setShowRemind(true);
                            setRemindText('Added to queue');
                            setNextQueueId(arr);
                        }

                        if (item['handle-create-playlist']) {
                            e.preventDefault();
                            createPlaylist(setMyPlaylistsData, myPlaylistsData);
                            navigate(`/my-playlist/${myPlaylistsData.length + 1}`);
                        }

                        const date = new Date();

                        if (item['handle-playlist-library']) {
                            e.preventDefault();
                            setLibraryPlaylistIds(handleDataRelatedLibrary(libraryPlaylistIds, toId, date));
                        }

                        if (item['handle-album-library']) {
                            e.preventDefault();
                            setLibraryAlbumIds(handleDataRelatedLibrary(libraryAlbumIds, toId, date));
                        }

                        if (item['handle-follow']) {
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

                        if (item.child) {
                            e.stopPropagation();
                            e.preventDefault();
                        }

                        if (item.isSearch) {
                            e.stopPropagation();
                            e.preventDefault();
                        }

                        if (item['handle-add-data']) {
                            const items = [...myPlaylistsData];
                            let temp = { ...items[item.id - 1]};

                            // console.log(temp.tracks)
                            temp.tracks = handleSaveItemToList(temp.tracks, toId, date);
                            items[item.id - 1] = temp;
                            setMyPlaylistsData(items);
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

                    return (
                        <SubmenuItem
                            key={item.title}
                            item={item}
                            path={path}
                            isTitle2={isPin}
                            isHref={item.href}
                            isTo={item.to}
                            onClick={(e) => {
                                handleClick(e);
                                onClick && onClick();
                            }}
                            classes={classes}
                            child={child}
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
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default SubMenu;
