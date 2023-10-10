import { useContext, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import Button from '~/components/Button';
import { AiOutlineClose } from 'react-icons/ai';
import classNames from 'classnames/bind';
import styles from './Languages.module.scss';

const cx = classNames.bind(styles);

function Languages() {
    const { availableLanguages, closeModal, showRemind, setShowRemind } = useContext(AppContext);

    return ( 
        <aside className={cx("wrapper")} onClick={() => closeModal()}>
            <div className={cx("container")}  onClick={e => e.stopPropagation()}>
                <header className={cx("header")}>
                    <div className={cx("title")}>
                        <h3>Choose a language</h3>
                        <p>This updates what you read on open.spotify.com</p>
                    </div>
                    <Button icon rounded active onClick={() => closeModal()}>
                        <AiOutlineClose />
                    </Button>
                </header>
                
                <div className={cx("content")}>
                    {availableLanguages.map((item) => (
                        <Button dark block keys={item.code} onClick={() => setShowRemind(true)}>
                            <span>{item.local}</span>
                            <span>{item.name}</span>
                        </Button>
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default Languages;