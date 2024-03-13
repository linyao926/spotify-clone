import { extractColors } from 'extract-colors';
import { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { useParams, NavLink } from 'react-router-dom';
import { useContextMenu } from '~/hooks';
import { DropDownIcon, DropUpIcon } from '~/assets/icons/icons';
import config from '~/config';
import SubMenu from '~/components/Blocks/SubMenu';
import MainFooter from '~/components/Blocks/MainFooter';
import classNames from 'classnames/bind';
import styles from './Collection.module.scss';

const cx = classNames.bind(styles);

function Collection(props) {
    const {children} = props;

    const {
        widthNavbar,
        setBgHeaderColor,
        posHeaderNextBtn,
        containerWidth,
        COLLECTION_TABS,
    } = useContext(AppContext);

    const { ref, isComponentVisible, setIsComponentVisible, points, setPoints } = useContextMenu();

    const containerRef = useRef(null);

    const params = useParams();

    useEffect(() => {
        if (containerRef.current) {
            setBgHeaderColor('#121212');
            containerRef.current.style.setProperty('--background-noise', '#121212');
        }
    }, [containerRef.current]);

    let rect;

    if (ref.current) {
        rect = ref.current.getBoundingClientRect();
    }

    return (<div ref={containerRef}>
        <div className={cx('tabs', containerWidth <= 720 && 'tabs-dropdown')}
            style={{
                left: `${posHeaderNextBtn.right + 16}px`,
            }}
            ref={ref}
            onClick={() => {
                if (containerWidth <= 720) {
                    setIsComponentVisible(!isComponentVisible)
                }
            }}
        >
            {containerWidth > 720 ? <>
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
            </>
            : <>
                <div className={cx('dropdown')}>
                    {COLLECTION_TABS.map((item) => {
                        const href = window.location.href.toString();
                        if (href.includes(item.value)) {
                            return item.title;
                        }
                    })}
                </div>
               <span>{isComponentVisible ? <DropUpIcon /> : <DropDownIcon />}</span>
                {isComponentVisible && <SubMenu className={cx('submenu')} 
                    menu={COLLECTION_TABS} 
                    onClick={() => setIsComponentVisible(false)}  
                    right={rect.x}
                    bottom={window.innerHeight - rect.y}
                    pointY={rect.y + rect.height + 8}
                    pointX={rect.x}
                />}
            </>}
        </div> 
        <div className={cx('container')}>
            {children}
        </div>
        <MainFooter />
    </div>);
}

export default Collection;