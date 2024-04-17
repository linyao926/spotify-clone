import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { NavLink, useLocation} from 'react-router-dom';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { PersonIcon, InstallIcon } from '~/assets/icons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode } from 'swiper/modules';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import SubMenu from '~/components/Blocks/SubMenu';
import SearchForm from '~/components/Blocks/SearchForm';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';

const cx = classNames.bind(styles);

function Header({ headerWidth }) {
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
        containerWidth,
        setPosHeaderNextBtn,
        spaceInHeader, setSpaceInHeader,
    } = useContext(AppContext);

    const types = ['all', 'playlist', 'artist', 'album', 'track'];

    const { pathname } = useLocation();

    const headerRef = useRef(null);
    const nextPrevBtnRef = useRef(null);
    const profileRef = useRef(null);

    const [back, setBack] = useState(false);
    const [forward, setForward] = useState(false);

    useEffect(() => {
        if (window.history.state.idx > 0) {
            setBack(true);
            if (window.history.state.idx < window.history.length - 2) {
                setForward(true);
            } else {
                setForward(false);
            }
        } else {
            setBack(false);
            if (window.history.state.idx < window.history.length - 2) {
                setForward(true);
            }
        }
    }, [pathname]); 

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

    useEffect(() => {
        if(profileRef.current && nextPrevBtnRef.current && containerWidth) {
            let prevWidth, nextWidth, profileWidth;
            prevWidth = nextPrevBtnRef.current.children[0].getBoundingClientRect().width;
            profileWidth = profileRef.current.getBoundingClientRect().width;
            if (nextPrevBtnRef.current.children[1].getBoundingClientRect().right > 0) {
                nextWidth = nextPrevBtnRef.current.children[1].getBoundingClientRect().width;
            } else {
                nextWidth = 0;
            }
            setSpaceInHeader(containerWidth - prevWidth - nextWidth - profileWidth - 24 * 2 - 8);
        }
    }, [profileRef.current, containerWidth, nextPrevBtnRef.current]);

    const goBack = () => {
        window.history.go(-1)
    };

    const goForward = () => {
        window.history.go(1);
    };

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
                <div className={cx('back-forward')}
                    ref={nextPrevBtnRef}
                >
                    <ButtonPrimary icon rounded onClick={() => {
                            back && goBack();
                        }} 
                        className={cx('back-btn', !back && 'disable')}
                    >
                        <AiOutlineLeft />
                    </ButtonPrimary>
                    <ButtonPrimary onClick={() => {
                            forward && goForward();
                        }} icon rounded 
                        className={cx('forward-btn', !forward && 'disable')}
                    >
                        <AiOutlineRight />
                    </ButtonPrimary>
                    {searchPage && isLogin && 
                        <SearchForm 
                            header 
                            placeholder={'What do you want to listen to?'} 
                            setFunc={setSearchPageInputValue}
                            inputValue={searchPageInputValue}
                    />}
                </div>
                <div className={cx('logged')}
                    ref={profileRef}
                >
                    <ButtonPrimary small lefticon={<InstallIcon />} className={cx('install-btn')} to="/download">
                        Install App
                    </ButtonPrimary>
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
                            <ButtonPrimary icon className={cx('profile-btn', 'tooltip')}>
                                <PersonIcon />
                                {userData && <span className={cx('tooltiptext')}>{userData.display_name}</span>}
                            </ButtonPrimary>
                        )}
                        {isComponentVisible && 
                        <SubMenu menu={PROFILE_SUB_MENU} className={cx('submenu')} 
                        handleCloseSubMenu={() => setIsComponentVisible(false)}
                        />}
                    </div>
                </div>
            </div>
            {searchPage && searchPageInputValue.length > 0 && (
                <Swiper
                    slidesPerView={'auto'}
                    spaceBetween={8}
                    freeMode={true}
                    modules={[FreeMode]}
                    className={cx('navigation')}
                >
                    {types.map((item) => {
                        return (
                        <SwiperSlide 
                            key={item}
                            style={{
                                width: 'fit-content',
                                minHeight: 'max-content',
                                height: 'auto',
                            }}
                        >
                            <NavLink
                                style={{marginRight: '0'}}
                                className={({ isActive }) => cx('navigation-btn', isActive && 'active')}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
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
                        </SwiperSlide>
                        );
                    })}
                </Swiper>
            )}
        </header>
    );
}

export default Header;
