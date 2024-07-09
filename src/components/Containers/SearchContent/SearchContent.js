import { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import images from '~/assets/images';
import { HiArrowLeft } from 'react-icons/hi';
import Segment from '../Segment';
import MainFooter from '~/components/Blocks/MainFooter';
import SearchForm from '~/components/Blocks/SearchForm';
import classNames from 'classnames/bind';
import styles from './SearchContent.module.scss';

const cx = classNames.bind(styles);

function SearchContent() {
    const {
        isLogin,
        spotifyApi,
        setTokenError,
        setBgHeaderColor,
        smallerWidth,
        searchPageInputValue,
        setSearchPageInputValue,
    } = useContext(AppContext);

    const [isFocusInput, setIsFocusInput] = useState(false);
    const [resultData, setResultData] = useState([]);
    const [hasData, setHasData] = useState(false);

    const ref = useRef(null);

    useEffect(() => {
        let isMounted = true;

        if (isLogin) {
            async function loadData() {
                const result = [];
                const [data1, data2] = await Promise.all([
                    spotifyApi
                        .getCategories({ limit: 50, offset: 0 })
                        .then((data) => data)
                        .catch((error) => {
                            console.log('Error', error);
                            if (error.status === 401) {
                                setTokenError(true);
                            }
                        }),
                    spotifyApi
                        .getCategories({ limit: 50, offset: 50 })
                        .then((data) => data)
                        .catch((error) => {
                            console.log('Error', error);
                            if (error.status === 401) {
                                setTokenError(true);
                            }
                        }),
                ]);
                if (data1.categories && data2.categories) {
                    result = result.concat([...data1.categories.items]);
                    result = result.concat([...data2.categories.items]);
                }
                if (isMounted) {
                    setHasData(true);
                    // console.log(result)
                    setResultData(result);
                }
            }
            loadData();
        }

        return () => (isMounted = false);
    }, [isLogin]);

    useEffect(() => {
        setBgHeaderColor('#121212');
    }, []);

    if (smallerWidth) {
        return isLogin ? (
            hasData && (
                <div className={cx('wrapper', 'logged')} ref={ref}>
                    {!isFocusInput && <h1>Search</h1>}
                    <div
                        className={cx('wrapper-input')}
                        style={{
                            height: isFocusInput ? '48px' : 'fit-content',
                        }}
                    >
                        {isFocusInput && (
                            <span onClick={() => setIsFocusInput(false)}>
                                <HiArrowLeft />
                            </span>
                        )}
                        <SearchForm
                            searchPageSmallerWidth={true}
                            placeholder={'What do you want to listen to?'}
                            setFunc={setSearchPageInputValue}
                            inputValue={searchPageInputValue}
                            setIsFocusInput={setIsFocusInput}
                            isFocusInput={isFocusInput}
                        />
                    </div>
                    {isFocusInput && (
                        <div className={cx('slogan')}>
                            <h1>Play what you love</h1>
                            <p>Search for artists, songs, and more.</p>
                        </div>
                    )}
                    {!isFocusInput && (
                        <>
                            <Segment data={resultData} browse />
                            <MainFooter />
                        </>
                    )}
                </div>
            )
        ) : (
            <div className={cx('wrapper')}>
                <img loading="lazy" src={images.logo} alt="Spotify logo" className={cx('logo-img')} />
            </div>
        );
    } else {
        return isLogin ? (
            hasData && (
                <div className={cx('wrapper', 'logged')} ref={ref}>
                    <Segment data={resultData} browse />
                    <MainFooter />
                </div>
            )
        ) : (
            <div className={cx('wrapper')}>
                <img loading="lazy" src={images.logo} alt="Spotify logo" className={cx('logo-img')} />
            </div>
        );
    }
}

export default SearchContent;
