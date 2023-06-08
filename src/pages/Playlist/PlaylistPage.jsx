/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import styles from './PlaylistPage.module.scss';
import { mp3Link, notify } from '~/global/functionGlobal';
import MenuRightPlaylist from '~/components/MenuRightPlaylist/MenuRightPlaylist';
import FormPlaylist from '~/components/FormPlaylist/FormPlaylist';
import { Context } from '~/context/Provider';
import playlistsAPI from '~/services/playlistsAPI';
import { noAction } from '~/store/musicSlice';
import ModalExpired from '~/components/ModalExpired/ModalExpired';

import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Spinner } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

const cx = classNames.bind(styles);

function PlaylistPage() {
  const { dispatch, rerenderSongPage } = useContext(Context);
  const music = useSelector((state) => state.music);
  const dispatchRedux = useDispatch();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [totalPlaylists, setTotalPlaylists] = useState(null);
  const token = localStorage.getItem('token');

  const [topMenu, setTopMenu] = useState(false);
  const [leftMenu, setLeftMenu] = useState(false);
  const [menuRightClick, setMenuRightClick] = useState(false);
  const [itemClick, setItemClick] = useState(null);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [modalUpdate, setModalUpdate] = useState(false);
  const toggleUpdate = () => setModalUpdate(!modalUpdate);

  const [modalConfirm, setModalConfirm] = useState(false);
  const toggleConfirm = () => setModalConfirm(!modalConfirm);

  const [modalExpired, setModalExpired] = useState(false);
  const showExpired = () => {
    setModalExpired(!modalExpired);
    if (modalExpired) navigate('/');
  };

  const [page, setPage] = useState(3);
  const [hasMore, setHasMore] = useState(true);

  const showMenu = (e, item) => {
    e.preventDefault();
    setMenuRightClick(true);
    setLeftMenu(e.clientX + 20);
    setTopMenu(e.clientY);
    setItemClick(item);
  };
  const hideMenu = () => {
    setMenuRightClick(false);
  };

  useEffect(() => {
    try {
      const getAllPlaylists = async () => {
        let list = [];
        for (let i = 1; i <= 3; i++) {
          const res = await playlistsAPI.getByUserId(token, i);
          list = [...list, ...res.data.data];
          if (i === 1) setTotalPlaylists(res.data.totalRows);
        }
        setPlaylists(list);
      };
      getAllPlaylists();
    } catch (error) {
      if (error.response.status === 401) {
        showExpired();
      }
    }
  }, [rerenderSongPage]);

  const handleDeletePlaylist = async () => {
    try {
      const res = await playlistsAPI.getAllSongByPlaylistId(token, itemClick.id);
      let listSongId = [];
      for (const e of res.data.data) {
        listSongId.push(e.id);
      }
      await playlistsAPI.removeSongInPlaylist(token, itemClick.id, listSongId);
      await playlistsAPI.delete(token, itemClick.id);
      if (music.song !== null && music.playlist === itemClick.id) {
        dispatchRedux(noAction());
      }

      toggleConfirm();
      notify('Delete playlists success!');
      dispatch({ type: 'RERENDER' });
    } catch (error) {
      if (error.response.status === 401) {
        showExpired();
      }
    }
  };

  const fetchData = async () => {
    if (playlists.length === totalPlaylists) setHasMore(false);
    const res = await playlistsAPI.getByUserId(token, page + 1);
    setPlaylists([...playlists, ...res.data.data]);
    setPage(page + 1);
    if (page === 1) setTotalPlaylists(res.data.totalRows);
  };

  return (
    <div className={cx('wrapper')} onClick={hideMenu}>
      <InfiniteScroll
        dataLength={playlists.length}
        className={cx('flex-container')}
        loader={<Spinner />}
        next={fetchData}
        hasMore={hasMore}
      >
        <div className={cx('wrapper-add-button')} onClick={toggle}>
          <FontAwesomeIcon icon={faPlus} className={cx('icon-plus')} />
          <div className={cx('title-plus')}>New Playlists</div>
        </div>

        {playlists.map((element, i) => (
          <div
            className={cx('wrapper-playlist')}
            key={i}
            onClick={() =>
              navigate(`/playlists/${element.id}`, {
                state: {
                  item: element,
                },
              })
            }
            onContextMenu={(e) => showMenu(e, element)}
          >
            <img src={element.avatar || mp3Link} className={cx('avatar-playlist')} />
            <div className={cx('name-playlist')}>{element.name}</div>
          </div>
        ))}
      </InfiniteScroll>
      <Modal isOpen={modalExpired} toggle={showExpired} className={cx('confirm-view')}>
        <ModalExpired />
      </Modal>
      <Modal isOpen={modal} toggle={toggle}>
        <FormPlaylist edit={false} setModal={setModal} />
      </Modal>
      <Modal isOpen={modalUpdate} toggle={toggleUpdate}>
        <FormPlaylist edit={true} item={itemClick} setModal={setModalUpdate} />
      </Modal>
      {menuRightClick && (
        <div style={{ position: 'absolute', top: topMenu, left: leftMenu }} onBlur={hideMenu}>
          <MenuRightPlaylist
            song={itemClick}
            showMenu={setMenuRightClick}
            showForm={setModal}
            showConfirm={setModalConfirm}
            showFormUpdate={setModalUpdate}
          />
        </div>
      )}
      <Modal isOpen={modalConfirm} toggle={toggleConfirm}>
        <div className={cx('modal-confirm')}>
          <div className={cx('title')}>Are you sure you want to delete this playlists ?</div>
          <div className={cx('view-button')}>
            <Button color="primary" className={cx('button')} onClick={handleDeletePlaylist}>
              Yes
            </Button>
            <Button color="danger" className={cx('button')} onClick={toggleConfirm}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PlaylistPage;
