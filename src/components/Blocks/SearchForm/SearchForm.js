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
    searchPageSmallerWidth = false,
    renderSearchBar = false,
    renderSearchBarFunc,
    setFunc,
    inputValue,
    placeholder,
    isFocusInput,
    setIsFocusInput,
}) {
    const [disableBlur, setDisableBlur] = useState(false);

    const { handleGetValueInput, searchMyPlaylistValue, setSearchMyPlaylistValue, } = useContext(AppContext);

    const classes = cx(
        header && 'header-form',
        sidebar && 'sidebar-form',
        !renderSearchBar && 'hide',
        playlist && 'playlist-form',
        submenu && 'submenu-form',
        searchPageSmallerWidth && 'search-page-mobile',
        isFocusInput && 'focus-input-height',
    );

    const searchRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (sidebar) {
            if (inputValue.length > 0) {
                setDisableBlur(true);
            } else {
                setDisableBlur(false);
            }
        }
    }, [inputValue]);

    useEffect(() => {
        if (renderSearchBar) {
            inputRef.current.focus();
        }
    }, [renderSearchBar]);

    const onFocus = () => {
        if (searchRef.current) {
            searchRef.current.style.border = '1px solid #a7a7a7';
        }

        if (setIsFocusInput) {
            setIsFocusInput(true);
        }
    };
    const onBlur = () => {
        if (sidebar) {
            renderSearchBarFunc(false);
        } else if (header) {
            searchRef.current.style.border = '1px solid transparent';
        } 
    };

    return (
        <form className={cx('form-nosubmit', classes)} ref={searchRef}>
            <button className={cx('btn-nosubmit', classes)} />
            <input
                ref={inputRef}
                className={cx('input-nosubmit', classes)}
                type="search"
                placeholder={placeholder}
                onChange={(e) => {
                    setFunc(e.target.value)
                }}
                onFocus={() => (header || searchPageSmallerWidth) && onFocus()}
                onBlur={() => !disableBlur && onBlur()}
                value={inputValue}
                autoFocus={header}
            />
        </form>
    );
}

export default SearchForm;
