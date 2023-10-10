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
    renderSearchBar,
    renderSearchBarFunc,
    setFunc,
    inputValue,
    placeholder 
}) {
    const [disableBlur, setDisableBlur] = useState(false);

    const { handleGetValueInput, searchMyPlaylistValue, setSearchMyPlaylistValue, } = useContext(AppContext);

    const classes = cx(
        header && 'header-form',
        sidebar && 'sidebar-form',
        !renderSearchBar && 'hide',
        playlist && 'playlist-form',
        submenu && 'submenu-form',
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
    }, [renderSearchBar])

    const onFocus = () => {
        searchRef.current.style.border = '1px solid #a7a7a7';
    };
    const onBlur = () => {
        if (sidebar) {
            renderSearchBarFunc(false);
        } else if (header) {
            searchRef.current.style.border = '1px solid transparent';
        } 
    };

    // console.log(inputValue)

    return (
        <form className={cx('form-nosubmit', classes)} ref={searchRef}>
            <button className={cx('btn-nosubmit', classes)} />
            <input
                ref={inputRef}
                className={cx('input-nosubmit', classes)}
                type="search"
                placeholder={placeholder}
                onChange={(e) => {
                    handleGetValueInput(e, (submenu ? setSearchMyPlaylistValue : setFunc))}
                }
                onFocus={() => header && onFocus()}
                onBlur={() => !disableBlur && onBlur()}
                value={submenu ? searchMyPlaylistValue : inputValue}
                autofocus={header}
            />
        </form>
    );
}

export default SearchForm;
