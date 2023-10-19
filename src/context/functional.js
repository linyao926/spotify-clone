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
    if (a && b) {
        return a.localeCompare(b);
    }
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

function checkItemLiked(likedList, id, setFunc) {
    if (id) {
        if (likedList && likedList.length > 0) {
            let temp = likedList.filter((e) => e.id === id).length > 0;

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

    const i = temp.findIndex((item) => item.id === toId);

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

const handleSaveItemToList = (data, id, date, setDataFunc = false) => {
    const result = [];
    if (data) {
        result.push(...data);
    }
    result.push({ id: id, date_added: date });
    return setDataFunc ? setDataFunc(removeDuplicates(result)) : removeDuplicates(result);
};

function getInitialList(key) {
    const result = localStorage.getItem(key);
    // console.log(JSON.parse(result))
    return result ? JSON.parse(result) : [];
}

function getInitialCondition(key) {
    const result = localStorage.getItem(key);
    return result ? JSON.parse(result) : false;
}

function getInitialOther(key) {
    const result = localStorage.getItem(key);
    return result ? JSON.parse(result) : null;
}

function getInitialRelatedNumber(key) {
    const result = localStorage.getItem(key);
    return result ? JSON.parse(result) : null;
}

const isOverflown = ({ clientWidth, clientHeight, scrollWidth, scrollHeight }) =>
    scrollWidth > clientWidth || scrollHeight > clientHeight;

const resizeText = ({ element, elements, minSize = 10, maxSize = 512, step = 1, unit = 'px' }) => {
    (elements || [element]).forEach((el) => {
        let i = minSize;
        let overflow = false;

        const parent = el.parentNode;

        while (!overflow && i < maxSize) {
            el.style.fontSize = `${i}${unit}`;
            overflow = isOverflown(parent);

            if (!overflow) {
                // console.log(i * 2 * 10, el.clientHeight)
                if (i > minSize && i * 2 * 10 == el.clientHeight) {
                    overflow = true;
                } else {
                    i += step;
                }
            }
        }

        if (i - step <= minSize) {
            el.style.fontSize = `${minSize}${unit}`;
            parent.style.overflow = 'hidden';
            parent.style.maxHeight = `calc(${minSize * 3}rem + 0.3em)`;
        } else {
            el.style.fontSize = `${i - step}${unit}`;
        }
    });
};

const getSearchTopResult = (track, artist, album, playlist, searchValue) => {
    const array = [];

    if (track && track.name === searchValue) {
        array.push(track);
    }

    if (artist && artist.name === searchValue) {
        array.push(artist);
    }

    if (album && album.name === searchValue) {
        array.push(album);
    }

    if (playlist && playlist.name === searchValue) {
        array.push(playlist);
    }

    if (array.length === 0) {
        if (track && artist) {
            if (track.popularity > artist.popularity) {
                return track;
            } else {
                return artist;
            }
        } 
    } else {
        if (array.length === 1) {
            return array[0];
        } else {
            const result = array.filter(item => item.popularity);
            if (result.length === 0) {
                return array[0];
            } else {
                if (result.length === 1) {
                    return result[0];
                } else {
                    if (result[0].popularity > result[1].popularity) {
                        return result[0];
                    } else {
                        return result[1];
                    }
                }
            }
        }
    }
}

export const functional = {
    padTo2Digits,
    msToMinAndSeconds,
    convertMsToHM,
    totalDuration,
    removeDuplicates,
    sortLibrary,
    createPlaylist,
    checkItemLiked,
    handleRemoveData,
    handleSaveItemToList,
    getInitialList,
    getInitialCondition,
    getInitialOther,
    getInitialRelatedNumber,
    resizeText,
    getSearchTopResult,
};
