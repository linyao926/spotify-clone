import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './SubMenu.module.scss';

const cx = classNames.bind(styles);

function SubMenu({
    menu,
    language,
    posLeft,
    pointY,
    pointX,
    icon,
    top,
    bottom,
    left,
    right,
    children,
    className,
    onClick,
    ...passProps
}) {
    const { handleLogout, mainContainer, contextMenu, widthNavbar } = useContext(AppContext);

    const menuRef = useRef(null);
    const childRef = useRef(null);

    const classes = cx(
        'submenu-content',
        {
            [className]: className,
            language,
            icon,
        },
        posLeft && 'l-pos',
    );

    useEffect(() => {
        if (menuRef.current) {
            if (pointY + menuRef.current.clientHeight > mainContainer.height) {
                menuRef.current.style.bottom = `${bottom}px`;
            } else {
                menuRef.current.style.top = `${top}px`;
            }

            if (pointX - widthNavbar - 16 + menuRef.current.clientWidth > mainContainer.width) {
                menuRef.current.style.right = `${right}px`;
            } else {
                menuRef.current.style.left = `${left}px`;
            }
        }
    }, [menuRef.current]);

    useEffect(() => {
        if (childRef.current) {
            if (pointX - widthNavbar - 16 + menuRef.current.clientWidth + childRef.current.clientWidth > mainContainer.width) {
                childRef.current.style.left = `-160px`;
            } else {
                childRef.current.style.right = `0px`;
            }
        }
    }, [childRef.current]);

    return (
        <div className={classes} ref={menuRef}>
            {menu.map((item, index) => {
                let Comp = 'div';

                const props = {
                    ...item,
                };

                for (let i in item) {
                    if (i === 'to') {
                        Comp = Link;
                    } else if (i === 'href') {
                        Comp = 'a';
                    }
                }

                const handleActive = () => {
                    for (let i in item) {
                        if (i === 'active') {
                            if (!i) {
                                item.active = true;
                            }
                        }
                    }
                };

                const handleClick = () => {
                    if (item.logout) {
                        handleLogout();
                    }
                };

                return (
                    <Comp
                        key={index}
                        className={cx(
                            'item',
                            item.child && 'children',
                            item.isSearch && 'search',
                            item.border && 'bd-bt',
                            item.disable && 'disable',
                            item.active && 'active',
                        )}
                        onClick={() => handleClick()}
                        {...props}
                    >
                        {item.lefticon && <span className={cx('l-icon-inline')}>{item.lefticon}</span>}
                        <button value={item.value}>{item.title}</button>
                        {item.rightIcon && (
                            <>
                                <span className={cx('r-icon-inline')}>
                                    {item.rightIcon}
                                </span>
                                <div className={cx('submenu-children')}
                                    ref={childRef}
                                >
                                    <SubMenu menu={contextMenu['children-playlist']} />
                                </div>
                            </>
                        )}
                    </Comp>
                );
            })}
        </div>
    );
}

export default SubMenu;
