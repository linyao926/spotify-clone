import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '~/context/AppContext';
import { useWindowSize } from 'react-use';
import Sidebar from "../Sidebar";
import HeaderHomePage from "../HeaderHomePage";
import PlayingView from '../PlayingView';
import ControlBar from '../ControlBar';
import Languages from '~/components/Languages';
import classNames from "classnames/bind";
import styles from "./DefaultMainLayout.module.scss";
import 'overlayscrollbars/overlayscrollbars.css';
import { 
  OverlayScrollbars, 
  ScrollbarsHidingPlugin, 
  SizeObserverPlugin, 
  ClickScrollPlugin 
} from 'overlayscrollbars';
import { Outlet } from 'react-router-dom';

const cx = classNames.bind(styles);

function DefaultMainLayout() {
    const { widthNavbar, renderRequireLogin, showModal, searchPage, isLogin, showPlayingView } = useContext(AppContext);
    const { width } = useWindowSize();

    const containerRef = useRef(null);

    OverlayScrollbars.plugin(ClickScrollPlugin);
    if (containerRef.current) {
        OverlayScrollbars({ 
            target: containerRef.current,
            elements: {
              viewport: containerRef.current,
            },
        }, 
        {
            overflow: {
              x: 'hidden',
            },
            scrollbars: {
                theme: 'os-theme-light',
                autoHide: 'move',
                clickScroll: true,
            },
        });

        containerRef.current.children[2].style.zIndex = '101';
    };

    useEffect(() => {
        const scrollbars = Array.from(document.getElementsByClassName('os-scrollbar-handle'));
        scrollbars.forEach(item => {
            item.style.width = '12px';
            item.style.borderRadius = '0';
        });
    });

    let containerWidth = showPlayingView ? (width - widthNavbar - 24 - 328) : (width - widthNavbar - 24);

    const left = widthNavbar + 8;
    
    const handleClick = (e) => {
        renderRequireLogin(e);       
    }

    return ( 
        <div className={cx('wrapper')} onClick={(e) => handleClick(e)}>
            <div>
                <Sidebar />
                <div className={cx('container', 'login')} 
                        style={{
                            left: `${left}px`, 
                            rigth: (showPlayingView ? '328px' : 0),
                            width: `${containerWidth}px`,
                        }}
                        ref={containerRef}
                >
                    
                    <HeaderHomePage headerWidth={containerWidth} />
                    <Outlet />
                    {showModal && <Languages />}
                </div>
                {showPlayingView && <PlayingView />}
            </div>
            <ControlBar />
        </div>
    );
}

export default DefaultMainLayout;