import { useContext, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { NavLink, Link } from 'react-router-dom';
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
        setBgHeaderColor,
        posHeaderNextBtn,
        COLLECTION_TABS,
        smallerWidth,
        containerWidth,
    } = useContext(AppContext);

    const { ref, isComponentVisible, setIsComponentVisible, points, setPoints } = useContextMenu();

    const containerRef = useRef(null);

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

    return (
    <div ref={containerRef}>
        <div className={cx('tabs', (smallerWidth || containerWidth <= 720) && 'tabs-dropdown')}
            style={{
                left: smallerWidth ? 'none' : `${posHeaderNextBtn.right + 16}px`,
            }}
            ref={ref}
            onClick={() => {
                if (smallerWidth || containerWidth <= 720) {
                    setIsComponentVisible(!isComponentVisible)
                }
            }}
        >
            {(!smallerWidth && containerWidth > 720 ) && <>
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
            </> }
            <>
                <div className={cx('dropdown')}>
                    {COLLECTION_TABS.map((item) => {
                        const href = window.location.href.toString();
                        if (href.includes(item.value)) {
                            return item.title;
                        }
                    })}
                </div>
                <span>{isComponentVisible ? <DropUpIcon /> : <DropDownIcon />}</span>

                {!smallerWidth && containerWidth <= 720 && isComponentVisible && <SubMenu 
                    className={cx('submenu')} 
                    menu={COLLECTION_TABS} 
                    handleCloseSubMenu={() => setIsComponentVisible(false)}  
                    right={rect.x}
                    bottom={window.innerHeight - rect.y}
                    pointY={rect.y + rect.height + 8}
                    pointX={rect.x}
                />}
                
                {smallerWidth && <div className={cx('dropdown-menu')}
                    style={{
                        visibility: isComponentVisible ? 'visible' : 'hidden',
                        top: isComponentVisible ? '40px' : '-100px',
                        opacity: isComponentVisible ? '1' : '0',
                    }}
                >
                    {COLLECTION_TABS.map((item) => (
                        <Link key={item.value}
                            to={item.to}
                            className={cx('dropdown-menu-item')}
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>}
            </>
        </div> 
        <div className={cx('container')}>
            {children}
        </div>
        <MainFooter />
    </div>);
}

export default Collection;