import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import classNames from 'classnames/bind';
import styles from './PageTurnBtn.module.scss';

const cx = classNames.bind(styles);

function PageTurnBtn(props) {
    const {pages, setOffset, currentPage, setCurrentPage, handlePath} = props;
    
    const [displayedPages, setDisplayedPages] = useState([]);
    const maxDisplayedPages = 7;

    useEffect (() => {
        const firstDisplayedPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
        const lastDisplayedPage = Math.min(pages, firstDisplayedPage + maxDisplayedPages - 1);
        setDisplayedPages(Array.from(
            { length: lastDisplayedPage - firstDisplayedPage + 1 },
            (_, index) => index + firstDisplayedPage
        ));
    }, [currentPage, pages]);

    // console.log(currentPage)

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
                    <NavLink 
                        className={cx('page-btn')}
                        onClick={() => {
                            setOffset(0)
                            setCurrentPage(1)
                        }}
                        to={handlePath ? handlePath(1) : ''}
                        end
                    >
                        1
                    </NavLink>
                    <span className={cx('etc')}>...</span>
                </>
            }
            {displayedPages.map(page => (
                <NavLink key={page}
                    className={({isActive}) => cx('page-btn', isActive && 'active')}
                    onClick={(event) => {
                        if (currentPage === page) {
                            event.preventDefault();
                        } else {
                            setOffset((page - 1) * 30)
                            setCurrentPage(page)
                        }
                    }}
                    to={handlePath ? handlePath(page) : (page > 1 ? `page=${page}` : ``)}
                    end
                >
                    {page}
                </NavLink>
            ))}
            {currentPage < pages - 4 && pages > 7 && 
                <>
                    <span className={cx('etc')}>...</span>
                    <NavLink 
                        className={cx('page-btn')}
                        onClick={() => {
                            setOffset(pages - 1)
                            setCurrentPage(pages)
                        }}
                        to={handlePath ? handlePath(pages) : `page=${pages}`}
                        end
                    >
                        {pages}
                    </NavLink>
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