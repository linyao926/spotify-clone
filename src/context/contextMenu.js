import { RowRightIcon, PinIcon, EditIcon, AddIcon, MinusIcon, MusicNotesIcon, TickIcon, ArtistIcon, FollowIcon, UnfollowIcon, AlbumFallbackIcon, TrashIcon, AddToQueueIcon, FillPinIcon } from '~/assets/icons/icons';
import { HiPlus } from 'react-icons/hi';

const addToQueue = {
    title: 'Add to queue',
    'handle-data-with-queue': 1,
    lefticon: <AddToQueueIcon />,
}

const addToLibrary = {
    title: 'Add to Your Library',
    lefticon: <AddIcon />,
}

const addToPlaylist = {
    title: 'Add to playlist',
    lefticon: <HiPlus />,
    rightIcon: <RowRightIcon />,
    child: 1,
}

const savedLikedSongs = {
    title: 'Save to Your Liked Songs',
    'handle-save': 1,
    lefticon: <AddIcon />,
}

const editDetails = {
    title: 'Edit details',
    'handle-edit-details': 1,
    lefticon: <EditIcon />,
}

const createPlaylist = {
    title: 'Create playlist',
    'handle-create-playlist': 1,
    lefticon: <MusicNotesIcon />,
}

const deleteItem = {
    title: 'Delete',
    'handle-delete-playlist': 1,
    lefticon: <MinusIcon />,
}

const pinItem = {
    title: 'Pin playlist',
    'title-2': 'Unpin playlist',
    'handle-pin-item': 1,
    lefticon: <PinIcon />,
}

// console.log(pinItem)

const removeFromLibrary = {
    title: 'Remove from Your Library',
    lefticon: <TickIcon />,
    lIconActive: true,
}

const removeFromQueue = {
    title: 'Remove from queue',
    'handle-remove-from-queue': 1,
    lefticon: <TrashIcon />,
    lIconActive: true,
}

const removeFromPlaylist = {
    title: 'Remove from this playlist',
    'handle-remove-track': 1,
    lefticon: <TrashIcon />,
    lIconActive: true,
}

const removeFromLikedSongs = {
    title: 'Remove from your Liked Songs',
    'handle-remove-in-liked': 1,
    lefticon: <TickIcon />,
    lIconActive: true,
}

const goToArtist = {
    title: 'Go to artist',
    to: '/artist',
    lefticon: <ArtistIcon />,
}

const goToAlbum = {
    title: 'Go to album',
    to: '/album',
    routed: 1,
    lefticon: <AlbumFallbackIcon />,
}

const follow = {
    title: 'Follow',
    action: 'follow',
    lefticon: <FollowIcon />,
}

const unfollow = {
    title: 'Unfollow',
    action: 'unfollow',
    lefticon: <UnfollowIcon />,
    lIconActive: true,
}

const MY_PLAYLIST_CONTEXT_MENU = [
    {
        ...addToQueue,
        border: 1
    },
    editDetails,
    {
        ...deleteItem,
        border: 1
    },
    createPlaylist,
];

const LIBRARY_MY_PLAYLIST_CONTEXT_MENU = [
    ...MY_PLAYLIST_CONTEXT_MENU,
    pinItem,
];

const PLAYLIST_CONTEXT_MENU = [
    addToQueue,
    {
        ...addToLibrary,
        action : 'handle-playlist-library',
    },
];

const LIBRARY_PLAYLIST_CONTEXT_MENU = [
    {
        ...addToQueue,
        border: 1
    },
    {
        ...removeFromLibrary,
        action : 'handle-playlist-library',
    },
    createPlaylist,
    pinItem,
];

const ALBUM_CONTEXT_MENU = [
    addToPlaylist,
    {
        ...addToLibrary,
        action : 'handle-album-library',
    },
    {
        ...addToQueue,
        border: 1
    },
    goToArtist,
];

const LIBRARY_ALBUM_CONTEXT_MENU = [
    addToPlaylist,
    {
        ...removeFromLibrary,
        action : 'handle-album-library',
    },
    {
        ...addToQueue,
        border: 1
    },
    goToArtist,
    {
        ...pinItem,
        title: 'Pin album',
        'title-2': 'Unpin album',
    },
];

const ARTIST_CONTEXT_MENU = [
    follow,
];

const LIBRARY_ARTIST_CONTEXT_MENU = [
    unfollow,
    {
        ...pinItem,
        title: 'Pin artist',
        'title-2': 'Unpin artist',
    },
];

const TRACK_CONTEXT_MENU = [
    addToPlaylist,
    savedLikedSongs,
    {
        ...addToQueue,
        border: 1
    },
    goToArtist,
    goToAlbum,
];

const TRACK_LIKED_CONTEXT_MENU = [
    addToPlaylist,
    removeFromLikedSongs,
    {
        ...addToQueue,
        border: 1
    },
    goToArtist,
    goToAlbum,
];

const TRACK_MY_PLAYLIST_CONTEXT_MENU = [
    addToPlaylist,
    removeFromPlaylist,
    savedLikedSongs,
    {
        ...addToQueue,
        border: 1
    },
    goToArtist,
    goToAlbum,
];

const TRACK_IN_QUEUE_CONTEXT_MENU = [
    addToPlaylist,
    savedLikedSongs,
    addToQueue,
    {
        ...removeFromQueue, 
        border: 1
    },
    goToArtist,
    goToAlbum,
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
