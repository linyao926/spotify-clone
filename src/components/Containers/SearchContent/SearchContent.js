import { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import images from '~/assets/images';
import Segment from '../Segment';
import MainFooter from '~/components/Blocks/MainFooter';
import classNames from "classnames/bind";
import styles from "./SearchContent.module.scss";

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
              const result = [];
              const [data1, data2] =  await Promise.all([
                spotifyApi.getCategories({limit: 50, offset: 0}).then((data) => data)
                .catch((error) => console.log('Error', error)),
                spotifyApi.getCategories({limit: 50, offset: 50}).then((data) => data)
                .catch((error) => console.log('Error', error))
              ]);
              result.push(...data1.categories.items);
              result.push(...data2.categories.items);
              if (isMounted) {
                  setHasData(true);
                  // console.log(result)
                  setResultData(result);
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
          <Segment data={resultData} browse />
          <MainFooter />
      </div>
      )
      : <div className={cx('wrapper')}>
          <img src={images.logo} alt="Spotify logo" className={cx('logo-img')} />
        </div> 
    );
    
}

export default SearchContent;