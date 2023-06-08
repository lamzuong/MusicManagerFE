/* eslint-disable react-hooks/exhaustive-deps */
import styles from './PlaylistSong.module.scss';
import ItemMusicPlaylist from '~/components/ItemMusicPlaylist/ItemMusicPlaylist';
import Pagination from '~/components/Pagination/Pagination';
import { baseUrl, calcTotalPages, optionsPage } from '~/global/functionGlobal';
import { Context } from '~/context/Provider';
import useDebounce from '~/hooks/useDebounce';
import playlistsAPI from '~/services/playlistsAPI';
import Confirm from '~/components/Confirm/Confirm';
import ModalExpired from '~/components/ModalExpired/ModalExpired';

import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faSortUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from 'reactstrap';

const cx = classNames.bind(styles);

function PlaylistSong() {
  const { state } = useLocation();
  const { item } = state;
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const { rerenderSongPage, listRemovePL, url, searchValue } = useContext(Context);

  const [modalExpired, setModalExpired] = useState(false);
  const showExpired = () => {
    setModalExpired(!modalExpired);
    if (modalExpired) navigate('/');
  };

  const [songs, setSongs] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  const [totalItems, setTotalItems] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [totalPagesSearch, setTotalPagesSearch] = useState([]);
  const [sortName, setSortName] = useState('normal');
  const [sortGenre, setSortGenre] = useState('normal');

  // Search
  const debouncedValue = useDebounce(url.startsWith(baseUrl + '/playlists') ? searchValue : '', 500);
  useEffect(() => {
    const fetchApi = async () => {
      try {
        let res = null;
        if (sortName !== 'normal')
          res = await playlistsAPI.searchInPlaylist(
            token,
            item.id,
            debouncedValue,
            currentPageSearch,
            totalItems,
            'name',
            sortName,
          );
        if (sortGenre !== 'normal')
          res = await playlistsAPI.searchInPlaylist(
            token,
            item.id,
            debouncedValue,
            currentPageSearch,
            totalItems,
            'genre_id',
            sortGenre,
          );
        if (sortGenre === 'normal' && sortName === 'normal')
          res = await playlistsAPI.searchInPlaylist(
            token,
            item.id,
            debouncedValue,
            currentPageSearch,
            totalItems,
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
      } catch (error) {
        if (error.response.status === 401) {
          showExpired();
        }
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
  }, [sortGenre, sortName, debouncedValue, currentPageSearch, totalItems, rerenderSongPage]);

  useEffect(() => {
    const getSongsPlaylist = async () => {
      try {
        let res = null;
        if (sortName !== 'normal')
          res = await playlistsAPI.getSongByPlaylistId(token, item.id, currentPage, totalItems, 'name', sortName);
        if (sortGenre !== 'normal')
          res = await playlistsAPI.getSongByPlaylistId(token, item.id, currentPage, totalItems, 'genre_id', sortGenre);
        if (sortGenre === 'normal' && sortName === 'normal')
          res = await playlistsAPI.getSongByPlaylistId(token, item.id, currentPage, totalItems, 'modified_at', 'DESC');
        if (res !== null) {
          setSongs(res.data.data);
          setTotalPages(Array.from(Array(calcTotalPages(res.data.totalRows, totalItems)).keys()));
        }
        if (res.data.data.length === 0) {
          setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
        }
      } catch (error) {
        if (error.response.status === 401) {
          showExpired();
        }
      }
    };
    getSongsPlaylist();
  }, [currentPage, totalItems, sortGenre, sortName, rerenderSongPage]);

  const [modalConfirm, setModalConfirm] = useState(false);
  const showConfirm = () => setModalConfirm(!modalConfirm);

  const checkLength = () => {
    if (listRemovePL) {
      let listRemove = listRemovePL.filter((x) => x.idPlaylists === item.id);
      return listRemove.length > 0;
    }
    return false;
  };
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
      <div className={cx('header')}>
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
          <button
            disabled={!checkLength()}
            className={checkLength() ? cx('button-delete') : cx('button-disable')}
            onClick={checkLength() ? showConfirm : undefined}
          >
            <FontAwesomeIcon icon={faTrash} color="white" className={cx('icon-button')} />
            <div className={cx('txt-button')}>Remove</div>
          </button>
        </div>
      </div>
      <div className={cx('view-title')}>
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
              <ItemMusicPlaylist
                key={index}
                item={song}
                index={(currentPageSearch - 1) * totalItems + index}
                playlistId={item.id}
              />
            );
          })
        ) : searchValue !== '' ? (
          <div className={cx('couldnt-find')}>Couldn't find any songs like it</div>
        ) : songs.length > 0 ? (
          songs?.map((song, index) => {
            return (
              <ItemMusicPlaylist
                key={index}
                item={song}
                index={(currentPage - 1) * totalItems + index}
                playlistId={item.id}
              />
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
      <Modal isOpen={modalConfirm} toggle={showConfirm} className={cx('confirm-view')}>
        <Confirm playlist={true} songsPlaylist={listRemovePL} idPlaylist={item.id} showConfirm={setModalConfirm} />
      </Modal>
    </div>
  );
}

export default PlaylistSong;
