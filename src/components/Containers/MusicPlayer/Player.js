import SpotifyPlayer from 'react-spotify-web-playback';

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