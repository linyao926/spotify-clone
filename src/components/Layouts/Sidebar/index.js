import { Link } from 'react-router-dom';
import images from '~/assets/images';
import { HomeIcon, SearchIcon, LibraryIcon, LanguageIcon } from '~/assets/icons/icons';
import { AiOutlinePlus, AiFillHeart } from 'react-icons/ai';
import Button from '~/components/Button';
import config from '~/config';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

function Sidebar() {
    return (
        <nav className={cx('navbar')}>
            <Link to={config.routes.home}>
                <img src={images.logo} alt="Spotify logo" className={cx('logo-img')} />
            </Link>
            <ul className={cx('navigation')}>
                <li>
                    <Link to={config.routes.home} className={cx('navigation-link','nav-link')}>
                        <span className={cx('navigation-icon')}>
                            <HomeIcon />
                        </span>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to={config.routes.home} className={cx('navigation-link','nav-link')}>
                        <span className={cx('navigation-icon')}>
                            <SearchIcon />
                        </span>
                        Search
                    </Link>
                </li>
                <li>
                    <Link to={config.routes.home} className={cx('navigation-link','nav-link')}>
                        <span className={cx('navigation-icon')}>
                            <LibraryIcon />
                        </span>
                        Your Library
                    </Link>
                </li>
            </ul>
            <ul className={cx('interact-song')}>
                <Link to={config.routes.home} className={cx('create-playlist','nav-link')}>
                    <div className={cx('icon-box')}>
                        <AiOutlinePlus />
                    </div>
                    <span>Create Playlist</span>
                </Link>
                <Link to={config.routes.home} className={cx('liked-songs','nav-link')}>
                    <div className={cx('icon-box')}>
                        <AiFillHeart />
                    </div>
                    <span>Liked Songs</span>
                </Link>
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
