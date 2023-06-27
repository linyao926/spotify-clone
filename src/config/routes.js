import { loginUrl } from "~/apis/spotify";

// const hash = window.location.hash;

const routes = {
    home: `/`,
    search: `/search`,
    album: `/album/:albumId/`,
    playlist: `/playlist/:playlistId/`,
    track: `/track/:trackId/`,
    artist: `/artist/:artistId/`,
    profile: `/user/:userId/`,
    download: `/download`,
    settings: 'preferences',
    login: loginUrl,
};

export default routes;