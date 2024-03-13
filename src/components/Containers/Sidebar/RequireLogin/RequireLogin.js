import { useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import config from '~/config';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
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
                <ButtonPrimary dark small onClick={(e) => renderRequireLogin(e)}>Not now</ButtonPrimary>
                <ButtonPrimary small href={config.routes.login}>Log in</ButtonPrimary>
            </div>
        </div>
    );
}

export default RequireLogin;