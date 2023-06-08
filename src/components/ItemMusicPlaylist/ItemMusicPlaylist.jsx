/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Context } from '~/context/Provider';
import { mp3Link } from '~/global/functionGlobal';
import { playMusic } from '~/store/musicSlice';
import Confirm from '../Confirm/Confirm';
import styles from './ItemMusicPlaylist.module.scss';
import playlistsAPI from '~/services/playlistsAPI';

import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Modal } from 'reactstrap';

const cx = classNames.bind(styles);

function ItemMusicPlaylist({ item, index, playlistId }) {
  const { dispatch, listRemovePL } = useContext(Context);
  const dispatchRedux = useDispatch();
  const music = useSelector((state) => state.music);
  const token = localStorage.getItem('token');

  const [song, setSong] = useState(item);
  const [songGenre, setSongGenre] = useState([]);

  const [modalConfirm, setModalConfirm] = useState(false);
  const showConfirm = () => setModalConfirm(!modalConfirm);

  useEffect(() => {
    const getSongs = async () => {
      try {
        let nameArtistShow = '';
        for (const artist of song.artists) {
          nameArtistShow += artist.name + ', ';
        }
        setSong({ ...item, artist: nameArtistShow.slice(0, nameArtistShow.length - 2) });
        setSongGenre({ value: item.genre, label: item.genre.name });
      } catch (error) {
        console.log('Failed to fetch songs list: ', error);
      }
    };
    getSongs();
  }, [item]);

  const handlePlayMusic = async () => {
    try {
      const res = await playlistsAPI.getAllSongByPlaylistId(token, playlistId);
      const action = playMusic({ song: song, listSongs: res.data, playlist: playlistId });
      dispatchRedux(action);
    } catch (error) {
      console.log('Failed to fetch play music: ', error);
    }
  };
  const checkExist = () => {
    if (listRemovePL) {
      for (const item of listRemovePL) {
        if (item.idSong === song.id && item.idPlaylists === playlistId) {
          return true;
        }
      }
    }
    return false;
  };
  return (
    <div className={music?.song?.id === item?.id ? cx('wrapper-active') : cx('wrapper')} onClick={handlePlayMusic}>
      <div className={cx('wrapper-song')}>
        <div className={cx('number')}>{index + 1}</div>
        <img src={song.image || mp3Link} className={cx('song-image')} onClick={handlePlayMusic} />
        <div className={cx('wrapper-name-artist')}>
          <div className={cx('song-name')}>{song.name}</div>
          <div className={cx('song-artist')}>{song.artist}</div>
        </div>
      </div>

      <div className={cx('wrapper-actions')}>
        <div className={cx('song-genre-mg')}>{songGenre.label}</div>
        <div className={cx('action-item')}>
          <Input
            type="checkbox"
            className={cx('checkbox')}
            onChange={() =>
              dispatch({
                type: 'LIST_REMOVE_PLAYLISTS',
                payload: {
                  idSong: song.id,
                  idPlaylists: playlistId,
                },
              })
            }
            onClick={(e) => e.stopPropagation()}
            checked={checkExist()}
          />
        </div>
      </div>

      <Modal isOpen={modalConfirm} toggle={showConfirm} className={cx('confirm-view')}>
        <Confirm song={song} showConfirm={setModalConfirm} />
      </Modal>
    </div>
  );
}

export default ItemMusicPlaylist;
