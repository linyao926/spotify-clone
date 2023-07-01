import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { Form, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { PersonIcon, InstallIcon } from '~/assets/icons/icons';
import Button from '~/components/Button';
import SubMenu from '~/components/Layouts/SubMenu';
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
        nodeScrollY,
        searchPage,
        setSearchPage,
        inputValue,
        handleGetValueInput,
        typeSearch, setTypeSearch,
        bgHeaderColor,
    } = useContext(AppContext);

    const [active, setActive] = useState('all');
    const types = ['all', 'playlist', 'artist', 'album', 'track'];

    const headerRef = useRef(null);
    const searchRef = useRef(null);

    const { pathname } = useLocation();
    
    useEffect(() => {
        if (pathname.includes('search')) {
            setSearchPage(true);
        } else {
            setSearchPage(false);
        }
    }, [pathname]);

    

    useEffect(() => {
        headerRef.current.style.backgroundColor = bgHeaderColor;
    }, [bgHeaderColor]);

    const onFocus = () => {
        searchRef.current.style.border = '1px solid #a7a7a7';
    };
    const onBlur = () => {
        searchRef.current.style.border = '1px solid transparent';
    };

    // console.log(userData.images[0].url)

    return (
        <header
            className={cx('header', 'login')}
            style={{
                left: 0,
                width: headerWidth,
            }}
            ref={headerRef}
        >
            <div className={cx('main-content')}>
                <div className={cx('next-prev')}>
                    <Button icon rounded className={cx('prev-btn')}>
                        <AiOutlineLeft />
                    </Button>
                    <Button icon rounded className={cx('next-btn')}>
                        <AiOutlineRight />
                    </Button>
                    {searchPage && isLogin && (
                        <Form role="search" className={cx('form-nosubmit')} ref={searchRef}>
                            <button className={cx('btn-nosubmit')} />
                            <input
                                className={cx('input-nosubmit')}
                                type="search"
                                placeholder="What do you want to listen to?"
                                onFocus={() => onFocus()}
                                onBlur={() => onBlur()}
                                onChange={(e) => handleGetValueInput(e)}
                                value={inputValue}
                                name="q"
                            />
                        </Form>
                    )}
                </div>
                {isLogin ? (
                    <div className={cx('logged')}>
                        {!searchPage && (
                            <Button small href={config.externalLink.premium} target="_blank" className={cx('upgrade-btn')}>
                                Explore Premium
                            </Button>
                        )}
                        <Button small lefticon={<InstallIcon />} 
                            className={cx('install-btn')}
                            to='/download'
                        >
                            Install App
                        </Button>
                        <div
                            className={cx('profile-menu')}
                            onClick={() => setIsComponentVisible(!isComponentVisible)}
                            ref={ref}
                        >
                                {userData && userData.images[0].url 
                                    ? <div className={cx('profile-btn', 'tooltip')}> 
                                        <img src={userData.images[0].url} 
                                            alt='Profile avatar' 
                                            className={cx('avatar-img')}
                                        /> 
                                        <span className={cx('tooltiptext')}>{userData.display_name}</span>
                                    </div>
                                    : <Button icon className={cx('profile-btn', 'tooltip')}>
                                        <PersonIcon />
                                        {userData && <span className={cx('tooltiptext')}>{userData.display_name}</span>}
                                    </Button>
                                }
                            {isComponentVisible && <SubMenu menu={PROFILE_SUB_MENU} />}
                        </div>
                    </div>
                ) : (
                    <div className={cx('logged')}>
                        <Button href={config.routes.login}>Log in</Button>
                    </div>
                )}
            </div>
            {searchPage && inputValue.length > 0 && (
                <div className={cx('navigation')}>
                    {types.map((item) => {
                        return (
                            <Button
                                className={cx('navigation-btn', active == item && 'active')}
                                smaller
                                key={item}
                                onClick={() => {
                                    if (item === 'all') {
                                        setTypeSearch('');
                                    } else {
                                        setTypeSearch(item);
                                    }
                                    setActive([item]);
                                }}
                                to={item !== 'all' 
                                    ? `/search/${inputValue}/${item}` 
                                    : `/search/${inputValue}`
                                }
                            >
                                {item !== 'all' 
                                    ? item !== 'track' ? `${item}s` : 'songs'
                                    : 'all'
                                }
                            </Button>
                        );
                    })}
                </div>
            )}
        </header>
    );
}

export default HeaderHomePage;
