import { RowRightIcon } from '~/assets/icons/icons';
import SearchForm from '~/components/SearchForm';

const MY_PLAYLIST_CONTEXT_MENU = [
    {
        title: 'Add to queue',
        'handle-data-with-queue': 1,
    },
    {
        title: 'Edit details',
        'handle-edit-details': 1,
    },
    {
        title: 'Create playlist',
        border: 1,
        'handle-create-playlist': 1,
    },
    {
        title: 'Delete',
        'handle-delete-playlist': 1,
    },
];

const LIBRARY_MY_PLAYLIST_CONTEXT_MENU = [
    {
        title: 'Add to queue',
        'handle-data-with-queue': 1,
    },
    {
        title: 'Edit details',
        'handle-edit-details': 1,
    },
    {
        title: 'Create playlist',
        'handle-create-playlist': 1,
    },
    {
        title: 'Delete',
        border: 1,
        'handle-delete-playlist': 1,
    },
    {
        title: 'Pin playlist',
        'title-2': 'Unpin playlist',
        'handle-pin-item': 1,
    },
];

const LIBRARY_PLAYLIST_CONTEXT_MENU = [
    {
        title: 'Add to queue',
        'handle-data-with-queue': 1,
    },
    {
        title: 'Remove from Your Library',
        border: 1,
        'handle-playlist-library': 1,
    },
    {
        title: 'Create playlist',
        'handle-create-playlist': 1,
    },
    {
        title: 'Pin playlist',
        'title-2': 'Unpin playlist',
        'handle-pin-item': 1,
    },
];

const PLAYLIST_CONTEXT_MENU = [
    {
        title: 'Add to queue',
        'handle-data-with-queue': 1,
    },
    {
        title: 'Add to Your Library',
        'handle-playlist-library': 1,
    },
];

const ALBUM_CONTEXT_MENU = [
    {
        title: 'Add to queue',
        'handle-data-with-queue': 1,
    },
    {
        title: 'Go to artist',
        border: 1,
        to: '/artist',
    },
    {
        title: 'Add to Your Library',
        'handle-album-library': 1,
    },
    {
        title: 'Add to playlist',
        rightIcon: <RowRightIcon />,
        child: 1,
    },
];

const LIBRARY_ALBUM_CONTEXT_MENU = [
    {
        title: 'Add to queue',
        'handle-data-with-queue': 1,
    },
    { 
        title: 'Go to artist', 
        border: 1, to: '/artist' 
    },
    {
        title: 'Pin album',
        'title-2': 'Unpin album',
        'handle-pin-item': 1,
    },
    {
        title: 'Remove from Your Library',
        'handle-album-library': 1,
    },
    {
        title: 'Add to playlist',
        rightIcon: <RowRightIcon />,
        to: '',
    },
];

const ARTIST_CONTEXT_MENU = [
    {
        title: 'Follow',
        'handle-follow': 1,
    },
];

const LIBRARY_ARTIST_CONTEXT_MENU = [
    {
        title: 'Un Follow',
        'handle-follow': 1,
    },
    {
        title: 'Pin artist',
        'title-2': 'Unpin artist',
        'handle-pin-item': 1,
    },
];

const TRACK_CONTEXT_MENU = [
    {
        title: 'Add to queue',
        border: 1,
        'handle-data-with-queue': 1,
    },
    {
        title: 'Go to artist',
        to: '/artist',
    },
    {
        title: 'Go to album',
        border: 1,
        to: '/album',
        routed: 1,
    },
    {
        title: 'Save to Your Liked Songs',
        'handle-save': 1,
    },
    {
        title: 'Add to playlist',
        rightIcon: <RowRightIcon />,
        child: 1,
    },
];

const TRACK_LIKED_CONTEXT_MENU = [
    {
        title: 'Add to queue',
        border: 1,
        'handle-data-with-queue': 1,
    },
    {
        title: 'Go to artist',
        to: '/artist',
    },
    {
        title: 'Go to album',
        border: 1,
        to: '/album',
        routed: 1,
    },
    {
        title: 'Remove from your Liked Songs',
        'handle-remove-in-liked': 1,
    },
    {
        title: 'Add to playlist',
        rightIcon: <RowRightIcon />,
        child: 1,
    },
];

const TRACK_MY_PLAYLIST_CONTEXT_MENU = [
    {
        title: 'Add to queue',
        'handle-data-with-queue': 1,
    },
    {
        title: 'Remove from this playlist',
        border: 1,
        'handle-remove-track': 1,
    },
    {
        title: 'Go to artist',
        to: '/artist',
    },
    {
        title: 'Go to album',
        border: 1,
        to: '/album',
        routed: 1,
    },
    {
        title: 'Save to Your Liked Songs',
        'handle-save': 1,
    },
    {
        title: 'Add to playlist',
        rightIcon: <RowRightIcon />,
        child: 1,
    },
];

const TRACK_IN_QUEUE_CONTEXT_MENU = [
    {
        title: 'Add to queue',
        'handle-data-with-queue': 1,
    },
    {
        title: 'Remove from queue',
        border: 1,
        'handle-remove-from-queue': 1,
    },
    {
        title: 'Go to artist',
        to: '/artist',
    },
    {
        title: 'Go to album',
        border: 1,
        to: '/album',
        routed: 1,
    },
    {
        title: 'Save to Your Liked Songs',
        'handle-save': 1,
    },
    {
        title: 'Add to playlist',
        rightIcon: <RowRightIcon />,
        child: 1,
    },
];

export const contextMenu = {
    'my-playlist': MY_PLAYLIST_CONTEXT_MENU,
    'library-my-playlist': LIBRARY_MY_PLAYLIST_CONTEXT_MENU,
    'library-playlist': LIBRARY_PLAYLIST_CONTEXT_MENU,
    playlist: PLAYLIST_CONTEXT_MENU,
    album: ALBUM_CONTEXT_MENU,
    'library-album': LIBRARY_ALBUM_CONTEXT_MENU,
    artist: ARTIST_CONTEXT_MENU,
    'library-artist': LIBRARY_ARTIST_CONTEXT_MENU,
    track: TRACK_CONTEXT_MENU,
    'my-playlist-track': TRACK_MY_PLAYLIST_CONTEXT_MENU,
    'liked-songs': TRACK_LIKED_CONTEXT_MENU,
    'queue-track': TRACK_IN_QUEUE_CONTEXT_MENU,
};
