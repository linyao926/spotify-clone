import DefaultMainLayout from "~/components/Layouts/DefaultMainLayout";
import { useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import classNames from "classnames/bind";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

function Home({children}) {
    const { renderRequireLogin } = useContext(AppContext);

    return ( 
        <div onClick={(e) => renderRequireLogin(e)}>
            <DefaultMainLayout />
        </div>
    );
}

export default Home;