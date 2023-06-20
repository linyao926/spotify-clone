import DefaultMainLayout from '~/components/Layouts/DefaultMainLayout';
import { HomeContent } from '~/components/Layouts/Content';

function Home() {
    return (
        <DefaultMainLayout children={<HomeContent />} />
    );
}

export default Home;
