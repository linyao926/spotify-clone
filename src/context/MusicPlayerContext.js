import { createContext, useState } from 'react';
import { functional } from './functional';

export const MusicPlayerContext = createContext();

export const MusicPlayerContextProvider = ({ children }) => {
    const [listAllTrackIds, setListAllTrackIds] = useState([]);

    const [trackNextFromIds, setTrackNextFromIds] = useState(null);
    const [trackData, setTrackData] = useState(null);
    const [duration, setDuration] = useState(0);
    const [timeProgress, setTimeProgress] = useState(0);

    const [uri, setUri] = useState(false);

    const [repeat, setRepeat] = useState(functional.getInitialCondition('CONTROL_CONDITION').repeat);
    const [repeatOne, setRepeatOne] = useState(functional.getInitialCondition('CONTROL_CONDITION')['repeat_one']);
    const [shuffle, setShuffle] = useState(functional.getInitialCondition('CONTROL_CONDITION').shuffle);
    const [clickNext, setClickNext] = useState(false);

    const [isSavedTrack, setIsSavedTrack] = useState(false);
    const [mute, setMute] = useState(functional.getInitialCondition('CONTROL_CONDITION').mute);
    const [volume, setVolume] = useState(
        functional.getInitialRelatedNumber('PROGRESS') ? functional.getInitialRelatedNumber('PROGRESS')['volume_value'] : 10,
    );
    const [bgColor, setBgColor] = useState('rgb(83, 83, 83)');
    const [colors, setColors] = useState(null);

    const [expand, setExpand] = useState(false);
    const [renderSubMenu, setRenderSubMenu] = useState(false);

    return (
        <MusicPlayerContext.Provider
            value={{
                listAllTrackIds, setListAllTrackIds,
                trackNextFromIds, setTrackNextFromIds,
                trackData, setTrackData,
                duration, setDuration,
                timeProgress, setTimeProgress,
                uri, setUri,
                repeat, setRepeat,
                repeatOne, setRepeatOne,
                shuffle, setShuffle,
                clickNext, setClickNext,
                isSavedTrack, setIsSavedTrack,
                mute, setMute,
                volume, setVolume,
                bgColor, setBgColor,
                colors, setColors,
                expand, setExpand,
                renderSubMenu, setRenderSubMenu
            }}
        >
            {children}
        </MusicPlayerContext.Provider>
    );
}