import { useContext } from 'react';
import { AppContext } from '~/context/AppContext';
import ContentFooter from '../ContentFooter';
import classNames from 'classnames/bind';
import styles from './TrackContent.module.scss';

const cx = classNames.bind(styles);

function TrackContent() {
    return (
        <div>
            track content
        </div>
    );
}

export default TrackContent;