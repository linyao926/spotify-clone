import { useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link } from 'react-router-dom';
import { CloseIcon } from '~/assets/icons';
import config from '~/config';
import classNames from 'classnames/bind';
import styles from './MobileProfileSubMenu.module.scss';
import ButtonPrimary from '../Buttons/ButtonPrimary';

const cx = classNames.bind(styles);

function MobileProfileSubMenu({ visible, setVisible }) {
    const { userData, closeModal, handleLogout } = useContext(AppContext);

    const transition = {
        left: visible ? '0' : '150%',
        visibility: visible ? 'visible' : 'hidden',
    };

    return (
        <div className={cx('wrapper')} style={transition}>
            <div className={cx('btn-wrapper')}>
                <ButtonPrimary
                    icon
                    dark
                    className={cx('close-btn')}
                    onClick={() => {
                        closeModal();
                        setVisible(false);
                    }}
                >
                    <CloseIcon />
                </ButtonPrimary>
            </div>
            <div className={cx('main-content')}>
                <a
                    href={config.externalLink['account']}
                    target="_blank"
                    className={cx('account', 'user-actions')}
                    onClick={() => {
                        closeModal();
                        setVisible(false);
                    }}
                >
                    view account
                </a>
                <Link
                    to={userData ? `user/${userData.id}` : ''}
                    className={cx('profile', 'user-actions')}
                    onClick={() => {
                        closeModal();
                        setVisible(false);
                    }}
                >
                    profile
                </Link>
                <div onClick={() => {
                        handleLogout()
                        setVisible(false);
                    }} 
                    className={cx('log-out', 'user-actions')}
                >
                    log out
                </div>
                <div className={cx('dividing-line')}></div>
                <div className={cx('resources')}>
                    <a
                        href={config.externalLink.support}
                        target="_blank"
                        className={cx('resources-item')}
                        onClick={() => {
                            closeModal();
                            setVisible(false);
                        }}
                    >
                        support
                    </a>
                    <a
                        href={config.externalLink.privacy}
                        target="_blank"
                        className={cx('resources-item')}
                        onClick={() => {
                            closeModal();
                            setVisible(false);
                        }}
                    >
                        privacy
                    </a>
                    <a
                        href={config.externalLink.legal}
                        target="_blank"
                        className={cx('resources-item')}
                        onClick={() => {
                            closeModal();
                            setVisible(false);
                        }}
                    >
                        terms
                    </a>
                </div>
            </div>
        </div>
    );
}

export default MobileProfileSubMenu;
