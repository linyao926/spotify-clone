import { useRef, useState, useEffect, useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { Link } from 'react-router-dom';
import SubMenu from '~/components/Layouts/SubMenu';
import Button from '~/components/Button';
import { PinIcon, CardImgFallbackIcon, ArtistIcon } from '~/assets/icons';
import { BsFillPlayFill } from 'react-icons/bs';
import { VscHeartFilled } from 'react-icons/vsc';
import classNames from 'classnames/bind';
import styles from './LibraryComponent.module.scss';

const cx = classNames.bind(styles);

function LibraryComponent({
    list = true,
    isPin = false,
    isLikedSongs = false,
    img = true,
    isArtist = false,
    isMyPlaylist = false,
    toId,
    submenu,
    col3,
    toPage,
    isAlbum,
    title,
    subTitle,
    imgUrl,
    durationMs,
    dateRelease,
    children,
    className,
    onClick,
    ...passProps
}) {
    const { widthNavbar, compactLibrary, gridLibrary } = useContext(AppContext);
    const { ref, isComponentVisible, setIsComponentVisible, points, setPoints } = useContextMenu();

    const date = new Date(dateRelease);
    const year = date.getFullYear();
    const month = date.toLocaleDateString('en-GB', { month: 'short' });
    const day = date.getDate();

    // console.log(month)

    let rect;

    if (ref.current) {
        rect = ref.current.getBoundingClientRect();
    }

    useEffect(() => {
        if (widthNavbar < 584) {
            ref.current.style.gridTemplateColumns = '1fr';
            ref.current.style.marginTop = 0;
        } else {
            ref.current.style.gridTemplateColumns = '1fr 20% 20%';
            ref.current.style.marginTop = '8px';
        }
    }, [widthNavbar, ref.current]);

    return (
        <Link
            className={cx(
                'wrapper',
                isComponentVisible && 'active',
                compactLibrary && 'compact-view',
                widthNavbar === 72 && 'collapse-view',
                widthNavbar > 420 && gridLibrary && 'grid-view',
            )}
            ref={ref}
            onClick={() => {
                if (isComponentVisible) {
                    setIsComponentVisible(false);
                }
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                setIsComponentVisible(!isComponentVisible);
                setPoints({
                    x: e.pageX,
                    y: e.pageY,
                });
            }}
            to={toPage}
        >
            {widthNavbar > 72 && (widthNavbar <= 420 || !gridLibrary) && (
                <div className={cx('intro', 'first')}>
                    {!compactLibrary && (
                        <div className={cx('wrapper-img')}>
                            {isLikedSongs ? (
                                <div className={cx('icon-box')}>
                                    <VscHeartFilled />
                                </div>
                            ) : img ? (
                                <img
                                    src={imgUrl}
                                    alt={`Image of ${title}`}
                                    className={cx('img', isArtist && 'rounded')}
                                />
                            ) : (
                                <div className={cx('img', isArtist && 'rounded')}>
                                    {isArtist ? <ArtistIcon /> : <CardImgFallbackIcon />}
                                </div>
                            )}
                        </div>
                    )}
                    {compactLibrary ? (
                        <div className={cx('title', 'compact-view')}>
                            {isPin && (
                                <span className={cx('pin-icon')}>
                                    <PinIcon />
                                </span>
                            )}
                            <div className={cx('comp-title')}>{title}</div>
                            <div className={cx('sub-title')}>
                                {` • `}
                                {subTitle}
                            </div>
                        </div>
                    ) : (
                        <div className={cx('title')}>
                            <div className={cx('comp-title')}>{title}</div>
                            <div className={cx('sub-title')}>
                                {isPin && (
                                    <span className={cx('pin-icon')}>
                                        <PinIcon />
                                    </span>
                                )}
                                {subTitle}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {widthNavbar === 72 && (
                <div
                    className={cx('wrapper-img', widthNavbar === 72 && 'collapse-view', 'tooltip')}
                    onMouseOver={(e) => {
                        e.preventDefault();
                        // console.log(rect)
                        setPoints({
                            x: e.pageX,
                            y: (rect.top + rect.bottom) / 2,
                        });
                    }}
                >
                    {isLikedSongs ? (
                        <div className={cx('icon-box')}>
                            <VscHeartFilled />
                        </div>
                    ) : img ? (
                        <img src={imgUrl} alt={`Image of ${title}`} className={cx('img', isArtist && 'rounded')} />
                    ) : (
                        <div className={cx('img', isArtist && 'rounded')}>
                            {isArtist ? <ArtistIcon /> : <CardImgFallbackIcon />}
                        </div>
                    )}
                    <div
                        className={cx('title', 'tooltiptext')}
                        style={{
                            top: (rect.top + rect.bottom) / 2,
                        }}
                    >
                        <div className={cx('comp-title')}>{title}</div>
                        <div className={cx('sub-title')}>
                            {isPin && (
                                <span className={cx('pin-icon')}>
                                    <PinIcon />
                                </span>
                            )}
                            {subTitle}
                        </div>
                    </div>
                </div>
            )}

            {widthNavbar > 420 && gridLibrary && (
                <>
                    <div className={cx('wrapper-img', gridLibrary && 'grid-view')}>
                        {isLikedSongs ? (
                            <div className={cx('icon-box')}>
                                <VscHeartFilled />
                            </div>
                        ) : img ? (
                            <img src={imgUrl} alt={`Image of ${title}`} className={cx('img', isArtist && 'rounded')} />
                        ) : (
                            <div className={cx('img', isArtist && 'rounded')}>
                                {isArtist ? <ArtistIcon /> : <CardImgFallbackIcon />}
                            </div>
                        )}
                    </div>
                    <div className={cx('title', gridLibrary && 'grid-view')}>
                        <div className={cx('comp-title')}>{title}</div>
                        <div className={cx('sub-title')}>
                            {isPin && (
                                <span className={cx('pin-icon')}>
                                    <PinIcon />
                                </span>
                            )}
                            {subTitle}
                        </div>
                    </div>
                    <div className={cx('wrapper-btn')}>
                        <Button primary rounded large className={cx('play-btn')}>
                            <BsFillPlayFill />
                        </Button>
                    </div>
                </>
            )}

            {!gridLibrary && widthNavbar >= 584 && (
                <>
                    <span className={cx('date-added', 'var1')}>{dateRelease ? `${month} ${day}, ${year}` : ''}</span>
                    <span className={cx('date-played', 'last')}>{`1 weeks ago`}</span>
                </>
            )}

            {isComponentVisible && (
                <SubMenu
                    menu={submenu}
                    left={points.x - rect.left}
                    top={points.y - rect.top}
                    right={window.innerWidth - points.x}
                    bottom={window.innerHeight - points.y}
                    pointY={points.y}
                    pointX={points.x}
                    onClick={() => setIsComponentVisible(false)}
                    getPinId={() => onClick()}
                    isPin={isPin}
                    toId={toId}
                    isMyPlaylist={isMyPlaylist}
                />
            )}
        </Link>
    );
}

export default LibraryComponent;
