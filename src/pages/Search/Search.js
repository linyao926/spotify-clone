import { useContext, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Outlet, useNavigate } from 'react-router-dom';

function Search() {
    const { setBgHeaderColor, searchPageInputValue, typeSearch, setTypeSearch } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        navigate(`${searchPageInputValue}`, { relative: "path", replace: true });
    }, [searchPageInputValue, typeSearch]);

    // useEffect(() => {
    //     if (typeSearch !== '' && !pathname.includes(typeSearch) && searchPageInputValue.length > 0) {
    //         setTypeSearch('');
    //         navigate(`/search/${searchPageInputValue}`);
    //     }
    // }, [typeSearch, pathname]);

    useEffect(() => {
        return setBgHeaderColor('#121212');
    }, []);

    return (
        <>
            <Outlet />
        </>
    );
}

export default Search;
