import DefaultMainLayout from '~/components/Layouts/DefaultMainLayout';
import AlbumContent from '~/components/Layouts/Content/AlbumContent';

function Album() {
    return (
        <DefaultMainLayout 
            children={<AlbumContent />} 
        />
    );
}

export default Album;