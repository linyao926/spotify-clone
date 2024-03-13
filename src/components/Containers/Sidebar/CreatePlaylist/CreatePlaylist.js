import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, redirect } from 'react-router-dom';
import { useContextMenu } from '~/hooks';
import { HiPlus } from 'react-icons/hi';
import SubMenu from '~/components/Blocks/SubMenu';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import classNames from 'classnames/bind';
import styles from './CreatePlaylist.module.scss';

const cx = classNames.bind(styles);

function CreatePlaylist({ collapse }) {
    const { CREATE_SUB_MENU } = useContext(AppContext);
    const { ref, isComponentVisible, setIsComponentVisible } = useContextMenu(false);

    let rect;

    if (ref.current) {
        rect = ref.current.getBoundingClientRect();
    }

    return (
        <div
            className={cx('create-menu', collapse && 'collapse')}
            onClick={() => {
                setIsComponentVisible(!isComponentVisible);
            }}
            ref={ref}
        >
            <ButtonPrimary rounded dark icon className={cx('create-btn', 'tooltip')}>
                <HiPlus />
                <span className={cx('tooltiptext', collapse && 'collapse-tooltiptext')}>Create playlist or folder</span>
            </ButtonPrimary>
            {isComponentVisible && <SubMenu className={cx('submenu')} 
                menu={CREATE_SUB_MENU} icon 
                onClick={() => setIsComponentVisible(false)} 
                right={rect.x}
                bottom={window.innerHeight - rect.y}
                pointY={rect.y + 16}
                pointX={rect.x + rect.width + 16}
            />}
        </div>
    );
}

export default CreatePlaylist;
