import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import Button from '~/components/Button';
import config from '~/config';
import classNames from 'classnames/bind';
import styles from './HeaderHomePage.module.scss';

const cx = classNames.bind(styles);

function HeaderHomePage() {
    return (
        <header className={cx('header')}>
            <div className={cx('next-prev')}>
                <Button icon rounded>
                    <span>
                        <AiOutlineLeft />
                    </span>
                </Button>
                <Button icon rounded>
                    <span>
                        <AiOutlineRight />
                    </span>
                </Button>
            </div>
            <div className={cx('signup-login')}>
                <Button dark href={config.routes.signup} target="_blank">
                    Sign Up
                </Button>
                <Button href={config.routes.login} target="_blank">
                    Log in
                </Button>
            </div>
        </header>
    );
}

export default HeaderHomePage;
