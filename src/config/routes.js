import { loginUrl } from "~/apis/spotify";

const hash = window.location.hash;

const routes = {
    home: hash !== '' ? `/${hash}` : '/',
    search: hash !== '' ? `/search/${hash}` : '/search',
    album: '/album',
    playlist: '/playlist',
    track: '/track',
    artist: '/artist',
    profile: '/user',
    download: '/download',
    login: loginUrl,
};

export default routes;