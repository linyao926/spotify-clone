import { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import ContentFrame from '~/components/Layouts/ContentFrame';
import ContentFooter from './ContentFooter';
import images from '~/assets/images';
import classNames from "classnames/bind";
import styles from "./Content.module.scss";

const cx = classNames.bind(styles);

function SearchContent() {
    const { isLogin, spotifyApi, bgHeaderColor, setBgHeaderColor, } = useContext(AppContext);

    const [resultData, setResultData] = useState([]);
    const [hasData, setHasData] = useState(false);

    const ref = useRef(null);

    useEffect(() => {
      let isMounted = true;

      if (isLogin) {
          
          async function loadData () {
              const data =  await spotifyApi.getCategories({limit: 50})
              .then((data) => data)
              .catch((error) => console.log('Error', error));
              if (isMounted) {
                  setHasData(true);
                  setResultData(data);
              }
          }
          loadData();
      }
      
      return () => (isMounted = false);
    }, [isLogin]);

    useEffect(() => {
      setBgHeaderColor('#121212');
    }, []);
    
    return ( 
      isLogin 
      ? hasData && (
      <div className={cx('wrapper', 'logged')} 
        ref={ref}
      >
          <ContentFrame data={resultData.categories.items} browse />
          <ContentFooter />
      </div>
      )
      : <div className={cx('wrapper')}>
          <img src={images.logo} alt="Spotify logo" className={cx('logo-img')} />
        </div> 
    );
    
}

export default SearchContent;