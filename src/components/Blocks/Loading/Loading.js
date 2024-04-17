import classNames from 'classnames/bind';
import styles from './Loading.module.scss';

const cx = classNames.bind(styles);

function Loading({height = '78%'}) {
    return ( 
        <div className={cx('loader-container')}
            style={{
                height: height
            }}
        >
            <div className={cx('loader')} />
        </div>
    );
}

export default Loading;