import { useContext, useEffect, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import ContentFrame from '~/components/Layouts/ContentFrame';
import ContentFooter from './ContentFooter';
import CardItem from '../CardItem/CardItem';
import Button from '~/components/Button';
import config from '~/config';
import classNames from "classnames/bind";
import styles from "./Content.module.scss";

const cx = classNames.bind(styles);

function SearchResultsContent() {
    const { tempUrl, inputValue, typeData, fetchWebApi, columnCount } = useContext(AppContext);
    const [resultData, setResultData] = useState([]);
    const [hasData, setHasData] = useState(false);
    const [url, setUrl] = useState(null);

    console.log()

    useEffect(() => {
      let isMounted = true;
      
      const fetchData = async () => {
        try {
          const data = await Promise.all(
            typeData.map(value => {
              let url = tempUrl({
                ep: 'search', 
                limit: columnCount, 
                offset: 0,  
                q: 'gnz', 
                type: value,
              })
              return fetchWebApi(url, 'GET');
            })
          );
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
    }, [typeData, columnCount]);
    
    if (hasData) {
      return ( 
        <div className={cx('wrapper', 'logged')}>
            <div className={cx('result-top-content')}>
              <ContentFrame data={resultData.playlists.items[0]} searchAll headerTitle='Top result' />
              <ContentFrame data={resultData.tracks.items} songs searchAll headerTitle='Songs' />
            </div>
            <ContentFrame normal data={resultData.artists.items} artist headerTitle='Artists' />
            <ContentFrame normal data={resultData.albums.items} headerTitle='Albums' />
            <ContentFrame normal data={resultData.playlists.items} headerTitle='Playlists' />
            {/* <ContentFrame headerTitle='Profiles' /> */}
            <ContentFooter />
        </div>
      );
    }
    
}

export default SearchResultsContent;