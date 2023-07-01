import { useContext, useEffect } from 'react';
import { AppContext } from '~/context/AppContext';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

function Search() {
    const { setBgHeaderColor, inputValue, typeSearch, setTypeSearch } = useContext(AppContext);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        if (inputValue.length > 0) {
            navigate(`/search/${inputValue}`);
        }
    }, [inputValue]);

    useEffect(() => {
        if (typeSearch !== '' && !pathname.includes(typeSearch)) {
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
