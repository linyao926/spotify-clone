import { useContext, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

function Search() {
    const { setBgHeaderColor, searchPageInputValue, typeSearch, setTypeSearch } = useContext(AppContext);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        if (searchPageInputValue.length > 0) {
            if (typeSearch.length > 0) {
                navigate(`/search/${searchPageInputValue}/${typeSearch}`);
            } else {
                navigate(`/search/${searchPageInputValue}`);
            }
        } else {
            navigate('/search');
            setTypeSearch('');
        }
    }, [searchPageInputValue]);

    useEffect(() => {
        if (typeSearch !== '' && !pathname.includes(typeSearch) && searchPageInputValue.length > 0) {
            setTypeSearch('');
            navigate(`/search/${searchPageInputValue}`);
        }
    }, [typeSearch, pathname]);

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
