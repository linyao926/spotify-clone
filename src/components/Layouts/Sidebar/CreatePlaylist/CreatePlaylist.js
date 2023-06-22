import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link } from 'react-router-dom';
import { useContextMenu } from '~/hooks';
import { HiPlus } from 'react-icons/hi';
import SubMenu from '~/components/Layouts/SubMenu';
import Button from '~/components/Button';
import config from '~/config';
import classNames from 'classnames/bind';
import styles from './CreatePlaylist.module.scss';

const cx = classNames.bind(styles);

function CreatePlaylist({ collapse }) {
    const { CREATE_SUB_MENU } = useContext(AppContext);
    const { ref, isComponentVisible, setIsComponentVisible } = useContextMenu(false);

    return (
        <div
            className={cx('create-menu', collapse && 'collapse')}
            onClick={() => setIsComponentVisible(!isComponentVisible)}
            ref={ref}
        >
            <Button rounded dark icon className={cx('create-btn', 'tooltip')}>
                <HiPlus />
                <span className={cx('tooltiptext', collapse && 'collapse-tooltiptext')}>Create playlist or folder</span>
            </Button>
            {isComponentVisible && <SubMenu menu={CREATE_SUB_MENU} posLeft icon />}
        </div>
    );
}

export default CreatePlaylist;
