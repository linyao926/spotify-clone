import DefaultMainLayout from '~/components/Layouts/DefaultMainLayout';
import PlaylistContent from '~/components/Layouts/Content/PlaylistContent';

function Playlist() {
    return (
        <DefaultMainLayout 
            children={<PlaylistContent />} 
        />
    );
}

export default Playlist;