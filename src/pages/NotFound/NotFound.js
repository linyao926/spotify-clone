import Button from '~/components/Button';
import images from '~/assets/images';
import classNames from 'classnames/bind';
import styles from './NotFound.module.scss';

const cx = classNames.bind(styles);

function NotFound() {
    return (
        <div className={cx('wrapper')}>
            <img src={images.logo} alt='Logo of spotify' className={cx('img')} />
            <h1>Page not found</h1>
            <p>We can’t seem to find the page you are looking for.</p>
            <Button small style={{marginBottom: '32px'}} to='/' >Home</Button>
            <Button dark underline>Help</Button>
        </div>
    );
}

export default NotFound;
