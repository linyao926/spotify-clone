import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { NavLink, useLocation } from 'react-router-dom';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { PersonIcon, InstallIcon } from '~/assets/icons/icons';
import Button from '~/components/Button';
import SubMenu from '~/components/Layouts/SubMenu';
import SearchForm from '~/components/SearchForm';
import config from '~/config';
import classNames from 'classnames/bind';
import styles from './HeaderHomePage.module.scss';

const cx = classNames.bind(styles);

function HeaderHomePage({ headerWidth }) {
    const { ref, isComponentVisible, setIsComponentVisible } = useContextMenu(false);

    const {
        isLogin,
        userData,
        PROFILE_SUB_MENU,
        searchPage,
        setSearchPage,
        searchPageInputValue,
        setSearchPageInputValue,
        setTypeSearch,
        bgHeaderColor,
        widthNavbar,
        containerWidth,
        setPosHeaderNextBtn,
    } = useContext(AppContext);

    const types = ['all', 'playlist', 'artist', 'album', 'track'];

    const headerRef = useRef(null);
    const nextPrevBtnRef = useRef(null);

    const { pathname } = useLocation();

    useEffect(() => {
        if (pathname.includes('search')) {
            setSearchPage(true);
        } else {
            setSearchPage(false);
            setSearchPageInputValue('');
        }
    }, [pathname]);

    useEffect(() => {
        headerRef.current.style.backgroundColor = bgHeaderColor;
    }, [bgHeaderColor]);

    useEffect(() => {
        if(nextPrevBtnRef.current) {
            if (nextPrevBtnRef.current.children[1].getBoundingClientRect().right > 0) {
                setPosHeaderNextBtn({right: nextPrevBtnRef.current.children[1].getBoundingClientRect().right});
            } else {
                setPosHeaderNextBtn({right: nextPrevBtnRef.current.children[0].getBoundingClientRect().right});
            }
        }
    }, [nextPrevBtnRef.current, containerWidth]);

    return (
        <header
            className={cx('header', 'login')}
            style={{
                left: 0,
                width: headerWidth,
                padding: `0 clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px)`
            }}
            ref={headerRef}
        >
            <div className={cx('main-content')}>
                <div className={cx('next-prev')}
                    ref={nextPrevBtnRef}
                >
                    <Button icon rounded className={cx('prev-btn')}>
                        <AiOutlineLeft />
                    </Button>
                    <Button icon rounded className={cx('next-btn')}>
                        <AiOutlineRight />
                    </Button>
                    {searchPage && isLogin && 
                        <SearchForm 
                            header 
                            placeholder={'What do you want to listen to?'} 
                            setFunc={setSearchPageInputValue}
                            inputValue={searchPageInputValue}
                    />}
                </div>
                <div className={cx('logged')}>
                    {containerWidth >= 460 && (!searchPage && !pathname.includes('collection')) && (
                        <Button
                            small
                            href={config.externalLink.premium}
                            target="_blank"
                            className={cx('upgrade-btn')}
                        >
                            Explore Premium
                        </Button>
                    )}
                    <Button small lefticon={<InstallIcon />} className={cx('install-btn')} to="/download">
                        Install App
                    </Button>
                    <div
                        className={cx('profile-menu')}
                        onClick={() => setIsComponentVisible(!isComponentVisible)}
                        ref={ref}
                    >
                        {userData && userData.images[0].url ? (
                            <div className={cx('profile-btn', 'tooltip')}>
                                <img
                                    src={userData.images[0].url}
                                    alt="Profile avatar"
                                    className={cx('avatar-img')}
                                />
                                <span className={cx('tooltiptext')}>{userData.display_name}</span>
                            </div>
                        ) : (
                            <Button icon className={cx('profile-btn', 'tooltip')}>
                                <PersonIcon />
                                {userData && <span className={cx('tooltiptext')}>{userData.display_name}</span>}
                            </Button>
                        )}
                        {isComponentVisible && 
                        <SubMenu menu={PROFILE_SUB_MENU} className={cx('submenu')} 
                            onClick={() => setIsComponentVisible(false)}
                        />}
                    </div>
                </div>
            </div>
            {searchPage && searchPageInputValue.length > 0 && (
                <div className={cx('navigation')}>
                    {types.map((item) => {
                        return (
                            <NavLink
                                className={({ isActive }) => cx('navigation-btn', isActive && 'active')}
                                key={item}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (item === 'all') {
                                        setTypeSearch('');
                                    } else {
                                        setTypeSearch(item);
                                    }
                                }}
                                to={
                                    item !== 'all'
                                        ? `/search/${searchPageInputValue}/${item}`
                                        : `/search/${searchPageInputValue}`
                                }
                                end
                            >
                                {item !== 'all' ? (item !== 'track' ? `${item}s` : 'songs') : 'all'}
                            </NavLink>
                        );
                    })}
                </div>
            )}
        </header>
    );
}

export default HeaderHomePage;
