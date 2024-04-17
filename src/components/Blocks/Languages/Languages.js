import { useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import { AiOutlineClose } from 'react-icons/ai';
import ButtonPrimary from '../Buttons/ButtonPrimary';
import classNames from 'classnames/bind';
import styles from './Languages.module.scss';

const cx = classNames.bind(styles);

function Languages() {
    const { availableLanguages, closeModal, setShowRemind } = useContext(AppContext);

    return ( 
        <aside className={cx("wrapper")} onClick={() => closeModal()}>
            <div className={cx("container")}  onClick={e => e.stopPropagation()}>
                <header className={cx("header")}>
                    <div className={cx("title")}>
                        <h3>Choose a language</h3>
                        <p>This updates what you read on open.spotify.com</p>
                    </div>
                    <ButtonPrimary icon rounded active onClick={() => closeModal()}>
                        <AiOutlineClose />
                    </ButtonPrimary>
                </header>
                
                <div className={cx("content")}>
                    {availableLanguages.map((item) => (
                        <ButtonPrimary dark block keys={item.code} onClick={() => setShowRemind(true)}>
                            <span>{item.local}</span>
                            <span>{item.name}</span>
                        </ButtonPrimary>
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default Languages;