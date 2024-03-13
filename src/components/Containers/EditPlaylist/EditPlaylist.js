import { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '~/context/AppContext';
import { Link, useParams, NavLink } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { DotsIcon, CardImgFallbackIcon, PersonIcon, CloseIcon, EditIcon, WarningIcon } from '~/assets/icons';
import ButtonPrimary from '~/components/Blocks/Buttons/ButtonPrimary';
import Notification from '~/components/Blocks/Notification';
import classNames from 'classnames/bind';
import styles from './EditPlaylist.module.scss';

const cx = classNames.bind(styles);

function EditPlaylist() {
    const {
        userData,
        myPlaylistsData, 
        setMyPlaylistsData,
        closeModal,
        setShowPlayingView,
        myPlaylistId,
    } = useContext(AppContext);

    const params = useParams();

    let index;

    myPlaylistId ? index = myPlaylistId - 1 : index = params.number - 1;
    let initialImg;
    if (myPlaylistsData[index].img?.name === undefined) {
        initialImg = '';
    } else {
        initialImg = myPlaylistsData[index].img;
    }

    const [showRemind, setShowRemind] = useState(false);
    const [showError, setShowError] = useState(true);
    const [showToggle, setShowToggle] = useState({
        error: false,
        remind: false,
    });
    const [namePlaylist, setNamePlaylist] = useState(myPlaylistsData[index].name);
    const [selectedImage, setSelectedImage] = useState(initialImg);
    const [description, setDescription] = useState(myPlaylistsData[index].description);

    const nameField = useRef(null);
    
    useEffect(() => {
        if (!showError && !showRemind) {
            setShowToggle({
                error: false,
                remind: false,
            });
        } 
    }, [showError, showRemind]);

    useEffect(() => {
        if (namePlaylist === '') {
            setShowError(true);
            setShowToggle({
                error: true,
                remind: false,
            });
        } else {
            setShowError(false);
            setShowToggle((prev) => ({
                ...prev,
                error: false,
            }));
        }
    }, [namePlaylist]);

    const handleGetNamePlaylist = (e) => {
        setNamePlaylist(e.target.value);
    };

    // console.log(myPlaylistsData[index].img.name === undefined)
    
    return ( 
        <div method="post" id="playlist-form" className={cx("wrapper")} onClick={e => {
            e.stopPropagation();
            closeModal();
        }}>
            <div className={cx("container")}  onClick={e => e.stopPropagation()}>
                <header className={cx("header")}>
                    <h3 className={cx("title")}>Edit details</h3>
                    <ButtonPrimary icon rounded active dark
                        onClick={() => closeModal()}
                    >
                        <AiOutlineClose />
                    </ButtonPrimary>
                </header>
                
                <div >
                    {showToggle.remind && <Notification 
                        text="Line breaks aren't supported in the description." 
                        handleClose={() => {
                            if (showError) {
                                setShowToggle({
                                    error: true,
                                    remind: false,
                                });
                            } else {
                                setShowToggle({
                                    error: false,
                                    remind: false,
                                });
                            }
                        }}
                        closeBtn
                    />}
                    {showToggle.error && <Notification 
                        warning
                        text="Playlist name is required." 
                    />}
                    <div className={cx("content")}>
                        <div className={cx("img-frame")}>
                            <ButtonPrimary icon rounded active className={cx('dots-wrapper')}>
                                <DotsIcon />
                            </ButtonPrimary>  
                            {selectedImage 
                                ? <img
                                    className={cx('img')}
                                    alt="not found"
                                    src={URL.createObjectURL(selectedImage)}
                                />
                                : <div className={cx('img-wrapper')}>
                                    <CardImgFallbackIcon />
                                </div>
                            }
                            <label for='choose-photo' className={cx('edit-wrapper')}>
                                <EditIcon />
                                <span>Choose Photo</span>
                                <input
                                    id='choose-photo'
                                    type="file"
                                    name="myImage"
                                    onChange={(event) => {
                                        const image = new Image(); 
                                        image.src = event.target.files[0]
                                        
                                        setSelectedImage(event.target.files[0]);
                                    }}
                                    style={{
                                        visibility: 'hidden',
                                    }}
                                />
                            </label>
                        </div>
                        <div className={cx("editing-frame")}>
                            <label for='playlist-name'>
                                <div className={cx("name-title")}>Name</div>
                                <input
                                    id='playlist-name'
                                    className={cx("name")}
                                    placeholder="Add a name"
                                    aria-label="Playlist name"
                                    type="text"
                                    name="playlist-name"
                                    defaultValue={namePlaylist}
                                    style={{
                                        borderBottom: showError && '2px solid #dc2033',
                                    }}
                                    ref={nameField}
                                    onChange={(e) => handleGetNamePlaylist(e)}
                                />
                            </label>
                            {/* <div className={cx("description")}></div> */}
                            <label for='description'>
                                <div className={cx("description-title")}>Description</div>
                                <textarea
                                    className={cx("description")}
                                    placeholder="Add an optional description"
                                    name="description"
                                    defaultValue=''
                                    maxlength='300'
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            setShowToggle({
                                                error: false,
                                                remind: true,
                                            });
                                        }
                                    }}
                                    onChange={(e) => setDescription(e.target.value)}
                                    style={{
                                        borderBottom: showToggle.remind && '2px solid #2b70c4',
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <ButtonPrimary className={cx("save-btn")}
                    onClick={(e) => {
                        if (showError) {
                            e.preventDefault();
                        } else {
                            let items = [...myPlaylistsData];
                            let item = {...items[index]};
                            item.name = namePlaylist;
                            item.img = selectedImage;
                            item.description = description;
                            items[index] = item;
                            setMyPlaylistsData(items);
                            closeModal();
                        }
                    }}
                >Save</ButtonPrimary>
            </div>
        </div>
    );
}

export default EditPlaylist;