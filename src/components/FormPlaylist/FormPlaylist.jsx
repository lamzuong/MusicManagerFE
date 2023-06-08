/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import styles from './FormPlaylist.module.scss';

import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Button, FormFeedback, FormGroup, Input, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleMinus, faRotate } from '@fortawesome/free-solid-svg-icons';
import playlistsAPI from '~/services/playlistsAPI';
import { notify } from '~/global/functionGlobal';
import { Context } from '~/context/Provider';
import cloudinaryAPI from '~/services/cloudinaryAPI';

const cx = classNames.bind(styles);

function FormPlaylist(props) {
  const { edit, song = null, item, setModal, showPlaylists } = props;
  const token = localStorage.getItem('token');

  const { dispatch } = useContext(Context);
  const [playlistName, setPlaylistName] = useState(item?.name || '');
  const [playlistImage, setPlaylistImage] = useState(item?.image || null);
  const [haveImage, setHaveImage] = useState(item?.image || false);
  const [invalidImage, setInvalidImage] = useState(false);
  const [haveChange, setHaveChange] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (playlistName !== item?.name || playlistImage !== item.image) {
      setHaveChange(true);
    } else setHaveChange(false);
  }, [playlistName, playlistImage]);

  var blob = window.URL || window.webkitURL;
  const handleChangeImage = (e) => {
    var target = e.target || e.srcElement;
    if (target.value.length !== 0) {
      if (e.target.files[0].type.startsWith('image')) {
        setPlaylistImage(e.target.files[0]);
        setHaveImage(blob.createObjectURL(e.target.files[0]));
        setInvalidImage(false);
      } else {
        e.target.value = null;
        setInvalidImage(true);
      }
    }
  };
  const handleDeleteImage = () => {
    setPlaylistImage(false);
    setHaveImage(false);
  };
  const handleSubmit = async () => {
    setLoading(true);

    let resImg = null;
    if (haveImage) {
      resImg = await cloudinaryAPI.addImage(playlistImage);
    }
    let resAdd = await playlistsAPI.add(token, {
      name: playlistName,
      avatar: playlistImage !== null ? resImg?.data.url : null,
    });
    notify('Add new playlists success!');

    // add song to playlists
    if (song !== null) {
      await playlistsAPI.addSongToPlaylist(token, resAdd.data.id, [song.id]);
      showPlaylists(false);
      notify('Add song to playlists success');
    }

    setModal(false);
    dispatch({ type: 'RERENDER' });
    setLoading(false);
  };
  const handleEdit = async () => {
    setLoading(true);

    let resImg = null;
    let changeImg = playlistImage !== item?.image;
    if (changeImg && haveImage) {
      resImg = await cloudinaryAPI.addImage(playlistImage);
    }
    await playlistsAPI.update(token, item?.id, {
      name: playlistName,
      avatar: changeImg ? (haveImage !== false ? resImg?.data.url : null) : item?.image,
    });
    notify('Update playlists success!');
    setModal(false);
    dispatch({ type: 'RERENDER' });

    setLoading(false);
  };
  const isEmpty = () => {
    if (playlistName === '') return true;
    return false;
  };
  return (
    <div className={cx('modal-view')}>
      <h2 style={{ marginBottom: 20 }}>New Playlists</h2>
      {/* Name */}
      <div className={cx('input-view')}>
        <div className={cx('label')}>Name</div>
        <FormGroup className={cx('input')}>
          <Input value={playlistName} maxLength={20} onChange={(e) => setPlaylistName(e.target.value)} />
        </FormGroup>
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
      {/* Spinner */}
      {loading && (
        <div className={cx('view-spinner')}>
          <Spinner color="primary" />
        </div>
      )}
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

export default FormPlaylist;
