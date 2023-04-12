import { useContext, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link } from 'react-router-dom';
import { LanguageIcon } from '~/assets/icons/icons';
import images from '~/assets/images';
import Button from '~/components/Button';
import Item from './Item';
import config from '~/config';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

function Sidebar() {
    const [resizeData, setResizeData] = useState({
        tracking: false,
        startCursorScreenX: null,
        maxWidth: 394,
        minWidth: 130
    });
    const { MENU_ITEMS, isLogin, renderModal, setWidthNavbar } = useContext(AppContext);
    const sidebarPanel = useRef('sidebarPanel');
    
    const SIDEBAR_WIDTH = '200px';

    setWidthNavbar(sidebarPanel.current.offsetWidth);

    function handleMousedown(e) {
        e.stopPropagation();
        e.preventDefault();
        setResizeData((prev) => ({
            ...prev,
            startWidth: sidebarPanel.current.offsetWidth,
            startCursorScreenX: e.screenX,
            tracking: true
        }));

        document.addEventListener('mousemove', handleMousemove);
        document.addEventListener('mouseup', handleMouseup);
    }

    function handleMousemove(e) {
        if (resizeData.tracking) {
            const cursorScreenXDelta = e.screenX - resizeData.startCursorScreenX;
            let newWidth = Math.min(resizeData.startWidth + cursorScreenXDelta, resizeData.maxWidth);
            newWidth = Math.max(resizeData.minWidth, newWidth);
            sidebarPanel.current.style.width = newWidth + 'px';
            setWidthNavbar(sidebarPanel.current.offsetWidth);
        }
    }

    function handleMouseup(e) {
        if(resizeData.tracking) {
            setResizeData((prev) => ({
                ...prev,
                tracking: false
            }));
        }
        document.removeEventListener('mousemove', handleMousemove);
        document.removeEventListener('mouseup', handleMouseup);
    }

    return (
        <nav className={cx('navbar')} ref={sidebarPanel} style={{width: `${SIDEBAR_WIDTH}`}}>
            <Link to={config.routes.home}>
                <img src={images.logo} alt="Spotify logo" className={cx('logo-img')} />
            </Link>
            <ul className={cx('navigation')}>
                <Item item={MENU_ITEMS[0]} />
                <Item item={MENU_ITEMS[1]} />
                <Item item={MENU_ITEMS[2]} />
            </ul>

            <ul className={cx('interact-song')}>
                <Item item={MENU_ITEMS[3]} classNames="create-playlist" />
                <Item item={MENU_ITEMS[4]} classNames="liked-songs" />
            </ul>

            <a className={cx('cookies-link')} href={config.routes.cookies} target="_blank">
                Cookies
            </a>
            <Button outline leftIcon={<LanguageIcon />} onClick={() => renderModal()}>
                English
            </Button>

            <div className={cx('dragger')} onMouseDown={(e) => handleMousedown(e)} />
        </nav>
    );
}

export default Sidebar;
