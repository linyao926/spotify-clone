import DefaultMainLayout from "~/components/Layouts/DefaultMainLayout";
import classNames from "classnames/bind";
import styles from "./Search.module.scss";

const cx = classNames.bind(styles);

function Search({children}) {
    return ( 
        <DefaultMainLayout />
    );
}

export default Search;