import { useContext, useEffect, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import ContentFrame from '~/components/Layouts/ContentFrame';
import ContentFooter from './ContentFooter';
import images from '~/assets/images';
import config from '~/config';
import classNames from "classnames/bind";
import styles from "./Content.module.scss";

const cx = classNames.bind(styles);

function HomeContent() {
    const { isLogin, fetchWebApi, tempUrl, popularAlbumsId, popularArtistsId, columnCount, typeData } = useContext(AppContext);
    const [resultData, setResultData] = useState({});
    const [hasData, setHasData] = useState(false);

    const urls = [
      tempUrl({
        ep: 'several', 
        ids: popularAlbumsId.toString(),  
        several: 'albums', 
      }), 
      tempUrl({
        ep: 'several', 
        ids: popularArtistsId.toString(),  
        several: 'artists', 
      })
      // ,
      // tempUrl({
      //   ep: 'browse', 
      //   limit: 5,  
      //   browse: 'new-releases', 
      // })
    ];

    useEffect(() => {
      let isMounted = true;
      const fetchData = async () => {
        try {
          const data = await Promise.all(urls.map(url => fetchWebApi(url, 'GET')));
          if (isMounted) {
            setHasData(true);
            for (let i of typeData) {
              let key = i + 's';
              for (let i = 0; i < data.length; i++) {
                  if (data[i][key]) {
                      setResultData((prev) => ({
                          ...prev,
                          [key]: data[i][key],
                      }));
                  }
              }
            }
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
            <ContentFrame normal data={resultData.albums} headerTitle='Popular Albums' />
            <ContentFrame normal data={resultData.artists} artist headerTitle='Popular Artists' />
            {/* <ContentFrame normal data={resultData.albums.items} headerTitle='New Releases' showAll />  */}
            <ContentFooter />
          </div>
        : <div className={cx('wrapper')}>
            <img src={images.logo} alt="Spotify logo" className={cx('logo-img')} />
          </div> 
      );
    }
}

export default HomeContent;