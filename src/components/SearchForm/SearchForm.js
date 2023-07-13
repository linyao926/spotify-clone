import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import classNames from 'classnames/bind';
import styles from './SearchForm.module.scss';

const cx = classNames.bind(styles);

function SearchForm({
    header = false,
    sidebar = false,
    playlist = false,
    submenu = false,
    placeholder,
}) {
    const {
        handleGetValueInput,
        inputValue 
    } = useContext(AppContext);

    const classes = cx(
        header && 'header-form',
        sidebar && 'sidebar-form',
        playlist && 'playlist-form',
        submenu && 'submenu-form'
    );

    const searchRef = useRef(null);

    const onFocus = () => {
        searchRef.current.style.border = '1px solid #a7a7a7';
    };
    const onBlur = () => {
        searchRef.current.style.border = '1px solid transparent';
    };

    return ( 
        <form className={cx('form-nosubmit', classes)} 
            ref={searchRef}
        >
                <button className={cx('btn-nosubmit', classes)} />
                <input
                    className={cx('input-nosubmit', classes)}
                    type="search"
                    placeholder={placeholder}
                    onChange={(e) => handleGetValueInput(e)}
                    onFocus={() => header && onFocus()}
                    onBlur={() => header && onBlur()}
                    value={inputValue}
                />
        </form>
    );
}

export default SearchForm;