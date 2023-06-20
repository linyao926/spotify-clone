import { useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import Button from '~/components/Button';
import config from '~/config';
import classNames from 'classnames/bind';
import styles from './RequireLogin.module.scss';

const cx = classNames.bind(styles);

function RequireLogin() {
    const { selectedItemNav, renderRequireLogin } = useContext(AppContext);

    return ( 
        <div className={cx("wrapper")} >
            <h4 className={cx("header")}>{selectedItemNav.children.title}</h4>
            <p className={cx("description")}>{selectedItemNav.children.description}</p>
            <div className={cx("btn")}>
                <Button dark small onClick={(e) => renderRequireLogin(e)}>Not now</Button>
                <Button small href={config.routes.login}>Log in</Button>
            </div>
        </div>
    );
}

export default RequireLogin;