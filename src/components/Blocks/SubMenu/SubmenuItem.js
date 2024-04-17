import { forwardRef, useContext, useEffect, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FillPinIcon, RowRightIcon } from '~/assets/icons/icons';
import ButtonPrimary from '../Buttons/ButtonPrimary';
import SubMenu from './SubMenu';
import classNames from 'classnames/bind';
import styles from './SubMenu.module.scss';

const cx = classNames.bind(styles);

const SubmenuItem = forwardRef(function SubmenuItem(props, ref) {
    const {
        isTitle2,
        pointX,
        parent,
        itemIndex,
        isHref, 
        isTo,
        path,
        child,
        classes,
        handleClick,
        item,
        isSearch,
        toId,
        albumTrackIds,
        searchMyPlaylistValue,
        isArtistSubmenu,
        handleCloseSubMenu,
        isAlbum,
        renderRemind,
        setRenderRemind,
    } = props;

    const navigate = useNavigate();

    const {
        mainContainer,
        widthNavbar,
    } = useContext(AppContext);

    const [childStyles, setChildStyles] = useState({
        top: '0px',
    });

    useEffect(() => {
        if (ref.current && child) {
            if (parent.height + (child.length - 1) * 40 + itemIndex * 40  > mainContainer.height) {
                setChildStyles({
                    top: `-${(child.length - 1) * 40 + 4}px`,
                })
            } else {
                setChildStyles({
                    top: '0px'
                })
            }

            if (pointX - widthNavbar - 16 + parent.width + 258 > mainContainer.width) {
                setChildStyles(props => ({
                    top: props.top,
                    left: '-258px',
                }))
            } else {
                setChildStyles(props => ({
                    top: props.top,
                    right: '0px',
                }))
            }
        }
    }, [ref.current]);

    let Comp = 'div';
    if (isHref) {
        Comp = 'a';
    }
    
    return isSearch 
        ? <div className={classes}
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleClick(e)
            }}
        >
            {item.title}
        </div>

        :<Comp
            className={classes}
            onClick={(e) => {
                handleClick(e);
                isTo && navigate(path);
            }}
            href={isHref ? path : null}
            target={isHref ? '_blank' : null}
        >
            {item.lefticon && <span className={cx('l-icon-inline', (item.lIconActive || (item['title-2'] && isTitle2)) && 'active')}>{(item['title-2'] && isTitle2) ? <FillPinIcon /> : item.lefticon}</span>}
            <button value={item.value}>
                {item['title-2'] ? (isTitle2 ? item['title-2'] : item.title) : item.title}
            </button>
            {((child && item.to == '/artist') ||  item.rightIcon) && (
                <span className={cx('r-icon-inline')}>
                    {item.rightIcon ? item.rightIcon : <RowRightIcon />}
                </span>
            )}
            <div className={cx('submenu-children', (searchMyPlaylistValue.length > 0 && !isArtistSubmenu) && 'visible')} ref={ref}
                style={childStyles}
            >
            {child && <SubMenu handleCloseSubMenu={handleCloseSubMenu} menu={child} toId={toId} trackIds={albumTrackIds} isAlbum={isAlbum} />}
            </div>
        </Comp> 
        
    ;
});

export default SubmenuItem;