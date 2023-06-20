import { useContext, useEffect, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import ContentFrame from '~/components/Layouts/ContentFrame';
import ContentFooter from './ContentFooter';
import images from '~/assets/images';
import config from '~/config';
import classNames from "classnames/bind";
import styles from "./Content.module.scss";

const cx = classNames.bind(styles);

function SearchContent() {
    const { isLogin, tempUrl, typeData, fetchWebApi, inputValue } = useContext(AppContext);
    const [resultData, setResultData] = useState([]);
    const [hasData, setHasData] = useState(false);

    const url = tempUrl({
        ep: 'browse', 
        limit: 50, 
        offset: 0,  
        browse: 'categories', 
    });

    useEffect(() => {
      let isMounted = true;
      const fetchData = async () => {
        try {
          const data = await fetchWebApi(url, 'GET');
          if (isMounted) {
            // setResultData(data);
            setHasData(true);
            setResultData(data);
          }
        } catch (error) { 
          console.log(error);
        }
      };
      fetchData();

      return () => (isMounted = false);
    }, []);

    if (hasData) {
      return ( 
        isLogin 
        ? <div className={cx('wrapper', 'logged')}>
            {/* <ContentFrame recentSearches /> */}
            <ContentFrame data={resultData.categories.items} browse />
            <ContentFooter />
          </div>
        : <div className={cx('wrapper')}>
            <img src={images.logo} alt="Spotify logo" className={cx('logo-img')} />
          </div> 
      );
    }
}

export default SearchContent;