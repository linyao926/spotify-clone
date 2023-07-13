import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { Link } from 'react-router-dom';
import SubMenu from '~/components/Layouts/SubMenu';
import Button from '~/components/Button';
import { BsFillPlayFill } from 'react-icons/bs';
import { CloseIcon, ArtistIcon, CardImgFallbackIcon } from '~/assets/icons/icons';
import classNames from 'classnames/bind';
import styles from './CardItem.module.scss';

const cx = classNames.bind(styles);

function CardItem({
    toId,
    type,
    kind,
    album,
    playlist,
    topResult,
    hasRemove,
    rounded,
    title,
    img,
    subTitle,
    releaseDate,
    subMenu,
    large,
    children,
    className,
    onClick,
    ...passProps
}) {
    const { ref, isComponentVisible, setIsComponentVisible, points, setPoints } = useContextMenu();

    const date = new Date(releaseDate);
    const year = date.getFullYear();

    let rect;

    if (ref.current) {
        rect = ref.current.getBoundingClientRect();
    }

    // const date = new Date(releaseDate)
    // const formattedDate = date.toLocaleDateString("en-GB", {
    //     day: "numeric",
    //     month: "long",
    //     year: "numeric"
    // });

    // console.log(releaseDate)

    // console.log(rect.top)

    if (kind) {
        return (
            <Link to={`/genre/${toId}`} className={cx('kind-card')}>
                <span className={cx('kind-title')}>{title}</span>
                <img src={img} alt={title} className={cx('kind-img', rounded && 'rounded')} />
            </Link>
        );
    } else if (topResult) {
        return (
            <Link
                className={cx('card', 'top-result')}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setIsComponentVisible(!isComponentVisible);
                    setPoints({
                        x: e.pageX,
                        y: e.pageY,
                    });
                }}
                to={`/playlist/${toId}`}
                ref={ref}
            >
                <img src={img} alt={title} className={cx('img', 'top-result')} />
                <div className={cx('description', 'top-result')}>
                    <h4>
                        <b>{title}</b>
                    </h4>
                    <div className={cx('sub-title')}>
                        <p>{subTitle}</p>
                        <Button smaller>Playlists</Button>
                    </div>
                </div>
                <div className={cx('wrapper-btn', 'top-result')}>
                    <Button primary rounded large className={cx('play-btn')}>
                        <BsFillPlayFill />
                    </Button>
                </div>
                {isComponentVisible && (
                    <SubMenu
                        menu={subMenu}
                        top={points.y - rect.top}
                        left={points.x - rect.left}
                        right={ref.current.clientWidth - points.x + rect.left}
                        bottom={ref.current.clientHeight - points.y + rect.top}
                        pointY={points.y}
                        pointX={points.x}
                    />
                )}
                {hasRemove && (
                    <Button icon className={cx('remove-btn')}>
                        <CloseIcon />
                    </Button>
                )}
            </Link>
        );
    } else {
        return (
            <Link
                className={cx('card')}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setIsComponentVisible(!isComponentVisible);
                    setPoints({
                        x: e.pageX,
                        y: e.pageY,
                    });
                }}
                to={`/${type}/${toId}`}
                ref={ref}
            >
                <div className={cx('wrapper-img')}>
                    {img ? (
                        <img src={img} alt={`Image of ${title}`} className={cx('img', rounded && 'rounded')} />
                    ) : (
                        <div className={cx('img', rounded && 'rounded')}>
                            {!rounded ? <CardImgFallbackIcon /> : <ArtistIcon />}
                        </div>
                    )}

                    <div className={cx('wrapper-btn')}>
                        <Button primary rounded large className={cx('play-btn')}>
                            <BsFillPlayFill />
                        </Button>
                    </div>
                </div>
                <div className={cx('description')}>
                    <h4>
                        <b>{title}</b>
                    </h4>
                    <p>
                        {album && `${year} • `}
                        {subTitle}
                    </p>
                </div>
                {isComponentVisible && (
                    <SubMenu
                        menu={subMenu}
                        top={points.y - rect.top}
                        left={points.x - rect.left}
                        right={ref.current.clientWidth - points.x + rect.left}
                        bottom={ref.current.clientHeight - points.y + rect.top}
                        pointY={points.y}
                        pointX={points.x}
                    />
                )}
                {hasRemove && (
                    <Button icon className={cx('remove-btn')}>
                        <CloseIcon />
                    </Button>
                )}
            </Link>
        );
    }
}

export default CardItem;
