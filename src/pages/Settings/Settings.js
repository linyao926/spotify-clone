import { useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import ContentFooter from '~/components/Layouts/Content/ContentFooter';
import classNames from 'classnames/bind';
import styles from './Settings.module.scss';

const cx = classNames.bind(styles);

function Settings() {
    const {availableLanguages} = useContext(AppContext);

    return ( 
        <>
            <div className={cx('wrapper')}>
                <h3>Settings</h3>
                <div className={cx("frame")}>
                    <h4>Language</h4>
                    <div className={cx("content")}>
                        <p>Choose language - Changes will be applied after restarting the app</p>
                        <select className={cx("dropdown")}>
                            {availableLanguages.map((item) => (
                                <option key={item.local} value={item.local}>
                                    {`${item.local} (${item.name})`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={cx("frame")}>
                    <h4>Display</h4>
                    <div className={cx("content")}>
                        <p>Show the now-playing panel on click of play</p>
                        <button className={cx("toggle-btn", 'active')}>
                            <div className={cx("circle")}></div>
                        </button>
                    </div>
                </div>
            </div>
            <ContentFooter />
        </>
    );
}

export default Settings;