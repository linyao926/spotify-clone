import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import config from '~/config';
import Button from '~/components/Button';
import classNames from "classnames/bind";
import styles from "./ControlBar.module.scss";

const cx = classNames.bind(styles);

function ControlBar() {
    const { isLogin } = useContext(AppContext);

    return ( 
        isLogin 
        ? <div className={cx('wrapper', 'login')}>
            Control
        </div>
        : <div className={cx('wrapper')}>
            <div className={cx('text')}>
                <h5>preview of spotify</h5>
                <p>Sign up to get unlimited songs and podcasts with occasional ads. No credit card needed</p>
            </div>
            <Button href={config.routes.login}>Login</Button>
        </div>
    );
}

export default ControlBar;