/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import styles from './ModalPlaylists.module.scss';
import playlistsAPI from '~/services/playlistsAPI';
import { updateListSong } from '~/store/musicSlice';
import { mp3Link, notify } from '~/global/functionGlobal';

import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function ModalPlaylists({ song, showPlaylists, showFormAdd }) {
  const music = useSelector((state) => state.music);
  const dispatchRedux = useDispatch();
  const token = localStorage.getItem('token');

  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    const getAllPlaylists = async () => {
      try {
        const res = await playlistsAPI.getAllByUserId(token);
        setPlaylists(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllPlaylists();
  }, []);
  const handleAddSong = async (playlists) => {
    await playlistsAPI.addSongToPlaylist(token, playlists.id, [song.id]);
    showPlaylists(false);

    if (music.playlist === playlists.id) {
      const action = updateListSong({ newSong: song });
      dispatchRedux(action);
    }

    notify('Add to playlists success');
  };

  return (
    <div className={cx('wrapper')}>
      {/* items */}
      <div className={cx('item')} onClick={() => showFormAdd(true)}>
        <div className={cx('icon')}>
          <FontAwesomeIcon icon={faPlusCircle} />
        </div>
        <div className={cx('title')}>New playlists</div>
      </div>
      {playlists.map((e, i) => (
        <div className={cx('item')} onClick={() => handleAddSong(e)} key={i}>
          <img src={e.avatar || mp3Link} className={cx('image')} />
          <div className={cx('name')}>{e.name}</div>
        </div>
      ))}
    </div>
  );
}

export default ModalPlaylists;
