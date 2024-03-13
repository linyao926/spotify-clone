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

    const { trackData, currentPlayingIndex, musicList, playerRef, repeat, setRepeat, repeatOne, setRepeatOne, shuffle, setShuffle, setCurrentPlayingIndex, setPlaying, playing, nextQueueId, setClickNext, waitingMusicList, nowPlayingId } = props;

    return (
        <div className={cx('player-control', !trackData && 'disable')}>
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
                onClick={() => {
                    if (playerRef.current && parseInt(playerRef.current.state.position, 10) > 2) {
                        playerRef.current.handleChangeRange(0);
                    } else if (musicList) {
                        if (currentPlayingIndex > 0) {
                            setCurrentPlayingIndex(currentPlayingIndex - 1);
                        }
                    }
                }}
            >
                <PreviousIcon />
                {trackData && currentPlayingIndex > 0 && <span className={cx('tooltiptext')}>Previous</span>}
            </span>
            <ButtonPrimary rounded icon className={cx('tooltip', 'play-btn')} onClick={() => setPlaying(!playing)}>
                {!trackData ? <PauseIcon /> : playing ? <PauseIcon /> : <PlayIcon />}
            </ButtonPrimary>
            <span
                className={cx('tooltip', 'svg-icon')}
                onClick={() => {
                    if (nextQueueId) {
                        setClickNext(true);
                        if (nextQueueId.length === 0) {
                            setCurrentPlayingIndex(currentPlayingIndex + 1);
                        }
                    } else if (waitingMusicList && waitingMusicList.length > 0) {
                        if (waitingMusicList[0] === nowPlayingId) {
                            playerRef.current.handleChangeRange(0);
                        }
                        if (currentPlayingIndex < musicList.length - 1) {
                            setCurrentPlayingIndex(currentPlayingIndex + 1);
                        }
                    }
                }}
            >
                <NextIcon />
                {trackData && musicList && currentPlayingIndex < musicList.length - 1 && (
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