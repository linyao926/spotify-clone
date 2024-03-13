import SpotifyPlayer from 'react-spotify-web-playback';
import classNames from "classnames/bind";
import styles from "./MusicPlayer.module.scss";

const cx = classNames.bind(styles);

function Player(props) {
    const {
        playerRef,
        token,
        trackUri,
        playing,
        volume,
    } = props;

    return ( 
        <SpotifyPlayer
            ref={playerRef}
            token={token}
            uris={trackUri}
            play={playing}
            persistDeviceSelection={true}
            initialVolume={volume}
        />
     );
}

export default Player;