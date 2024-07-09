import { useContext } from 'react';
import { MusicPlayerContext } from '~/context/MusicPlayerContext';
import {
    ShuffleIcon,
    PreviousIcon,
    PlayIcon,
    NextIcon,
    RepeatIcon,
    RepeatOneIcon,
    PauseIcon,
} from '~/assets/icons';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import classNames from 'classnames/bind';
import styles from './MusicPlayer.module.scss';

const cx = classNames.bind(styles);

function PlayerControls(props) {
    const {  
        currentPlayingIndex, 
        playlist,  
        playPreviousTrack,
        playNextTrack, 
        setPlaying, 
        playing, 
    } = props;

    const {
        trackData, 
        repeat, setRepeat,
        repeatOne, setRepeatOne,
        shuffle, setShuffle,
        expand,
    } = useContext(MusicPlayerContext);

    return (
        <div className={cx('player-control', !trackData && 'disable', expand && 'expand')}>
            <span
                className={cx('tooltip', 'svg-icon', 'shuffle-icon', trackData && shuffle && 'active')}
                onClick={() => setShuffle(!shuffle)}
            >
                <ShuffleIcon />
                {trackData &&
                    (shuffle ? (
                        <span className={cx('tooltiptext')}>Disable shuffle</span>
                    ) : (
                        <span className={cx('tooltiptext')}>Enable shuffle</span>
                    ))}
            </span>
            <span
                className={cx('tooltip', 'svg-icon')}
                onClick={() => playPreviousTrack()}
            >
                <PreviousIcon />
                {trackData && currentPlayingIndex > 0 && <span className={cx('tooltiptext')}>Previous</span>}
            </span>
            <ButtonPrimary rounded icon className={cx('tooltip', 'play-btn')} onClick={() => setPlaying(!playing)}>
                {!trackData ? <PauseIcon /> : playing ? <PauseIcon /> : <PlayIcon />}
            </ButtonPrimary>
            <span
                className={cx('tooltip', 'svg-icon')}
                onClick={() => playNextTrack()}
            >
                <NextIcon />
                {trackData && playlist && currentPlayingIndex < playlist.length - 1 && (
                    <span className={cx('tooltiptext')}>Next</span>
                )}
            </span>
            <span
                className={cx('tooltip', 'svg-icon', 'repeat-icon', (repeat || repeatOne) && 'active')}
                onClick={() => {
                    if (repeat) {
                        setRepeatOne(true);
                        setRepeat(false);
                    } else if (repeatOne) {
                        setRepeatOne(false);
                    } else {
                        setRepeat(true);
                    }
                }}
            >
                {repeatOne ? <RepeatOneIcon /> : <RepeatIcon />}
                {trackData &&
                    (!repeat ? (
                        <span className={cx('tooltiptext')}>Enable repeat</span>
                    ) : repeatOne ? (
                        <span className={cx('tooltiptext')}>Disable repeat</span>
                    ) : (
                        <span className={cx('tooltiptext')}>Enable repeat one</span>
                    ))}
            </span>
        </div>
    )
}

export default PlayerControls;