import DefaultMainLayout from '~/components/Layouts/DefaultMainLayout';
import ArtistContent from '~/components/Layouts/Content/ArtistContent';

function Artist() {
    return (
        <DefaultMainLayout 
            children={<ArtistContent />} 
        />
    );
}

export default Artist;