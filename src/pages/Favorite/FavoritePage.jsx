/* eslint-disable react-hooks/exhaustive-deps */
import styles from './FavoritePage.module.scss';
import ItemMusic from '~/components/ItemMusic/ItemMusic';
import Pagination from '~/components/Pagination/Pagination';
import { Context } from '~/context/Provider';
import { baseUrl, calcTotalPages, optionsPage } from '~/global/functionGlobal';
import songsAPI from '~/services/songsAPI';

import { faSortDown, faSortUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import Confirm from '~/components/Confirm/Confirm';
import useDebounce from '~/hooks/useDebounce';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import ModalExpired from '~/components/ModalExpired/ModalExpired';

const cx = classNames.bind(styles);

function FavoritePage() {
  const { rerenderSongPage, listRemove, url, searchValue } = useContext(Context);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [songs, setSongs] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [modalConfirm, setModalConfirm] = useState(false);
  const showConfirm = () => setModalConfirm(!modalConfirm);

  const [modalExpired, setModalExpired] = useState(false);
  const showExpired = () => {
    setModalExpired(!modalExpired);
    if (modalExpired) navigate('/');
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);
  const [totalItems, setTotalItems] = useState(5);
  const [currentPageSearch, setCurrentPageSearch] = useState(1);
  const [totalPagesSearch, setTotalPagesSearch] = useState([]);
  const [sortName, setSortName] = useState('normal');
  const [sortGenre, setSortGenre] = useState('normal');

  // Search
  const debouncedValue = useDebounce(url === baseUrl + '/favorite' ? searchValue : '', 500);
  useEffect(() => {
    const fetchApi = async () => {
      try {
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
            true,
            'genreId',
            sortGenre,
          );
        if (sortGenre === 'normal' && sortName === 'normal')
          res = await songsAPI.searchSong(
            token,
            debouncedValue,
            currentPageSearch,
            totalItems,
            true,
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
  }, [sortGenre, sortName, debouncedValue, currentPageSearch, totalItems]);
  // Sort
  useEffect(() => {
    const getSongs = async () => {
      try {
        let res = null;
        if (sortName !== 'normal')
          res = await songsAPI.getSongByUserId(token, currentPage, totalItems, true, 'name', sortName);
        if (sortGenre !== 'normal')
          res = await songsAPI.getSongByUserId(token, currentPage, totalItems, true, 'genre_id', sortGenre);
        if (sortGenre === 'normal' && sortName === 'normal')
          res = await songsAPI.getSongByUserId(token, currentPage, totalItems, true, 'modified_at', 'DESC');
        if (res !== null) {
          setSongs(res.data.data);
          setTotalPages(Array.from(Array(calcTotalPages(res.data.totalRows, totalItems)).keys()));
        }
        if (res.data.length === 0) {
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

  const checkLength = () => listRemove.length > 0;
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
              <ItemMusic item={song} index={(currentPageSearch - 1) * totalItems + index} key={index} favorite={true} />
            );
          })
        ) : searchValue !== '' ? (
          <div className={cx('couldnt-find')}>Couldn't find any songs like it</div>
        ) : songs.length > 0 ? (
          songs?.map((song, index) => {
            return <ItemMusic item={song} index={(currentPage - 1) * totalItems + index} favorite={true} key={index} />;
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
        <Confirm songs={listRemove} showConfirm={setModalConfirm} favorite={true} />
      </Modal>
    </div>
  );
}

export default FavoritePage;
