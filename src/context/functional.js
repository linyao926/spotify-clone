function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function msToMinAndSeconds(ms, track = false) {
    let minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(0);
    if (!track) {
        return seconds === 60
            ? `${padTo2Digits(minutes + 1)} min`
            : `${padTo2Digits(minutes)} min ${padTo2Digits(seconds)} sec`;
    } else {
        return seconds === 60 ? `${padTo2Digits(minutes + 1)}:00` : `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
    }
}

function convertMsToHM(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = seconds >= 30 ? minutes + 1 : minutes;
    minutes = minutes % 60;
    hours = hours % 24;

    return minutes !== 0 ? `${padTo2Digits(hours)} hr ${padTo2Digits(minutes)} min` : `${padTo2Digits(hours)} hr`;
}

const totalDuration = (arr) => {
    let total = 0;
    for (let val of arr) {
        total += val.duration_ms;
    }
    return total;
};

const reduceFontSize = (height) => {
    let size;
    const tallest = 110.390625;
    const tall = 82.796875;
    const medium = 55.1875;
    const point = medium * 2;
    if (!height) {
        size = 9.6;
    } else if (height >= point) {
        if (height % tallest === 0) {
            if (height === tallest) {
                size = 9.6;
            } else {
                size = 7.2;
            }
        } else if (height % tall === 0) {
            size = 4.8;
        } else if (height % medium === 0) {
            size = 3.2;
        }
    } else if (height === tall) {
        size = 7.2;
    } else if (height === medium) {
        size = 4.8;
    } else {
        size = 3.2;
    }
    return size;
};

function removeDuplicates(array, type = 'string', key = null) {
    let unique;
    if (type !== 'object') {
        unique = array.filter((value, index, arr) => {
            return arr.indexOf(value) === index;
        });
    } else {
        unique = [...new Map(array.map((item) => [item[key], item])).values()];
    }
    return unique;
}

function sortLibrary(a, b) {
    return a.localeCompare(b);
}

function createPlaylist(setFunc, state) {
    setFunc((prev) => [
        ...prev,
        {
            id: state.length + 1,
            name: `My Playlist #${state.length + 1}`,
        },
    ]);
}

function getData(method, id, option = null) {
    if (option) {
        return method(id, option)
            .then((data) => data)
            .catch((error) => console.log('Error', error));
    } else {
        return method(id)
            .then((data) => data)
            .catch((error) => console.log('Error', error));
    }
}

function checkTrackInLiked(likedList, trackId, setFunc) {
    if (trackId) {
        // console.log(savedTracks)
        if (likedList && likedList.length > 0) {
            let temp = likedList.includes(trackId);

            if (temp) {
                setFunc(true);
            } else {
                setFunc(false);
            }
        } else if (!likedList || likedList.length === 0) {
            setFunc(false);
        }
    }
}

const handleRemoveData = (data, index = null, setDataFunc, toId) => {
    let items = [...data];
    let temp;

    if (index !== null) {
        temp = [...items[index].tracks];
    } else {
        temp = [...items];
    }

    const i = temp.findIndex((id) => id === toId);

    if (i > -1) {
        temp.splice(i, 1);
    }

    if (index !== null) {
        items[index].tracks = removeDuplicates(temp);
    } else {
        items = [...temp];
    }

    setDataFunc(items);
};

const handleSaveTrack = (data, id) => {
    const result = [];
    if (data) {
        result.push(...data);
    }
    result.push(id);
    return removeDuplicates(result);
};

function getInitialList(key) {
    const result = localStorage.getItem(key);
    // console.log(JSON.parse(result))
    return result ? JSON.parse(result) : [];
};

function getInitialCondition (key) {
    const result = localStorage.getItem(key);
    return result ? JSON.parse(result) : false;
};

function getInitialOther (key) {
    const result = localStorage.getItem(key);
    return result ? JSON.parse(result) : null;
};

function getInitialRelatedNumber (key) {
    const result = localStorage.getItem(key);
    return result ? JSON.parse(result) : null;
};

export const functional = {
    padTo2Digits,
    msToMinAndSeconds,
    convertMsToHM,
    totalDuration,
    reduceFontSize,
    removeDuplicates,
    sortLibrary,
    createPlaylist,
    getData,
    checkTrackInLiked,
    handleRemoveData,
    handleSaveTrack,
    getInitialList,
    getInitialCondition,
    getInitialOther,
    getInitialRelatedNumber,
};
