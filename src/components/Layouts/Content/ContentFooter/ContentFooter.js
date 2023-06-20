import { useContext, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { BsFacebook } from 'react-icons/bs';
import Button from '~/components/Button';
import config from '~/config';
import classNames from "classnames/bind";
import styles from "./ContentFooter.module.scss";

const cx = classNames.bind(styles);

function ContentFooter() {
    const { isLogin } = useContext(AppContext);

    return ( 
        <footer className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('wrapper-content')}>
                    <div className={cx('content')}>
                        <h5 className={cx('content-title')}>Company</h5>
                        <Button dark underline small 
                            className={cx('content-text-btn')} 
                            href={config.externalLink.about} 
                            target='_blank'
                        >
                            About
                        </Button>
                        <Button dark underline small 
                            className={cx('content-text-btn')} 
                            href={config.externalLink.jobs} 
                            target='_blank'
                        >
                            Jobs
                        </Button>
                        <Button dark underline small 
                            className={cx('content-text-btn')} 
                            href={config.externalLink.record} 
                            target='_blank'
                        >
                            For the Record
                        </Button>
                    </div>
                    <div className={cx('content')}>
                        <h5 className={cx('content-title')}>communities</h5>
                        <Button dark underline small 
                            className={cx('content-text-btn')} 
                            href={config.externalLink.artists} 
                            target='_blank'
                        >
                            For Artists
                        </Button>
                        <Button dark underline small 
                            className={cx('content-text-btn')} 
                            href={config.externalLink.developers} 
                            target='_blank'
                        >
                            Developers
                        </Button>
                        <Button dark underline small 
                            className={cx('content-text-btn')} 
                            href={config.externalLink.ads} 
                            target='_blank'
                        >
                            Advertising
                        </Button>
                        <Button dark underline small 
                            className={cx('content-text-btn')} 
                            href={config.externalLink.investors} 
                            target='_blank'
                        >
                            Investors
                        </Button>
                        <Button dark underline small 
                            className={cx('content-text-btn')} 
                            href={config.externalLink.vendor} 
                            target='_blank'
                        >
                            Vendors
                        </Button>
                        <Button dark underline small 
                            className={cx('content-text-btn')} 
                            href={config.externalLink.work} 
                            target='_blank'
                        >
                            Spotify for Work
                        </Button>
                    </div>
                    <div className={cx('content')}>
                        <h5 className={cx('content-title')}>useful links</h5>
                        <Button dark underline small 
                            className={cx('content-text-btn')} 
                            href={config.externalLink.support} 
                            target='_blank'
                        >
                            Support
                        </Button>
                        <Button dark underline small 
                            className={cx('content-text-btn')} 
                            href={config.externalLink.download} 
                            target='_blank'
                        >
                            Free Mobile App
                        </Button>
                    </div>
                </div>
                <div className={cx('content-social')}>
                    <Button icon className={cx('icon-btn')} href='https://www.instagram.com/spotify/' target='_blank'>
                        <AiOutlineInstagram />
                    </Button>
                    <Button icon className={cx('icon-btn')} href='https://twitter.com/spotify' target='_blank'>
                        <AiOutlineTwitter />
                    </Button>
                    <Button icon className={cx('icon-btn')} href='https://www.facebook.com/SpotifyVietnam/?brand_redir=6243987495' target='_blank'>
                        <BsFacebook />
                    </Button>
                </div>
            </div>
            <div className={cx('legal')}>
                <div>
                    <Button dark underline small 
                        className={cx('legal-btn')} 
                        href={config.externalLink.legal} 
                        target='_blank'
                    >
                        Legal
                    </Button>
                    <Button dark underline small 
                        className={cx('legal-btn')} 
                        href={config.externalLink.privacy} 
                        target='_blank'
                    >
                        Privacy Center
                    </Button>
                    <Button dark underline small 
                        className={cx('legal-btn')} 
                        href={config.externalLink.policy} 
                        target='_blank'
                    >
                        Privacy Policy
                    </Button>
                    <Button dark underline small 
                        className={cx('legal-btn')} 
                        href={config.externalLink.cookies} 
                        target='_blank'
                    >
                        Cookies
                    </Button>
                    <Button dark underline small 
                        className={cx('legal-btn')} 
                        href={config.externalLink.aboutAds} 
                        target='_blank'
                    >
                        About Ads
                    </Button>
                    <Button dark underline small 
                        className={cx('legal-btn')} 
                        href={config.externalLink.accessibility} 
                        target='_blank'
                    >
                        Accessibility
                    </Button>
                </div>
                <p>© 2023 Spotify AB</p>
            </div>
        </footer>
    );
}

export default ContentFooter;