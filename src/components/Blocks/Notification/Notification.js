import { WarningIcon, CloseIcon } from '~/assets/icons';
import ButtonPrimary from '../Buttons/ButtonPrimary';
import classNames from 'classnames/bind';
import styles from './Notification.module.scss';

const cx = classNames.bind(styles);

function Notification({
    text,
    showIcon = true,
    warning = false,
    closeBtn = false,
    handleClose,
    styles,
}) {
    return ( 
        <div className={cx('wrapper', warning && 'warning')}
            style={styles}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {showIcon && <WarningIcon />}
                <span className={cx('title')}>{text}</span>
            </div>
            {closeBtn && <ButtonPrimary icon className={cx('close-btn', warning && 'warning')}
                onClick={handleClose}
            >
                <CloseIcon />
            </ButtonPrimary>}
        </div>
    );
}

export default Notification;