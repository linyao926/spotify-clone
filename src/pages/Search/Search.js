import { useContext, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

function Search() {
    const { setBgHeaderColor, inputValue, typeSearch, setTypeSearch } = useContext(AppContext);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        if (inputValue.length > 0) {
            if (typeSearch.length > 0) {
                navigate(`/search/${inputValue}/${typeSearch}`);
            } else {
                navigate(`/search/${inputValue}`);
            }
        } else {
            navigate('/search');
            setTypeSearch('');
        }
    }, [inputValue]);

    useEffect(() => {
        if (typeSearch !== '' && !pathname.includes(typeSearch) && inputValue.length > 0) {
            setTypeSearch('');
            navigate(`/search/${inputValue}`);
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
