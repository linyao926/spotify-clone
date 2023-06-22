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
    icon, 
    top, 
    left, 
    children, 
    className, 
    onClick, 
    ...passProps 
}) {
    const { widthNavbar, handleLogout } = useContext(AppContext);

    const classes = cx(
        'submenu-content',
        {
            [className]: className,
            language,
            icon,
        },
        posLeft && 'l-pos',
    );

    return (
        <div className={classes} style={{top: `${top - 114}px`, left: `${left - widthNavbar - 20}px`}}>
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
                }

                return (
                    <Comp
                        key={index}
                        className={cx(
                            'item',
                            item.border && 'bd-bt',
                            item.disable && 'disable',
                            item.active && 'active',
                        )}
                        onClick={() => handleClick()}
                        {...props}
                    >
                        {item.lefticon && <span className={cx('l-icon-inline')}>{item.lefticon}</span>}
                        <button value={item.value}>{item.title}</button>
                        {item.rightIcon && <span className={cx('r-icon-inline')}>{item.rightIcon}</span>}
                    </Comp>
                );
            })}
        </div>
    );
}

export default SubMenu;
