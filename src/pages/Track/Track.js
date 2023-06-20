import DefaultMainLayout from '~/components/Layouts/DefaultMainLayout';
import TrackContent from '~/components/Layouts/Content/TrackContent';

function Track() {
    return (
        <DefaultMainLayout 
            children={<TrackContent />} 
        />
    );
}

export default Track;