import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams, NavLink, Form, useLoaderData } from 'react-router-dom';
import Button from '~/components/Button';
import { AiOutlineClose } from 'react-icons/ai';
import { WarningIcon, CloseIcon } from '~/assets/icons';
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
            {closeBtn && <Button icon className={cx('close-btn', warning && 'warning')}
                onClick={handleClose}
            >
                <CloseIcon />
            </Button>}
        </div>
    );
}

export default Notification;