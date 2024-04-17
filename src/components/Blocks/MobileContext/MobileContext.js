import { useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './MobileContext.module.scss';

const cx = classNames.bind(styles);

export default function MobileContext (props) {
    const {
        img,
        fallbackIcon,
        title,
        subTitle,
        items,
        myPlaylist,
        setRenderSubmenu,
        toId,
        isRemove,
        toArtistId,
        toAlbumId,
        expand = false, 
        renderSubMenu,
    } = props;

    const {
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
        handleRemoveData,
        handleSaveItemToList,
    } = useContext(AppContext);

    const params = useParams();

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

    const handleClick = (item) => {
        const date = new Date();

        if (item.action === 'handle-playlist-library') {
            setLibraryPlaylistIds(handleDataRelatedLibrary(libraryPlaylistIds, toId, date));
        }

        if (item.action === 'handle-album-library') {
            
            setLibraryAlbumIds(handleDataRelatedLibrary(libraryAlbumIds, toId, date));
        }

        if (item.action === 'follow' || item.action === 'unfollow') {
            
            setLibraryArtistIds(handleDataRelatedLibrary(libraryArtistIds, toId, date));
        }

        if (item['handle-save']) {
            
            setSavedTracks(handleDataRelatedLibrary(savedTracks, toId, date));
        }

        if (item['handle-remove-track']) {
            handleRemoveData(myPlaylistsData, params.number - 1, setMyPlaylistsData, toId);
        }

        if (item['handle-remove-in-liked']) {
            handleRemoveData(savedTracks, null, setSavedTracks, toId);
        }

        setRenderSubmenu(false);
    };

    return (
        <div className={cx('wrapper')}
            style={{
                visibility: (expand && renderSubMenu) ? 'visible' : 'hidden',
                opacity: (expand && renderSubMenu) ? '1' : '0',
            }}
        >
            <div className={cx('menu')}>
                <div className={cx('info')}>
                    {img ? (
                        <img 
                            className={cx('img')}
                            src={myPlaylist 
                            ? (typeof img == 'string' ? img : URL.createObjectURL(img))
                            : img} 
                        />
                    ) : (
                        <div className={cx('img-fallback')}>
                            {fallbackIcon}
                        </div>
                    )}
                    <div className={cx('info-description')}>
                        <span className={cx('title')}>{title}</span>
                        <span className={cx('sub-title')}>{subTitle}</span>
                    </div>
                </div>
                <div className={cx('items-list')}>
                    {items.map((item, index) => {
                        let Comp = 'div';
                        if (item.to) {
                            Comp = Link;
                        } 

                        let path;
                    
                        if (item.to) {
                            if (item.to == '/artist') {
                                path = item.to + '/' + toArtistId;
                            } else if (item.routed) {
                                path = item.to + '/' + toAlbumId;
                            } else {
                                path = item.to;
                            }
                        } else if (item.href) {
                            path = item.href;
                        }

                        let element = (
                            <Comp key={index}
                                className={cx('item', (item.isRemove || item.active) && 'active')}
                                onClick={(e) => {
                                    handleClick(item)
                                }}
                                to={item.to ? path : null}
                            >
                                <span className={cx('left-icon')}>{item.lefticon}</span>
                                <span>{item.title}</span>
                            </Comp>
                        )

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
            <div className={cx('close-btn')}
                onClick={(e) => {
                    if(e && e.stopPropagation) e.stopPropagation(); 
                    e.preventDefault();
                    setRenderSubmenu(false);
                }}
            >close</div>
        </div>
    );
}