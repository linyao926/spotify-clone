import { useState, useEffect, useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { Link } from 'react-router-dom';
import { FillPinIcon, CardImgFallbackIcon, ArtistIcon } from '~/assets/icons';
import { BsFillPlayFill } from 'react-icons/bs';
import { VscHeartFilled } from 'react-icons/vsc';
import SubMenu from '~/components/Blocks/SubMenu';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import classNames from 'classnames/bind';
import styles from './LibraryItem.module.scss';

const cx = classNames.bind(styles);

function LibraryItem({
    list = true,
    isPin = false,
    isLikedSongs = false,
    img = true,
    isArtist = false,
    isMyPlaylist = false,
    isPlaylist = false,
    isAlbum = false,
    artistData,
    type,
    toId,
    submenu,
    col3,
    toPage,
    title,
    subTitle,
    imgUrl,
    durationMs,
    dateRelease,
    children,
    className,
    handleClickPinItem,
    ...passProps
}) {
    const { ref, isComponentVisible, setIsComponentVisible, points, setPoints } = useContextMenu();
    const { widthNavbar, compactLibrary, gridLibrary, formatTimeAgo, libraryItemPlayedList } = useContext(AppContext);

    const [rect, setRect] = useState(null);

    const date = new Date(dateRelease);
    const year = date.getFullYear();
    const month = date.toLocaleDateString('en-GB', { month: 'short' });
    const day = date.getDate();

    useEffect(() => {
        if (ref?.current) {
            if (widthNavbar < 584) {
                ref.current.style.gridTemplateColumns = '1fr';
                ref.current.style.marginTop = 0;
            } else {
                ref.current.style.gridTemplateColumns = '1fr 20% 20%';
                ref.current.style.marginTop = '8px';
            }
        }
    }, [widthNavbar, ref?.current]);

    const artistNamesMenu = (artists) =>
        artists.map((artist) => ({
            title: artist.name,
            to: `/artist/${artist.id}`,
        }));

    let playedTime;
    if (libraryItemPlayedList[type]) {
        if (type === 'likedTracks') {
            if (libraryItemPlayedList[type][0].played === undefined) {
                playedTime = false;
            } else {
                playedTime = libraryItemPlayedList[type][0].played;
            }
        } else {
            libraryItemPlayedList[type].map((item) => {
                if (item.id === toId) {
                    if (item.played === undefined) {
                        playedTime = false;
                    } else {
                        playedTime = item.played;
                    }
                } else return;
            });
        }
    }

    return (
        <>
            <Link
                className={cx(
                    'wrapper',
                    isComponentVisible && 'active',
                    compactLibrary && 'compact-view',
                    widthNavbar === 72 && 'collapse-view',
                    widthNavbar > 420 && gridLibrary && 'grid-view',
                    'tooltip',
                )}
                ref={ref}
                onMouseOver={(e) => {
                    e.preventDefault();
                    setRect(ref.current.getBoundingClientRect());
                }}
                onContextMenu={(e) => {
                    e.stopPropagation();
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
                                        loading="lazy"
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
                                        <FillPinIcon />
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
                                            <FillPinIcon />
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
                        className={cx('wrapper-img', widthNavbar === 72 && 'collapse-view')}
                        onMouseOver={(e) => {
                            e.preventDefault();
                            rect &&
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
                            <img
                                loading="lazy"
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

                {widthNavbar > 420 && gridLibrary && (
                    <>
                        <div className={cx('wrapper-img', gridLibrary && 'grid-view')}>
                            {isLikedSongs ? (
                                <div className={cx('icon-box')}>
                                    <VscHeartFilled />
                                </div>
                            ) : img ? (
                                <img
                                    loading="lazy"
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
                        <div className={cx('title', gridLibrary && 'grid-view')}>
                            <div className={cx('comp-title')}>{title}</div>
                            <div className={cx('sub-title')}>
                                {isPin && (
                                    <span className={cx('pin-icon')}>
                                        <FillPinIcon />
                                    </span>
                                )}
                                {subTitle}
                            </div>
                        </div>
                        <div className={cx('wrapper-btn')}>
                            <ButtonPrimary primary rounded large className={cx('play-btn')}>
                                <BsFillPlayFill />
                            </ButtonPrimary>
                        </div>
                    </>
                )}

                {!gridLibrary && widthNavbar >= 584 && (
                    <>
                        <span className={cx('date-added', 'var1')}>
                            {dateRelease
                                ? formatTimeAgo(dateRelease) !== ''
                                    ? formatTimeAgo(dateRelease)
                                    : `${month} ${day}, ${year}`
                                : ''}
                        </span>
                        <span className={cx('date-played', 'last')}>{playedTime ? formatTimeAgo(playedTime) : ''}</span>
                    </>
                )}

                {widthNavbar === 72 && (
                    <div
                        className={cx('title', 'tooltiptext')}
                        style={{
                            top: rect && (rect.top + rect.bottom) / 2,
                        }}
                    >
                        <div className={cx('comp-title')}>{title}</div>
                        <div className={cx('sub-title')}>
                            {isPin && (
                                <span className={cx('pin-icon')}>
                                    <FillPinIcon />
                                </span>
                            )}
                            {subTitle}
                        </div>
                    </div>
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
                        handleCloseSubMenu={() => setIsComponentVisible(false)}
                        getPinId={handleClickPinItem}
                        isPin={isPin}
                        toId={toId}
                        isPlaylist={isPlaylist && !isMyPlaylist}
                        isAlbum={isAlbum}
                        isMyPlaylist={isMyPlaylist}
                        artistSubmenu={artistData && artistData.length > 1 && artistNamesMenu(artistData)}
                        toArtistId={artistData && artistData.length === 1 && artistData[0].id}
                    />
                )}
            </Link>
        </>
    );
}

export default LibraryItem;
