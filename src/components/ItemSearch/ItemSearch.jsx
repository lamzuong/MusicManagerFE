/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import styles from './ItemSearch.module.scss';
import FormMusic from '../FormMusic/FormMusic';
import Confirm from '../Confirm/Confirm';

import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { playMusic } from '~/store/musicSlice';
import { useDispatch } from 'react-redux';
import { Modal } from 'reactstrap';
import { optionsArtist, optionsGenre } from '~/global/functionGlobal';
import artistsAPI from '~/services/artistsAPI';
import genresAPI from '~/services/genreAPI';
import ModalExpired from '../ModalExpired/ModalExpired';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function ItemSearch({ item, setShowResult }) {
  const dispatchRedux = useDispatch();
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const token = localStorage.getItem('token');

  const [modalExpired, setModalExpired] = useState(false);
  const showExpired = () => {
    setModalExpired(!modalExpired);
    if (modalExpired) navigate('/');
  };

  let artist = '';
  let listArtists = [];
  for (const e of item.artists) {
    artist += e.name + ', ';
    listArtists.push(e.id);
  }
  artist = artist.slice(0, artist.length - 2);

  const [modalForm, setModalForm] = useState(false);
  const showForm = (e) => {
    e.stopPropagation();
    setModalForm(!modalForm);
    setShowResult(false);
  };
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);
  const showConfirmDelete = (e) => {
    e.stopPropagation();
    setModalConfirmDelete(!modalConfirmDelete);
    setShowResult(false);
  };

  const [showOptions, setShowOptions] = useState(false);
  const toggleOptions = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handlePlayMusic = async () => {
    try {
      const action = playMusic({ song: item, listSongs: [item] });
      dispatchRedux(action);
      setShowResult(false);
    } catch (error) {
      console.log('Failed to fetch songs list: ', error);
    }
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
        if (error.response.status === 401) {
          showExpired();
        }
      }
    };
    if (!modalForm) getData();
  }, [modalForm]);
  return (
    <div className={cx('item-search')} onClick={handlePlayMusic}>
      <div className={cx('item-search')}>
        <img src={item.image} className={cx('image-song')} />
        <div className={cx('info-song')}>
          <div className={cx('name-song')}>{item.name}</div>
          <div className={cx('artist-song')}>{artist}</div>
        </div>
      </div>
      <div className={cx('icon-more')}>
        <FontAwesomeIcon icon={faEllipsis} onClick={toggleOptions} />
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
      <Modal isOpen={modalForm} toggle={showForm} className={cx('modal-view')}>
        <FormMusic
          edit={true}
          id={item.id}
          name={item.name}
          url={item.url}
          image={item.image}
          artists={listArtists}
          genre={{ value: item.genre, label: item.genre.name }}
          optionsArtist={optionsArtist(artists)}
          optionsGenre={optionsGenre(genres)}
          setModal={setModalForm}
        />
      </Modal>
      <Modal isOpen={modalConfirmDelete} toggle={showConfirmDelete} className={cx('confirm-view')}>
        <Confirm songs={[item.id]} favorite={false} showConfirm={setModalConfirmDelete} />
      </Modal>
      <Modal isOpen={modalExpired} toggle={showExpired} className={cx('confirm-view')}>
        <ModalExpired />
      </Modal>
    </div>
  );
}

export default ItemSearch;
