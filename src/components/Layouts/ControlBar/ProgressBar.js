import { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ControlBar.module.scss";

const cx = classNames.bind(styles);

function ProgressBar({
    trackData = false,
    audioRef,
    progressBarRef,
    timeProgress,
    setTimeProgress,
    duration,
}) {

    useEffect(() => {
        progressBarRef.current.value = timeProgress;
    }, [timeProgress])

    // console.log(progressBarRef.current.value)
    
    const handleProgressChange = () => {
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
            setTimeProgress(progressBarRef.current.value);
        }
        
    };

    // console.log(audioRef.current.state.progressMs)

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function msToMinAndSeconds(ms, track = false) {
        let minutes = Math.floor(ms / 60000);
        let seconds = ((ms % 60000) / 1000).toFixed(0);
        if (!track) {
            if (seconds === 60) {
                return `${padTo2Digits(minutes + 1)} : 00`
            } else {
                return `${padTo2Digits(minutes)} : ${padTo2Digits(seconds)}`;
            }
        } else {
            return seconds === 60 ? `${padTo2Digits(minutes + 1)}: 00` : `${padTo2Digits(minutes)} : ${padTo2Digits(seconds)}`;
        }
    }

    return ( 
        <div className={cx('track-progress', (!trackData && 'disable'))}>
            <span style={{textAlign: 'end'}} className={cx('track-duration')}>{trackData ? msToMinAndSeconds(timeProgress) : '-:--'}</span>
            <input type="range" 
                className={cx('progress-bar')} 
                ref={progressBarRef} 
                defaultValue="0"
                onChange={handleProgressChange}
                // step="any"
            />
            <span className={cx('track-duration')}>{trackData ? msToMinAndSeconds(duration) : '-:--'}</span>
        </div>    
    );
}

export default ProgressBar;