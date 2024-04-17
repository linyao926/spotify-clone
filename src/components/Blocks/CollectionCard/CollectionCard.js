import { useRef } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
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
            <div className={cx('wrapper-btn')}>
                <ButtonPrimary primary rounded large className={cx('more-btn')}   
                    to={toPage}
                >
                    <BsArrowRight />
                </ButtonPrimary>
            </div>
        </div> 
    );
}

export default CollectionCard;