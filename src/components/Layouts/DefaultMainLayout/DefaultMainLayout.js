import HeaderHomePage from "../HeaderHomePage";
import Sidebar from "../Sidebar";
import classNames from "classnames/bind";
import styles from "./DefaultMainLayout.module.scss";

const cx = classNames.bind(styles);

function DefaultMainLayout({children}) {
    return ( 
        <div className={cx('wrapper')}>
            <Sidebar />
            <div className={cx('container')}>
                <HeaderHomePage />
                {children}
            </div>
        </div>
    );
}

export default DefaultMainLayout;