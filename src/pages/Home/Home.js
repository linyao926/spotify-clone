import DefaultMainLayout from "~/components/Layouts/DefaultMainLayout";
import Languages from '~/components/Languages/Languages';
import { useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import classNames from "classnames/bind";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

function Home({children}) {
    const { renderRequireLogin, showModal } = useContext(AppContext);

    const handleClick = (e) => {
        renderRequireLogin(e);       
    }

    return ( 
        <div onClick={(e) => handleClick(e)}>
            <DefaultMainLayout />
            {showModal && <Languages />}
        </div>
    );
}

export default Home;