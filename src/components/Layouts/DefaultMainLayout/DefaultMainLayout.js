import { useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import HeaderHomePage from "../HeaderHomePage";
import Sidebar from "../Sidebar";
import classNames from "classnames/bind";
import styles from "./DefaultMainLayout.module.scss";

const cx = classNames.bind(styles);

function DefaultMainLayout({children}) {
    const { widthNavbar } = useContext(AppContext);

    const containerWidth = document.body.clientWidth - widthNavbar;

    return ( 
        <div className={cx('wrapper')}>
            <Sidebar />
            <div className={cx('container')} 
                 style={{
                    left: `${widthNavbar}px`, 
                    width: `${containerWidth}px`
                }}>
                <HeaderHomePage />
                {children}
            </div>
        </div>
    );
}

export default DefaultMainLayout;