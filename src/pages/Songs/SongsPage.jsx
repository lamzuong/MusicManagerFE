/* eslint-disable react-hooks/exhaustive-deps */
import { Context } from '~/context/Provider';
import { baseUrl, calcTotalPages, notify, optionsArtist, optionsGenre, optionsPage } from '~/global/functionGlobal';
import { updateListSong } from '~/store/musicSlice';
import useDebounce from '~/hooks/useDebounce';
import songsAPI from '~/services/songsAPI';
import styles from './SongsPage.module.scss';
import Confirm from '~/components/Confirm/Confirm';
import ItemMusic from '~/components/ItemMusic/ItemMusic';
import MenuRightClick from '~/components/MenuRightClick/MenuRightClick';
import Pagination from '~/components/Pagination/Pagination';
import FormMusic from '~/components/FormMusic/FormMusic';
import ModalPlaylists from '~/components/ModalPlaylists/ModalPlaylists';
import FormPlaylist from '~/components/FormPlaylist/FormPlaylist';
import ModalExpired from '~/components/ModalExpired/ModalExpired';

import { faPlusCircle, faSortDown, faSortUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import artistsAPI from '~/services/artistsAPI';
import genresAPI from '~/services/genreAPI';

const cx = classNames.bind(styles);

function SongsPage() {
  const { rerenderSongPage, listDelete, searchValue, url } = useContext(Context);
  const dispatchRedux = useDispatch();
  const music = useSelector((state) => state.music);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [songs, setSongs] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  const [totalItems, setTotalItems] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [totalPagesSearch, setTotalPagesSearch] = useState([]);
  const [sortName, setSortName] = useState('normal');
  const [sortGenre, setSortGenre] = useState('normal');

  const checkLength = () => listDelete.length > 0;

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [modalConfirm, setModalConfirm] = useState(false);
  const showConfirm = () => setModalConfirm(!modalConfirm);

  const [modalExpired, setModalExpired] = useState(false);
  const showExpired = () => {
    setModalExpired(!modalExpired);
    if (modalExpired) navigate('/');
  };
  const [modalPlaylists, setModalPlaylists] = useState(false);
  const togglePlaylists = () => setModalPlaylists(!modalPlaylists);

  const [topMenu, setTopMenu] = useState(false);
  const [leftMenu, setLeftMenu] = useState(false);
  const [menuRightClick, setMenuRightClick] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [songClick, setSongClick] = useState(null);
  const showMenu = (e, song) => {
    e.preventDefault();
    setMenuRightClick(true);
    setShowPlaylists(false);
    setLeftMenu(e.clientX + 20);
    setTopMenu(e.clientY);
    setSongClick(song);
  };
  const hideMenu = () => {
    setMenuRightClick(false);
    setShowPlaylists(false);
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
    if (!modal) getData();
  }, [modal]);
  const addToFavoriteList = async (song) => {
    try {
      if (!song.favorite) {
        await songsAPI.addToFavoriteSong(token, [song.id]);
        if (music.favorite === true) {
          const action = updateListSong({ newSong: song });
          dispatchRedux(action);
        }
      }
      hideMenu();
      notify('Add success!');
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        showExpired();
      }
    }
  };
  // Search
  const debouncedValue = useDebounce(url === baseUrl + '/songs' ? searchValue : '', 500);
  useEffect(() => {
    try {
      const fetchApi = async () => {
        let res = null;
        if (sortName !== 'normal')
          res = await songsAPI.searchSong(
            token,
            debouncedValue,
            currentPageSearch,
            totalItems,
            false,
            'name',
            sortName,
          );
        if (sortGenre !== 'normal')
          res = await songsAPI.searchSong(
            token,
            debouncedValue,
            currentPageSearch,
            totalItems,
            false,
            'genre_id',
            sortGenre,
          );
        if (sortGenre === 'normal' && sortName === 'normal')
          res = await songsAPI.searchSong(
            token,
            debouncedValue,
            currentPageSearch,
            totalItems,
            false,
            'modified_at',
            'DESC',
          );
        if (res !== null) {
          setSearchResult(res.data.data);
          setTotalPagesSearch(Array.from(Array(calcTotalPages(res.data.totalRows, totalItems)).keys()));
        }
        if (res.data.data.length === 0) {
          setCurrentPageSearch(currentPageSearch > 1 ? currentPageSearch - 1 : 1);
        }
      };
      if (searchValue !== '') fetchApi();
      else {
        if (searchResult.length > 0) {
          setSearchResult([]);
          setCurrentPage(1);
          setCurrentPageSearch(1);
        }
      }
    } catch (error) {
      if (error.response.status === 401) {
        showExpired();
      }
    }
  }, [sortGenre, sortName, debouncedValue, currentPageSearch, totalItems, rerenderSongPage]);
  // Sort and get
  useEffect(() => {
    const getSongs = async () => {
      try {
        let res = null;
        if (sortName !== 'normal')
          res = await songsAPI.getSongByUserId(token, currentPage, totalItems, false, 'name', sortName);
        if (sortGenre !== 'normal')
          res = await songsAPI.getSongByUserId(token, currentPage, totalItems, false, 'genre_id', sortGenre);
        if (sortGenre === 'normal' && sortName === 'normal')
          res = await songsAPI.getSongByUserId(token, currentPage, totalItems, false, 'modified_at', 'DESC');
        if (res !== null) {
          setSongs(res.data.data);
          setTotalPages(Array.from(Array(calcTotalPages(res.data.totalRows, totalItems)).keys()));
        }
        if (res.data.data.length === 0) {
          setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
        }
      } catch (error) {
        console.log(error);
        if (error.response.status === 401) {
          showExpired();
        }
      }
    };
    getSongs();
  }, [sortGenre, sortName, currentPage, rerenderSongPage, totalItems]);
  const handleChangeState = (variable) => {
    if (variable === 'name') {
      if (sortName === 'normal') {
        setSortName('ASC');
        setSortGenre('normal');
      } else if (sortName === 'ASC') {
        setSortName('DESC');
        setSortGenre('normal');
      } else {
        setSortName('normal');
        setSortGenre('normal');
      }
    } else if (variable === 'genre') {
      if (sortGenre === 'normal') {
        setSortGenre('ASC');
        setSortName('normal');
      } else if (sortGenre === 'ASC') {
        setSortGenre('DESC');
        setSortName('normal');
      } else {
        setSortGenre('normal');
        setSortName('normal');
      }
    }
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')} onClick={hideMenu}>
        <div className={cx('wrapper-page')}>
          <div className={cx('txt-title')}>Total items per page</div>
          <Select
            defaultValue={optionsPage()[1]}
            options={optionsPage()}
            onChange={(x) => {
              setCurrentPage(1);
              setCurrentPageSearch(1);
              setTotalItems(x.value);
            }}
            className={cx('combobox')}
          />
        </div>
        <div className={cx('wrapper-button')}>
          <button className={cx('button-add')} onClick={toggle}>
            <FontAwesomeIcon icon={faPlusCircle} className={cx('icon-button')} />
            <div className={cx('txt-button')}>New Song</div>
          </button>
          <button
            disabled={!checkLength()}
            className={checkLength() ? cx('button-delete') : cx('button-disable')}
            onClick={checkLength() ? showConfirm : undefined}
          >
            <FontAwesomeIcon icon={faTrash} color="white" className={cx('icon-button')} />
            <div className={cx('txt-button')}>Delete</div>
          </button>
        </div>
      </div>
      <div className={cx('view-title')} onClick={hideMenu}>
        <div className={cx('title-with-sort')}>
          <div className={cx('title-name')} onClick={() => handleChangeState('name')}>
            Song name
          </div>
          {sortName !== 'normal' && (
            <div className={cx('sort-up-down')}>
              <FontAwesomeIcon
                icon={faSortUp}
                className={cx('icon')}
                color={sortName === 'ASC' ? 'white' : 'grey'}
                onClick={() => setSortName('ASC')}
              />
              <FontAwesomeIcon
                icon={faSortDown}
                className={cx('icon')}
                color={sortName === 'DESC' ? 'white' : 'grey'}
                onClick={() => setSortName('DESC')}
              />
            </div>
          )}
        </div>

        <div className={cx('title-right')}>
          <div className={cx('title-with-sort')}>
            <div className={cx('title-genre')} onClick={() => handleChangeState('genre')}>
              Genre
            </div>
            {sortGenre !== 'normal' && (
              <div className={cx('sort-up-down')}>
                <FontAwesomeIcon
                  icon={faSortUp}
                  className={cx('icon')}
                  color={sortGenre === 'ASC' ? 'white' : 'grey'}
                  onClick={() => setSortGenre('ASC')}
                />
                <FontAwesomeIcon
                  icon={faSortDown}
                  className={cx('icon')}
                  color={sortGenre === 'DESC' ? 'white' : 'grey'}
                  onClick={() => setSortGenre('DESC')}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={cx('list-songs')}>
        {searchResult.length > 0 ? (
          searchResult.map((song, index) => {
            return (
              <div onContextMenu={(e) => showMenu(e, song)} key={index}>
                <ItemMusic item={song} index={(currentPageSearch - 1) * totalItems + index} key={index} />
              </div>
            );
          })
        ) : searchValue !== '' ? (
          <div className={cx('couldnt-find')}>Couldn't find any songs like it</div>
        ) : songs?.length > 0 ? (
          songs?.map((song, index) => {
            return (
              <div onContextMenu={(e) => showMenu(e, song)} key={index}>
                <ItemMusic item={song} index={(currentPage - 1) * totalItems + index} />
              </div>
            );
          })
        ) : (
          <div className={cx('couldnt-find')}>Don't have any songs</div>
        )}
      </div>
      {debouncedValue !== '' ? (
        <Pagination
          totalPages={totalPagesSearch}
          currentPage={currentPageSearch}
          setCurrentPage={setCurrentPageSearch}
        />
      ) : (
        <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      <Modal isOpen={modalExpired} toggle={showExpired} className={cx('confirm-view')}>
        <ModalExpired />
      </Modal>
      <Modal isOpen={modal} toggle={toggle} className={cx('modal-view')}>
        <FormMusic
          edit={false}
          optionsArtist={optionsArtist(artists)}
          optionsGenre={optionsGenre(genres)}
          setModal={setModal}
        />
      </Modal>
      <Modal isOpen={modalConfirm} toggle={showConfirm} className={cx('confirm-view')}>
        <Confirm songs={listDelete} showConfirm={setModalConfirm} />
      </Modal>

      {menuRightClick && (
        <div style={{ position: 'absolute', top: topMenu, left: leftMenu }} onBlur={hideMenu}>
          <MenuRightClick
            song={songClick}
            showMenu={setMenuRightClick}
            addSong={addToFavoriteList}
            showPlaylists={setShowPlaylists}
          />
        </div>
      )}
      {showPlaylists && (
        <div style={{ position: 'absolute', top: topMenu, left: leftMenu }}>
          <ModalPlaylists showFormAdd={setModalPlaylists} song={songClick} showPlaylists={setShowPlaylists} />
        </div>
      )}
      <Modal isOpen={modalPlaylists} toggle={togglePlaylists}>
        <FormPlaylist edit={false} song={songClick} setModal={setModalPlaylists} showPlaylists={setShowPlaylists} />
      </Modal>
    </div>
  );
}

export default SongsPage;
