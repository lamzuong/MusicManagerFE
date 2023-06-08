/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Context } from '~/context/Provider';
import { mp3Link, optionsArtist, optionsGenre } from '~/global/functionGlobal';
import songsAPI from '~/services/songsAPI';
import { playMusic } from '~/store/musicSlice';
import Confirm from '../Confirm/Confirm';
import FormMusic from '../FormMusic/FormMusic';
import styles from './ItemMusic.module.scss';

import { faEllipsisVertical, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Modal } from 'reactstrap';
import artistsAPI from '~/services/artistsAPI';
import genresAPI from '~/services/genreAPI';

const cx = classNames.bind(styles);

function ItemMusic({ item, index, favorite = false }) {
  const { dispatch, listDelete, listRemove } = useContext(Context);
  const dispatchRedux = useDispatch();
  const music = useSelector((state) => state.music);
  const token = localStorage.getItem('token');

  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [song, setSong] = useState(item);
  const [songArtists, setSongArtists] = useState([]);
  const [songGenre, setSongGenre] = useState([]);

  const [modalForm, setModalForm] = useState(false);
  const showForm = (e) => {
    e.stopPropagation();
    setModalForm(!modalForm);
  };

  const [modalConfirm, setModalConfirm] = useState(false);
  const showConfirm = () => setModalConfirm(!modalConfirm);

  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);
  const showConfirmDelete = () => setModalConfirmDelete(!modalConfirmDelete);

  const [showOptions, setShowOptions] = useState(false);
  const toggleOptions = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await artistsAPI.getAll(token);
        setArtists(res.data.data);
        const res2 = await genresAPI.getAll(token);
        setGenres(res2.data.data);
      } catch (error) {
        console.log('Failed to fetch artist and genre list: ', error);
      }
    };
    if (!modalForm) getData();
  }, [modalForm]);

  useEffect(() => {
    let nameArtistShow = '';
    let listArtits = [];
    for (const artist of song.artists) {
      nameArtistShow += artist.name + ', ';
      listArtits.push(artist.id);
    }
    setSongArtists(listArtits);
    setSong({ ...item, artist: nameArtistShow.slice(0, nameArtistShow.length - 2) });
    setSongGenre({ value: item.genre, label: item.genre.name });
  }, [item, song.artists]);

  const handlePlayMusic = async () => {
    try {
      let res = [];
      if (favorite)
        res = await songsAPI.getSongByUserId(token, undefined, undefined, true, 'modified_at', 'DESC', true);
      else res = await songsAPI.getSongByUserId(token, undefined, undefined, false, 'modified_at', 'DESC', true);
      const action = playMusic({ song: song, listSongs: res.data, favorite: favorite });
      dispatchRedux(action);
    } catch (error) {
      console.log('Failed to fetch songs list: ', error);
    }
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
        <div className={favorite ? cx('song-genre-mg') : cx('song-genre')}>{songGenre.label}</div>
        {favorite ? (
          <div className={cx('action-item')}>
            <Input
              type="checkbox"
              className={cx('checkbox')}
              onChange={() => dispatch({ type: 'LIST_REMOVE', payload: song.id })}
              onClick={(e) => e.stopPropagation()}
              checked={listRemove.includes(song.id)}
            />
          </div>
        ) : (
          <div className={cx('action-item')}>
            {/* <abbr title="Edit Song" onClick={showForm}>
              <FontAwesomeIcon icon={faPenToSquare} color="white" className={cx('icon')} />
            </abbr> */}
            <Input
              type="checkbox"
              className={cx('checkbox')}
              onClick={(e) => e.stopPropagation()}
              onChange={() => dispatch({ type: 'LIST_DELETE', payload: song.id })}
              checked={listDelete.includes(song.id)}
            />
            <div className={cx('multi-options')} onClick={toggleOptions}>
              <FontAwesomeIcon icon={faEllipsisVertical} color="white" />
              {showOptions && (
                <div className={cx('menu-options')} onMouseLeave={() => setShowOptions(false)}>
                  <div className={cx('action')} onClick={showForm}>
                    <FontAwesomeIcon icon={faPenToSquare} color="white" className={cx('icon')} />
                    <div className={cx('title')}>Edit</div>
                  </div>
                  <div className={cx('action')} onClick={showConfirmDelete}>
                    <FontAwesomeIcon icon={faTrash} color="white" className={cx('icon')} />
                    <div className={cx('title')}>Delete</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Modal isOpen={modalForm} toggle={showForm} className={cx('modal-view')}>
        <FormMusic
          edit={true}
          id={song.id}
          name={song.name}
          url={song.url}
          image={song.image}
          artists={songArtists}
          genre={songGenre}
          optionsArtist={optionsArtist(artists)}
          optionsGenre={optionsGenre(genres)}
          setModal={setModalForm}
        />
      </Modal>

      <Modal isOpen={modalConfirm} toggle={showConfirm} className={cx('confirm-view')}>
        <Confirm songs={[song.id]} favorite={true} showConfirm={setModalConfirm} />
      </Modal>
      <Modal isOpen={modalConfirmDelete} toggle={showConfirmDelete} className={cx('confirm-view')}>
        <Confirm songs={[song.id]} favorite={false} showConfirm={setModalConfirmDelete} />
      </Modal>
    </div>
  );
}

export default ItemMusic;
