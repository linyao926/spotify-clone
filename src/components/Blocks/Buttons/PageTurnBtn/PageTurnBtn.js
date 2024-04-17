import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import classNames from 'classnames/bind';
import styles from './PageTurnBtn.module.scss';

const cx = classNames.bind(styles);

function PageTurnBtn(props) {
    const {pages, setOffset, currentPage, setCurrentPage, handlePath} = props;
    
    const [displayedPages, setDisplayedPages] = useState([]);
    const maxDisplayedPages = 7;

    const { pathname } = useLocation();

    useEffect (() => {
        const firstDisplayedPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
        const lastDisplayedPage = Math.min(pages, firstDisplayedPage + maxDisplayedPages - 1);
        setDisplayedPages(Array.from(
            { length: lastDisplayedPage - firstDisplayedPage + 1 },
            (_, index) => index + firstDisplayedPage
        ));
    }, [currentPage, pages]);
    
    const checkActive = (number) => {
        if (number === 1) {
            return !pathname.includes('page');
        } else {
            return pathname.includes(`page=${number}`)
        }
    }

    return ( 
        <div className={cx('pages')}>
            {currentPage > 1 && 
                <Link
                    className={cx('page-btn')}
                    onClick={() => {
                        setOffset((currentPage - 2) * 30)
                        setCurrentPage(currentPage - 1)
                    }}
                    to={handlePath ? handlePath(currentPage - 1) : (currentPage - 1 > 1 ? `page=${currentPage - 1}` : ``)}
                >
                    <AiOutlineLeft />
                </Link>
            }
            {currentPage > 5 &&
                <>
                    <Link 
                        className={cx('page-btn', checkActive(1) && 'active')}
                        onClick={() => {
                            setOffset(0)
                            setCurrentPage(1)
                        }}
                        to={handlePath ? handlePath(1) : ''}
                    >
                        1
                    </Link>
                    <span className={cx('etc')}>...</span>
                </>
            }
            {displayedPages.map(page => (
                <Link key={page}
                    className={cx('page-btn', checkActive(page) && 'active')}
                    onClick={(event) => {
                        if (currentPage === page) {
                            event.preventDefault();
                        } else {
                            setOffset((page - 1) * 30)
                            setCurrentPage(page)
                        }
                    }}
                    to={handlePath ? handlePath(page) : (page > 1 ? `page=${page}` : ``)}
                >
                    {page}
                </Link>
            ))}
            {currentPage < pages - 4 && pages > 7 && 
                <>
                    <span className={cx('etc')}>...</span>
                    <Link 
                        className={cx('page-btn', checkActive(pages - 1) && 'active')}
                        onClick={() => {
                            setOffset(pages - 1)
                            setCurrentPage(pages)
                        }}
                        to={handlePath ? handlePath(pages) : `page=${pages}`}
                    >
                        {pages}
                    </Link>
                </>
            }
            {currentPage < pages && 
                <Link
                    className={cx('page-btn')}
                    onClick={() => {
                        setOffset((currentPage) * 30)
                        setCurrentPage(currentPage + 1)
                    }}
                    to={handlePath ? handlePath(currentPage + 1) : `page=${currentPage + 1}`}
                >
                    <AiOutlineRight />
                </Link>
            }
        </div>
    );
}

export default PageTurnBtn;