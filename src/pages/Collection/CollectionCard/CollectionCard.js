import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams } from 'react-router-dom';
import { PersonIcon } from '~/assets/icons';
import Button from '~/components/Button';
import { BsArrowRight } from 'react-icons/bs';
import classNames from 'classnames/bind';
import styles from './CollectionCard.module.scss';

const cx = classNames.bind(styles);

function CollectionCard(props) {
    const {imgUrl, title, ownName, itemName, subTitle, toPage} = props;

    const cardRef = useRef(null);

    const styles = {
        background: {
            backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4="), url(${imgUrl})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        },
    };

    return ( 
        <div
            className={cx('collection-item')}
            ref={cardRef}
        >   
            <div className={cx('item-bg')} 
                style={styles.background}
            />     
            <div className={cx('intro')}>
                <span className={cx('own')}>{ownName}</span>
                <span className={cx('represent')}>{title}</span>
            </div>
            <h4>{itemName}</h4>
            <span className={cx('description')}>{subTitle}</span>
            <div className={cx('wrapper-btn')}
                // onClick={(e) => handleClickPlayTrack(e)}
            >
                <Button primary rounded large className={cx('more-btn')}   
                    to={toPage}
                >
                    <BsArrowRight />
                </Button>
            </div>
        </div> 
    );
}

export default CollectionCard;