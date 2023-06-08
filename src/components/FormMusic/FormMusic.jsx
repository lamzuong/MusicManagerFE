/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Context } from '~/context/Provider';
import { notify } from '~/global/functionGlobal';
import songsAPI from '~/services/songsAPI';
import styles from './FormMusic.module.scss';

import { faCircleMinus, faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { Button, FormFeedback, FormGroup, Input, Spinner } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateListSong } from '~/store/musicSlice';
import cloudinaryAPI from '~/services/cloudinaryAPI';

const cx = classNames.bind(styles);

function FormMusic(props) {
  const { edit, id, name, artists, image, genre, url, optionsArtist, optionsGenre, setModal, time1st = true } = props;
  const { dispatch, rerenderSongPage } = useContext(Context);
  const music = useSelector((state) => state.music);
  const dispatchRedux = useDispatch();
  const token = localStorage.getItem('token');

  const defaultValue = () => {
    let list = [];
    if (typeof artists !== 'undefined') {
      for (let artist of optionsArtist) {
        if (artists.includes(artist.value.id)) list.push(artist);
      }
    }
    return list;
  };

  const [invalidImage, setInvalidImage] = useState(false);
  const [invalidAudio, setInvalidAudio] = useState(false);

  const [songName, setSongName] = useState(name || '');
  const [songArtists, setSongArtists] = useState(defaultValue());
  const [songImage, setSongImage] = useState(image || null);
  const [songGenre, setSongGenre] = useState(genre || null);
  const [songFile, setSongFile] = useState(url);

  const [firstTime, setFirstTime] = useState(time1st);
  const [loading, setLoading] = useState(false);
  const [haveImage, setHaveImage] = useState(image || false);
  const [haveAudio, setHaveAudio] = useState(url || false);
  const [haveChange, setHaveChange] = useState(false);

  const checkValid = () => {
    return !(
      songName.length === 0 ||
      songArtists.length === 0 ||
      songGenre === null ||
      typeof songFile === 'undefined'
    );
  };
  const isEmpty = () => {
    return (
      songName.length === 0 &&
      songArtists.length === 0 &&
      songGenre === null &&
      (songImage === null || songImage === false) &&
      typeof songFile === 'undefined'
    );
  };

  const compareArtists = (oldArr, newArr) => {
    if (oldArr.length !== newArr.length) return false;
    oldArr.sort((a, b) => a.value.id - b.value.id);
    newArr.sort((a, b) => a.value.id - b.value.id);
    for (let i = 0; i < newArr.length; i++) {
      if (JSON.stringify(newArr[i]) !== JSON.stringify(oldArr[i])) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!checkValid()) {
      if (firstTime) setFirstTime(false);
      return;
    } else {
      try {
        const postImage = async () => {
          const res = await cloudinaryAPI.addAudio(songFile);

          let resImg = null;
          if (songImage !== null && typeof songImage !== 'undefined') {
            resImg = await cloudinaryAPI.addImage(songImage);
          }
          let listArtistId = [];
          for (const art of songArtists) {
            listArtistId.push(art.value.id);
          }
          const resAdd = await songsAPI.add(token, {
            name: songName,
            url: res?.data.url,
            image: songImage !== null ? resImg?.data.url : null,
            genreId: songGenre.value.id,
            artists: listArtistId,
            favorite: false,
          });
          if (music.favorite === false) {
            const action = updateListSong({ newSong: resAdd.data });
            dispatchRedux(action);
          }

          setLoading(false);
          dispatch({ type: 'RERENDER', payload: !rerenderSongPage });
          setModal(false);
          notify('Add success!');
        };
        setLoading(true);
        postImage();
      } catch (error) {
        alert('Failed to add song, error ', error);
      }
    }
  };

  useEffect(() => {
    if (
      songName !== name ||
      songFile !== url ||
      JSON.stringify(songGenre) !== JSON.stringify(genre) ||
      !compareArtists(defaultValue(), songArtists) ||
      songImage !== image
    ) {
      setHaveChange(true);
    } else {
      setHaveChange(false);
    }
  }, [songArtists, songFile, songGenre, songName, songImage]);

  const handleEdit = () => {
    if (!checkValid()) {
      if (firstTime) setFirstTime(false);
      return;
    } else {
      const postFile = async () => {
        let resAudio = null;
        let checkAudio = songFile !== url;
        if (checkAudio) {
          resAudio = await cloudinaryAPI.addAudio(songFile);
        }

        let resImg = null;
        let checkImage = songImage !== image;
        let checkImageEmpty = songImage === false || songImage === null;
        if (checkImage) {
          if (checkImageEmpty) {
          } else {
            resImg = await cloudinaryAPI.addImage(songImage);
          }
        }

        let listArtistId = [];
        for (const art of songArtists) {
          listArtistId.push(art.value.id);
        }
        await songsAPI.update(token, id, {
          name: songName,
          url: checkAudio ? resAudio?.data.url : songFile,
          image: checkImage ? (checkImageEmpty ? null : resImg?.data.url) : songImage,
          genreId: songGenre.value.id,
          artists: listArtistId,
          favorite: false,
        });

        setLoading(false);
        dispatch({ type: 'RERENDER' });
        setModal(false);
        notify('Update success!');
      };
      setLoading(true);
      postFile();
    }
  };

  const handleDeleteImage = () => {
    setSongImage(false);
    setHaveImage(false);
  };

  var blob = window.URL || window.webkitURL;
  const handleChangeImage = (e) => {
    var target = e.target || e.srcElement;
    if (target.value.length !== 0) {
      if (e.target.files[0].type.startsWith('image')) {
        setSongImage(e.target.files[0]);
        setHaveImage(blob.createObjectURL(e.target.files[0]));
        setInvalidImage(false);
      } else {
        e.target.value = null;
        setInvalidImage(true);
      }
    }
  };
  const handleChangeAudio = (e) => {
    var target = e.target || e.srcElement;
    if (target.value.length !== 0) {
      if (e.target.files[0].type.startsWith('audio')) {
        setSongFile(e.target.files[0]);
        setHaveAudio(blob.createObjectURL(e.target.files[0]));
        setInvalidAudio(false);
      } else {
        e.target.value = null;
        setInvalidAudio(true);
      }
    }
  };

  return (
    <div className={cx('modal-view')} onClick={(e) => e.stopPropagation()}>
      {/* Name */}
      <div className={cx('input-view')}>
        <div className={cx('label')}>Song name</div>
        <FormGroup className={cx('input')}>
          <Input
            value={songName}
            invalid={songName.length === 0 && !firstTime}
            onChange={(e) => setSongName(e.target.value)}
          />
          <FormFeedback>Please enter song name !!</FormFeedback>
        </FormGroup>
      </div>
      {/* Artist */}
      <div className={cx('input-view')}>
        <div className={cx('label')}>Artists</div>
        <div className={cx('input')}>
          <Select
            isMulti
            isClearable={false}
            defaultValue={defaultValue}
            options={optionsArtist}
            onChange={(choice) => setSongArtists(choice)}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: songArtists.length === 0 && !firstTime ? '#dc3545' : '#ced4da',
                boxShadow: 'none',

                '&:hover': {
                  border: '0.5px solid #ced4da',
                },
              }),
            }}
          />
          {songArtists.length === 0 && !firstTime && (
            <div className={cx('form-feedback')}>Please choose artists !!</div>
          )}
        </div>
      </div>
      {/* Genre */}
      <div className={cx('input-view')}>
        <div className={cx('label')}>Genre</div>
        <div className={cx('input')}>
          <Select
            value={songGenre}
            options={optionsGenre}
            onChange={(choice) => setSongGenre(choice)}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: songGenre === null && !firstTime ? '#dc3545' : '#ced4da',
                boxShadow: 'none',

                '&:hover': {
                  border: '0.5px solid #ced4da',
                },
              }),
            }}
          />
          {songGenre === null && !firstTime && <div className={cx('form-feedback')}>Please choose genre !!</div>}
        </div>
      </div>
      {/* Image */}
      <div className={cx('input-view')}>
        <div className={cx('label')}>Image</div>
        {haveImage ? (
          <div className={cx('view-image')}>
            <div>
              <img src={haveImage} className={cx('image')} />
              <div className={cx('icon-delete')} onClick={handleDeleteImage}>
                <FontAwesomeIcon icon={faCircleMinus} color="red" />
              </div>
            </div>
            <div className={cx('view-button-change')}>
              <input type="file" id="img" accept="image/*" onChange={handleChangeImage} />
              <label htmlFor="img" className={cx('button-change')}>
                <FontAwesomeIcon icon={faRotate} />
                <span className={cx('title-change')}>Choose Other Image</span>
              </label>
            </div>
          </div>
        ) : (
          <FormGroup className={cx('input')}>
            <Input type="file" accept="image/*" onChange={handleChangeImage} invalid={invalidImage} />
            <FormFeedback>Please choose the correct image file type</FormFeedback>
          </FormGroup>
        )}
      </div>
      {/* Audio */}
      <div className={cx('input-view-audio')}>
        <div className={cx('label')}>File Audio</div>
        <FormGroup className={cx('input')}>
          {haveAudio ? (
            <div className={cx('view-audio')}>
              <audio src={haveAudio} controls className={cx('audio')} />
              <input type="file" id="file" accept=".mp3" onChange={handleChangeAudio} />
              <label htmlFor="file" className={cx('icon-change')}>
                <FontAwesomeIcon icon={faRotate} color={'purple'} />
              </label>
            </div>
          ) : (
            <Input
              type="file"
              accept=".mp3"
              invalid={(typeof songFile === 'undefined' && !firstTime) || invalidAudio}
              onChange={handleChangeAudio}
            />
          )}

          <FormFeedback>
            {invalidAudio ? 'Please choose the correct audio file type' : 'Please choose file to upload !!'}
          </FormFeedback>
        </FormGroup>
      </div>
      {/* Spinner */}
      {loading && (
        <div className={cx('view-spinner')}>
          <Spinner color="primary" />
        </div>
      )}
      {/* Button */}
      <div className={cx('button-view')}>
        {edit ? (
          <Button color="success" className={cx('button')} disabled={!haveChange} onClick={handleEdit}>
            Save
          </Button>
        ) : (
          <Button color="primary" className={cx('button')} disabled={isEmpty()} onClick={handleSubmit}>
            Upload
          </Button>
        )}

        <Button color="danger" className={cx('button')} onClick={() => setModal(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default FormMusic;
