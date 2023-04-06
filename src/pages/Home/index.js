import HeaderHomePage from "~/components/Layouts/HeaderHomePage";
import Sidebar from "~/components/Layouts/Sidebar";
import classNames from "classnames/bind";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

function Home({children}) {
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

export default Home;