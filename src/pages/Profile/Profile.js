import DefaultMainLayout from '~/components/Layouts/DefaultMainLayout';
import ProfileContent from '~/components/Layouts/Content/ProfileContent';

function Profile() {
    return (
        <DefaultMainLayout 
                children={<ProfileContent />} 
        />
    );
}

export default Profile;