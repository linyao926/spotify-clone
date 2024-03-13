import config from "~/config";
import ButtonPrimary from "~/components/Blocks/Buttons/ButtonPrimary";
import MainFooter from "~/components/Blocks/MainFooter";
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
                <ButtonPrimary primary 
                    href={config.externalLink.download} 
                    target="_blank" 
                    className={cx('btn')
                }
                >
                    Get out free app
                </ButtonPrimary>
            </div>
            <MainFooter />
        </>
    );
}

export default Download;