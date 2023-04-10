import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '~/context/AppContext';
import { HomeIcon, SearchIcon, LibraryIcon, LanguageIcon } from '~/assets/icons/icons';
import { AiOutlinePlus } from 'react-icons/ai';
import { VscHeartFilled } from 'react-icons/vsc';
import images from '~/assets/images';
import Button from '~/components/Button';
import Item from './Item';
import config from '~/config';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

function Sidebar() {
    const { MENU_ITEMS, isLogin } = useContext(AppContext);

    return (
        <nav className={cx('navbar')}>
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
            <Button outline leftIcon={<LanguageIcon />}>
                English
            </Button>
        </nav>
    );
}

export default Sidebar;
