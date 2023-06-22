import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
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
        PROFILE_SUB_MENU,
        nodeScrollY,
        searchPage,
        inputValue,
        handleGetValueInput,
        typeData,
        setTypeData,
        bgHeaderColor,
    } = useContext(AppContext);

    const [active, setActive] = useState('all');
    const types = ['all', 'playlist', 'artist', 'album', 'song'];

    const headerRef = useRef(null);
    const searchRef = useRef(null);

    const onFocus = () => {
        searchRef.current.style.border = '1px solid #a7a7a7';
    };
    const onBlur = () => {
        searchRef.current.style.border = '1px solid transparent';
    };

    useEffect(() => {
        headerRef.current.style.backgroundColor = bgHeaderColor;
    }, [bgHeaderColor]);

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
                        <form className={cx('form-nosubmit')} ref={searchRef}>
                            <button className={cx('btn-nosubmit')} />
                            <input
                                className={cx('input-nosubmit')}
                                type="search"
                                placeholder="What do you want to listen to?"
                                onFocus={() => onFocus()}
                                onBlur={() => onBlur()}
                                onChange={(e) => handleGetValueInput(e)}
                                value={inputValue}
                            />
                        </form>
                    )}
                </div>
                {isLogin ? (
                    <div className={cx('logged')}>
                        {!searchPage && (
                            <Button small href={config.routes.upgrade} target="_blank" className={cx('upgrade-btn')}>
                                Explore Premium
                            </Button>
                        )}
                        <Button small lefticon={<InstallIcon />} className={cx('install-btn')}>
                            Install App
                        </Button>
                        <div
                            className={cx('profile-menu')}
                            onClick={() => setIsComponentVisible(!isComponentVisible)}
                            ref={ref}
                        >
                            <Button icon className={cx('profile-btn')}>
                                <PersonIcon />
                            </Button>
                            {isComponentVisible && <SubMenu menu={PROFILE_SUB_MENU} />}
                        </div>
                    </div>
                ) : (
                    <div className={cx('logged')}>
                        <Button href={config.routes.login}>Log in</Button>
                    </div>
                )}
            </div>
            {inputValue.length > 0 && (
                <div className={cx('navigation')}>
                    {types.map((item) => {
                        return (
                            <Button
                                className={cx('navigation-btn', active == item && 'active')}
                                smaller
                                key={item}
                                onClick={() => {
                                    if (item === 'all') {
                                        let temp = types.slice(1);
                                        setTypeData(temp);
                                    } else if (item === 'song') {
                                        setTypeData('track');
                                    } else {
                                        setTypeData(item);
                                    }
                                    setActive([item]);
                                }}
                                to={active && (item !== 'all' ? `/search/${inputValue}/${typeData}` : `/search/${inputValue}`)}
                            >
                                {`${item}s`}
                            </Button>
                        );
                    })}
                </div>
            )}
        </header>
    );
}

export default HeaderHomePage;
