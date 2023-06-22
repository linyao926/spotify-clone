import { Routes, Route, Outlet } from 'react-router-dom';
import DefaultMainLayout from '~/components/Layouts/DefaultMainLayout';
import { SearchContent, SearchResultsContent } from '~/components/Layouts/Content';

function Search() {
    return (
        <>
            <Outlet />
        </>
    );
}

export default Search;
