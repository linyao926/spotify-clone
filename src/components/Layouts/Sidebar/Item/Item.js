import { useContext} from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '~/context/AppContext';
import RequireLogin from '../RequireLogin';
import classNames from 'classnames/bind';
import styles from './Item.module.scss';

const cx = classNames.bind(styles);

function Item({item, classNames}) {
    const { selectedItemNav, showRequire, renderRequireLogin, isLogin, collapse } = useContext(AppContext);
    
    return (
        <li id={item.id}
            className={cx(showRequire ? "require-wrapper" : "")}
            onClick={(e) => renderRequireLogin(e, item.id)}
        >
            {item.isInteract 
                ? <NavLink to={(!item.requireLogin) && item.to} 
                            className={({isActive}) => cx('nav-link', classNames, 
                            ((!item.requireLogin && isActive) ? "active" : ""))}
                >
                        <div className={cx('icon-box')}>
                            {item.icon}
                        </div>
                        <span>{item.title}</span>
                </NavLink>
                : <NavLink to={(!item.requireLogin) && item.to} 
                            className={({isActive}) => cx('nav-link','navigation-link', 
                                ((!item.requireLogin && isActive) ? "active" : ""), 
                                ((isLogin) && 'login'))
                            }
                            end
                >
                        <div className={cx('navigation-icon')}>
                            {item.icon}
                        </div>
                        {!collapse && <span>{item.title}</span>}
                </NavLink>
            }
            {showRequire && selectedItemNav.id === item.id && <RequireLogin />}
        </li>
    )
}

export default Item;