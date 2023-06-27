import Button from "~/components/Button/Button";
import config from "~/config";
import ContentFooter from "~/components/Layouts/Content/ContentFooter";
import classNames from 'classnames/bind';
import styles from './Download.module.scss';

const cx = classNames.bind(styles);

function Download() {
    return ( 
        <>
            <div className={cx('wrapper-content')}>
                <img src='https://open.spotifycdn.com/cdn/images/devices/mac.3fbeb8c6.png' alt='Mac image' className={cx('img')} />
                <span className={cx('title')} >
                    Seamlessly listen to music you love. Download the Spotify app for your computer.
                </span>
                <Button primary 
                    href={config.externalLink.download} 
                    target="_blank" 
                    className={cx('btn')
                }
                >
                    Get out free app
                </Button>
            </div>
            <ContentFooter />
        </>
    );
}

export default Download;