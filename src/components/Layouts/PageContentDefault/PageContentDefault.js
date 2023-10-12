import { extractColors } from 'extract-colors';
import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { Link, useParams, NavLink } from 'react-router-dom';
import { HeartIcon, DotsIcon, FillHeartIcon, EditIcon } from '~/assets/icons';
import { BsFillPlayFill } from 'react-icons/bs';
import Button from '~/components/Button';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';
import classNames from 'classnames/bind';
import styles from './PageContentDefault.module.scss';
import SubMenu from '../SubMenu';

const cx = classNames.bind(styles);

function PageContentDefault(props) {
    const {
        imgUrl,
        title,
        subTitle,
        fallbackIcon,
        type,
        follow,
        children,
        contextMenu,
        toId,
        renderPlay = false,
        rounded = false,
        displayOption = true,
        isPlaylist = false,
        isAlbum = false,
        isTrack = false,
        myPlaylist = false,
        isLikedTracks = false,
    } = props;

    const {
        bgHeaderColor, 
        setBgHeaderColor, 
        setShowModal,
        containerWidth,
        ctnHeaderTextHeight,
        setCtnHeaderTextHeight,
        ctnHeaderTextSize,
        resizeText,        
    } = useContext(AppContext);

    const { ref, isComponentVisible, setIsComponentVisible, points, setPoints } = useContextMenu();

    
    const [colors, setColors] = useState(null);

    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const playBtnRef = useRef(null);
    const textRef = useRef(null);
    const params = useParams();

    
    // console.log(resultData)

    useEffect(() => {
        if (imgUrl) {
            if (myPlaylist) {
                extractColors(URL.createObjectURL(imgUrl), {crossOrigin: 'Anonymous'})
                .then(setColors)
                .catch(console.error);
            } else {
                extractColors(imgUrl, {crossOrigin: 'Anonymous'})
                .then(setColors)
                .catch(console.error);
            }
        } else {
            if (isLikedTracks) {
                setBgHeaderColor('rgb(80, 56, 160');
            } else {
                setBgHeaderColor('rgb(83, 83, 83)');
            }
        }
    }, [imgUrl, params]);

    useEffect(() => {
        const filterColor = (arr) => {
            let temp = arr[0].intensity;
            let bgColor = arr[0].hex;
            for (let i = 1; i < arr.length; i++) {
                if (arr[i].intensity > temp) {
                    temp = arr[i].intensity;
                    bgColor = arr[i].hex;
                }
            }
            return bgColor;
        }
        if (colors) {
            const color = filterColor(colors);
            setBgHeaderColor(color);
        }
    }, [colors]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.style.setProperty('--background-noise', bgHeaderColor);
        }
    }, [containerRef.current, bgHeaderColor]);

    useEffect(() => {
        if (textRef.current) {
            resizeText({
                element: textRef.current,
                minSize: 2.4,
                maxSize: 9.7,
                step: 2.4,
                unit: 'rem'
            })
        }
    }, [textRef.current, containerWidth])

    let rect;

    if (ref.current) {
        rect = ref.current.getBoundingClientRect();
    };

    const handleCloseSubMenu = () => {
        setIsComponentVisible(false);
    };

    const displayImg = () => {
        if (imgUrl) {
            return <img src={myPlaylist ? URL.createObjectURL(imgUrl) : imgUrl} alt={`Image of ${title} ${type}`} className={cx('header-img', rounded && 'rounded')} />
        } else {
            if (isLikedTracks) {
                return <div className={cx('icon-box')}><FillHeartIcon/></div>
            } else {
                return <div className={cx('header-img', rounded && 'rounded')}>
                    {fallbackIcon}
                </div>
            }
        }      
    }

    // resizeText({

    // })

    if (textRef.current) {
        // console.log(textRef.current.parentNode)
    }

    return (
        <div className={cx('wrapper')}
            ref={containerRef}
        >
            <header className={cx('header')}
                ref={headerRef}
            >
                {myPlaylist 
                    ? <div className={cx('my-playlist-img')}
                        onClick={() => {
                            setShowModal(true)
                        }}
                    >
                        {displayImg()}
                        <div className={cx('edit-wrapper')}>
                            <EditIcon />
                            <span style={{color: 'white'}}>Choose photo</span>
                        </div>
                    </div>
                    : displayImg()
                }
                
                <div className={cx('header-title')}
                    style={{
                        cursor: 'default'
                    }}
                >
                    <h5>{type}</h5>
                    <h1 ref={textRef}
                        onClick={() => {
                            if (myPlaylist) {
                                setShowModal(true)
                            }
                        }}
                        style={{
                            cursor: myPlaylist ? 'pointer' : 'default'
                        }}
                    >{title}</h1>
                    {subTitle}
                </div>
            </header>
            <main>
                <div className={cx('sub-bg')} />
                <section className={cx('interact')}>
                    <div ref={playBtnRef}
                        className={cx('wrapper-play-btn')}
                    >
                        {renderPlay && 
                            <Button primary rounded large className={cx('play-btn')}>
                                <BsFillPlayFill />
                            </Button>}
                    </div>

                    {!myPlaylist && !rounded && !isLikedTracks && <span className={cx('save-icon', 'tooltip')}>
                        <HeartIcon />
                        <span className={cx('tooltiptext')}>Save to Your Library</span>
                    </span>}

                    {rounded && (!follow 
                    ? <Button dark outline className={cx('follow-btn')}>
                        follow
                    </Button>
                    : <Button dark outline className={cx('follow-btn', 'following')}>
                        following
                    </Button>)}
                    
                    {displayOption && <span className={cx('option-icon', 'tooltip')}
                        ref={ref}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsComponentVisible(!isComponentVisible);
                            setPoints({
                                x: e.pageX,
                                y: e.pageY,
                            });
                        }}
                    >
                        <DotsIcon />
                        {!isComponentVisible && <span className={cx('tooltiptext')}>More option for {title}</span>}
                        {isComponentVisible && (
                            <SubMenu
                                menu={contextMenu}
                                top={points.y - rect.top}
                                left={points.x - rect.left}
                                right={window.innerWidth - points.x}
                                bottom={window.innerHeight - points.y}
                                pointY={points.y}
                                pointX={points.x}
                                isTrack={isTrack}
                                isAlbum={isAlbum}
                                isPlaylist={isPlaylist}
                                queueId={toId}
                                toId={toId}
                                onClick={handleCloseSubMenu}
                            />
                        )}
                    </span>}
                </section>
                {children}
            </main>
            <ContentFooter />
        </div>
    );
}

export default PageContentDefault;