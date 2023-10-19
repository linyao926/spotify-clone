import { useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai';
import { BsFacebook } from 'react-icons/bs';
import Button from '~/components/Button';
import config from '~/config';
import classNames from "classnames/bind";
import styles from "./ContentFooter.module.scss";

const cx = classNames.bind(styles);

function ContentFooter() {
    const { containerWidth } = useContext(AppContext);

    const listItems = {
        company: [
            {
                child: 'About',
                href: config.externalLink.about,
                'class-name': 'content-text-btn'
            },
            {
                child: 'Jobs',
                href: config.externalLink.jobs,
                'class-name': 'content-text-btn'
            },
            {
                child: 'For the Record',
                href: config.externalLink.record,
                'class-name': 'content-text-btn'
            },
        ],
        communities: [
            {
                child: 'For Artists',
                href: config.externalLink.artists,
                'class-name': 'content-text-btn'
            },
            {
                child: 'Developers',
                href: config.externalLink.developers,
                'class-name': 'content-text-btn'
            },
            {
                child: 'Advertising',
                href: config.externalLink.ads,
                'class-name': 'content-text-btn'
            },
            {
                child: 'Investors',
                href: config.externalLink.investors,
                'class-name': 'content-text-btn'
            },
            {
                child: 'Vendor',
                href: config.externalLink.vendor,
                'class-name': 'content-text-btn'
            },
        ],
        useful: [
            {
                child: 'Support',
                href: config.externalLink.support,
                'class-name': 'content-text-btn'
            },
            {
                child: 'Free Mobile App',
                href: config.externalLink.download,
                'class-name': 'content-text-btn'
            },
        ],
        legal: [
            {
                child: 'Legal',
                href: config.externalLink.legal,
                'class-name': 'legal-btn'
            },
            {
                child: 'Privacy Center',
                href: config.externalLink.privacy,
                'class-name': 'legal-btn'
            },
            {
                child: 'Privacy Policy',
                href: config.externalLink.policy,
                'class-name': 'legal-btn'
            },
            {
                child: 'Cookies',
                href: config.externalLink.cookies,
                'class-name': 'legal-btn'
            },
            {
                child: 'About Ads',
                href: config.externalLink.aboutAds,
                'class-name': 'legal-btn'
            },
            {
                child: 'Accessibility',
                href: config.externalLink.accessibility,
                'class-name': 'legal-btn'
            },
        ],
    };

    const displayContent = (title, property) => {
        return (
            <div className={cx('content')}>
                <h5 className={cx('content-title')}>{title}</h5>
                {listItems[property].map(item => displayExternalLink(item.href, item.child, item['class-name']))}
            </div>
        );
    }

    const displayExternalLink = (href, child, className) => {
        return (
            <Button dark underline small
                className={cx(className)}
                href={href}
                target='_blank'
                key={href}
            >
                {child}
            </Button>
        );
    };

    return ( 
        <footer className={cx('wrapper')}
            style={{ padding: `44px clamp(16px,16px + (${containerWidth} - 600)/424 * 8px, 24px) 72px` }}
        >
            <div className={cx('container')}>
                <div className={cx('wrapper-content')}>
                    {displayContent('company', 'company')}
                    {displayContent('communities', 'communities')}
                    {displayContent('useful links', 'useful')}
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
                    {listItems.legal.map(item => displayExternalLink(item.href, item.child, item['class-name']))}
                </div>
                <span  style={{
                        width: 'fit-content',
                        display: 'flex',
                        height: '30px',
                        alignItems: 'center',
                        minWidth: '124px',
                    }}
                >© 2023 Spotify AB</span>
            </div>
        </footer>
    );
}

export default ContentFooter;