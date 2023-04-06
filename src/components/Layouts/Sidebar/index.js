import { Link } from 'react-router-dom';
import images from '~/assets/images';
import config from '~/config';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

function Sidebar() {
    return (
        <nav className={cx('navbar')}>
            <Link to={config.routes.home} className={cx('logo-link')}>
                <img src={images.logo} alt="Spotify logo" />
            </Link>
        </nav>
    );
}

export default Sidebar;
