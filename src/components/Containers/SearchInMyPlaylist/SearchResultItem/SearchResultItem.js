import { useContext, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { useContextMenu } from '~/hooks';
import { Link } from 'react-router-dom';
import { AiOutlineRight } from 'react-icons/ai';
import SubMenu from '~/components/Blocks/SubMenu';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import classNames from 'classnames/bind';
import styles from './SearchResultItem.module.scss';

const cx = classNames.bind(styles);

function SearchResultItem(props) {
    const {
        col2 = false,
        isTrack = false,
        isArtist = false,
        isExpand = false,
        expandFunc,
        img,
        title,
        subTitle,
        album,
        toAlbumId,
        toId,
        handleClickFunc,
        artistData,
    } = props;

    const { ref, isComponentVisible, setIsComponentVisible, points, setPoints } = useContextMenu();

    const { contextMenu } = useContext(AppContext);

    useEffect(() => {
        if (col2) {
            ref.current.style.gridTemplateColumns = '[first] 4fr [last] minmax(120px,1fr)';
        } else {
            ref.current.style.gridTemplateColumns = '[first] 4fr [var] 2fr [last] minmax(120px,1fr)';
        }
    }, [ref.current]);

    let rect;

    if (ref.current) {
        rect = ref.current.getBoundingClientRect();
    };

    const handleCloseSubMenu = () => {
        setIsComponentVisible(false);
    };

    const artistNamesMenu = (artists) => artists.map((artist) => ({
        title: artist.name,
        to: `/artist/${artist.id}`
    }));

    return ( 
        <div ref={ref} className={cx('wrapper', isTrack && 'is-track')}
            onClick={() => {
                if (!isTrack) {
                    if (isExpand) {
                        handleClickFunc(expandFunc, title);
                    } else {
                        handleClickFunc(isArtist, title, toId);
                    }
                }
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                if (isTrack) {
                    setIsComponentVisible(!isComponentVisible);
                    setPoints({
                        x: e.pageX,
                        y: e.pageY,
                    });
                }
            }}
        >
            {isExpand 
            ? <div className={cx('describe')}>
                {title}
            </div>
            : <div className={cx('intro', 'first')}>
                <div className={cx('wrapper-img')}>
                    <img src={img} alt={title} className={cx('img', isArtist && 'artist')} />
                </div>
                <div className={cx('describe')}>
                    <div className={cx('title')}>
                        {title}
                    </div>
                    <div className={cx('sub-title', isTrack && 'is-track')}>
                        {subTitle}
                    </div>
                </div>
            </div>}
            {isTrack &&
                <Link className={cx('album-title', 'var')}
                    to={`/album/${toAlbumId}`}
                >
                    {album}
                </Link>
            }
            {isTrack ? <ButtonPrimary dark small outline className={cx('add-btn')}
                onClick={() => handleClickFunc(toId)}
            >
                Add
            </ButtonPrimary>
            : <ButtonPrimary dark icon className={cx('expand-btn')}> 
                <AiOutlineRight />
            </ButtonPrimary>}
            {isTrack && isComponentVisible && (
                <SubMenu
                    menu={contextMenu.track}
                    top={points.y - rect.top}
                    left={points.x - rect.left}
                    right={window.innerWidth - points.x}
                    bottom={window.innerHeight - points.y}
                    pointY={points.y}
                    pointX={points.x}
                    isTrack={isTrack}
                    queueId={toId}
                    toId={toId}
                    handleCloseSubMenu={handleCloseSubMenu}
                    artistSubmenu={artistData && artistData.length > 1 && artistNamesMenu(artistData)}
                    toAlbumId={toAlbumId}
                    toArtistId={artistData && artistData.length === 1 && artistData[0].id}
                />
            )}
        </div>
    );
}

export default SearchResultItem;