export const authEndpoint = 'https://accounts.spotify.com/authorize';
const redirectUri = "http://localhost:3000/";
const CLIENT_ID ='6947731b9d004c58b00f2e321935abae';
const CLIENT_SECRET= '339c0c9a6292441a923469484fcae464';

const scopes = [
    'streaming',
    'user-top-read',
    'user-follow-read',
    'user-follow-modify',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-read-playback-position',
    'playlist-read-collaborative',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-email',
    'user-read-private',
];


export const getTokenFromUrl = () => {
    return window.location.hash
        .substring(1)
        .split('&')
        .reduce((initial, item) => {
            let parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);

            return initial;
        }, {});
};

export const loginUrl = `${authEndpoint}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=code&show_dialog=true`;

