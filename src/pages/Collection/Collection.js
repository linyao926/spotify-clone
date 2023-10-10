import { extractColors } from 'extract-colors';
import { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { useParams, NavLink } from 'react-router-dom';
import { useContextMenu } from '~/hooks';
import config from '~/config';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';
import classNames from 'classnames/bind';
import styles from './Collection.module.scss';

const cx = classNames.bind(styles);

function Collection(props) {
    const {children} = props;

    const {
        widthNavbar,
        setBgHeaderColor,
    } = useContext(AppContext);

    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            setBgHeaderColor('#121212');
            containerRef.current.style.setProperty('--background-noise', '#121212');
        }
    }, [containerRef.current]);

    return (<div ref={containerRef}>
        <div className={cx('tabs')}
            style={{
                left: `${widthNavbar + 146}px`,
            }}
        >
            <NavLink className={({isActive}) => cx('playlist-tab', isActive && 'active')}
                to={config.routes.savedPlaylist}
            >
                Playlists
            </NavLink>
            <NavLink className={({isActive}) => cx('artist-tab', isActive && 'active')}
                to={config.routes.followArtists}
            >
                Artists
            </NavLink>
            <NavLink className={({isActive}) => cx('album-tab', isActive && 'active')}
                to={config.routes.likedAlbums}
            >
                Albums
            </NavLink>
            <NavLink className={({isActive}) => cx('track-tab', isActive && 'active')}
                to={config.routes.likedTracks}
            >
                Songs
            </NavLink>
        </div> 
        <div className={cx('container')}>
            {children}
        </div>
        <ContentFooter />
    </div>);
}

export default Collection;