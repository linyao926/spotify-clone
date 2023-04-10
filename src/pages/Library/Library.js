import DefaultMainLayout from "~/components/Layouts/DefaultMainLayout";
import classNames from "classnames/bind";
import styles from "./Library.module.scss";

const cx = classNames.bind(styles);

function Library({children}) {
    return ( 
        <DefaultMainLayout />
    );
}

export default Library;