import SpotifyPlayer from 'react-spotify-web-playback';
import { useContext } from 'react';
import { MusicPlayerContext } from '~/context/MusicPlayerContext';

function Player(props) {
    const {
        playerRef,
        token,
        playing,
    } = props;

    const {
        uri,
        volume,
    } = useContext(MusicPlayerContext);

    return ( 
        <SpotifyPlayer
            ref={playerRef}
            token={token}
            uris={uri}
            play={playing}
            persistDeviceSelection={true}
            initialVolume={volume}
        />
     );
}

export default Player;