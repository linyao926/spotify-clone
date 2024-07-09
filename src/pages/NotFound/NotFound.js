import { useRouteError } from 'react-router-dom';
import images from '~/assets/images';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import classNames from 'classnames/bind';
import styles from './NotFound.module.scss';

const cx = classNames.bind(styles);

function NotFound() {
    const error = useRouteError();

    return (
        <div className={cx('wrapper')}>
            <img loading="lazy" src={images.logo} alt="Logo of spotify" className={cx('img')} />
            <h1>Page not found</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
            <ButtonPrimary small style={{ marginBottom: '32px' }} to="/">
                Home
            </ButtonPrimary>
        </div>
    );
}

export default NotFound;
