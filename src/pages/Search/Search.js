import DefaultMainLayout from '~/components/Layouts/DefaultMainLayout';
import { SearchContent, SearchResultsContent } from '~/components/Layouts/Content';

function Search() {
    return (
        <DefaultMainLayout 
            children={<SearchResultsContent />}
        />   
    );
}

export default Search;
