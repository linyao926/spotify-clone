import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./MusicPlayer.module.scss";

const cx = classNames.bind(styles);

function ProgressBar({
    trackData = false,
    audioRef,
    progressBarRef,
    timeProgress,
    setTimeProgress,
    duration,
    smallerWidth,
    isExpand,
}) {
    const [isOnChange, setIsOnChange] = useState(false);

    useEffect(() => {
        progressBarRef.current.value = timeProgress;
    }, [timeProgress]);

    useEffect(() => {
        if (isOnChange && !audioRef.current.state.isPlaying) {
            setIsOnChange(false);
        }
    }, [isOnChange, progressBarRef.current?.value]);
    
    const handleProgressChange = () => {
        setIsOnChange(true);
        let position = progressBarRef.current.value/duration;
        position = Number(((Number.isFinite(position) ? position : 0) * 100).toFixed(1));

        if (audioRef.current) {
            audioRef.current.handleChangeRange(position)
        }
        if (!audioRef.current.state.isPlaying) {
            progressBarRef.current.style.setProperty(
                '--range-progress',
                `${(progressBarRef.current.value/duration) * 100}%`
            );
        }
    };

    if (progressBarRef.current) {
        progressBarRef.current.style.setProperty(
            '--range-progress',
            `${(progressBarRef.current.value/duration) * 100}%`
        );
    }

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    };

    function msToMinAndSeconds(ms) {
        let minutes = Math.floor(ms / 60000);
        let seconds = ((ms % 60000) / 1000).toFixed(0);
        return seconds === '60' ? `${padTo2Digits(minutes + 1)}: 00` : `${padTo2Digits(minutes)} : ${padTo2Digits(seconds)}`;
    };

    const styles = {
        input: {
            height: '4px'
        }
    };

    return ( 
        <div className={cx('track-progress', (!trackData && 'disable'), isExpand && 'expand')}
            style={{
                display: isExpand && 'block',
                padding: isExpand && '0 16px',
                bottom: isExpand && '90px',
                marginLeft: isExpand && '-4px',
            }}
        >
            {!smallerWidth && (
                <span style={{textAlign: 'end'}} className={cx('track-duration')}>{trackData ? msToMinAndSeconds(progressBarRef.current ? progressBarRef.current.value : 0) : '-:--'}</span>
            )}
            <input type="range" 
                className={cx('progress-bar', isExpand && 'expand')} 
                ref={progressBarRef} 
                defaultValue="0"
                onChange={handleProgressChange}
                style={isExpand ? styles.input : null}
                // step="any"
            />
            {!smallerWidth && (
                <span className={cx('track-duration')}>{trackData ? msToMinAndSeconds(duration) : '-:--'}</span>
            )}
            {isExpand && <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <span className={cx('track-duration')}>{trackData ? msToMinAndSeconds(progressBarRef.current ? progressBarRef.current.value : 0) : '-:--'}</span>
                <span style={{textAlign: 'end'}} className={cx('track-duration')}>{trackData ? msToMinAndSeconds(duration) : '-:--'}</span>
            </div>}
        </div>
    );
}

export default ProgressBar;