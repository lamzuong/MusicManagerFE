/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Context } from '~/context/Provider';
import { baseUrl, noAvatarLink } from '~/global/functionGlobal';
import styles from './Header.module.scss';
import Input from '../Input/Input';
import Navbar from '../Navbar/Navbar';
import { noAction } from '~/store/musicSlice';

import { Logout, Person } from '@mui/icons-material';
import { Box, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import songsAPI from '~/services/songsAPI';
import useDebounce from '~/hooks/useDebounce';
import ItemSearch from '../ItemSearch/ItemSearch';
import { Modal } from 'reactstrap';
import ModalExpired from '../ModalExpired/ModalExpired';

const cx = classNames.bind(styles);

function Header() {
  const { user, dispatch, url } = useContext(Context);
  const navigate = useNavigate();
  const dispatchRedux = useDispatch();
  const token = localStorage.getItem('token');

  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const [modalExpired, setModalExpired] = useState(false);
  const showExpired = () => {
    setModalExpired(!modalExpired);
    if (modalExpired) navigate('/');
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const [showResult, setShowResult] = useState(false);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    const action = noAction();
    dispatchRedux(action);
    navigate('/');
    localStorage.setItem('token', null);
  };

  useEffect(() => {
    dispatch({
      type: 'SEARCH',
      payload: searchValue,
    });
  }, [searchValue]);

  const debouncedValue = useDebounce(url === baseUrl + '/playlists' ? searchValue : '', 500);
  useEffect(() => {
    const searchSong = async () => {
      try {
        let res = await songsAPI.searchSong(token, debouncedValue, 1, 5, false, 'modified_at', 'DESC');
        setSearchResult(res.data.data);
      } catch (error) {
        if (error.response.status === 401) {
          showExpired();
        }
      }
    };
    if (debouncedValue !== '') searchSong();
  }, [debouncedValue, url]);
  return (
    <div className={cx('wrapper')}>
      <div className={cx('wrapper-logo-side')}>
        <div className={cx('sub-menu')}>
          <Navbar />
        </div>
        <div className={cx('wrapper-to-songs')} onClick={() => navigate('/songs')}>
          <img src="https://zjs.zmdcdn.me/zmp3-desktop/releases/v1.8.38/static/media/icon_zing_mp3_60.f6b51045.svg" />
          <h1 className={cx('header-title')}>Music Manager</h1>
        </div>
      </div>
      <span>
        <HeadlessTippy
          interactive
          visible={searchResult.length > 0 && url === baseUrl + '/playlists' && searchValue !== '' && showResult}
          offset={[0, 0]}
          render={(attrs) => (
            <div className={cx('search-result')} tabIndex="-1">
              <div className={cx('scrollable-result')}>
                {searchResult.map((e, i) => (
                  <ItemSearch item={e} key={i} setShowResult={setShowResult} />
                ))}
              </div>
            </div>
          )}
          onClickOutside={() => setShowResult(false)}
        >
          <div className={cx('view-search')}>
            <Input
              placeholder="Enter song name..."
              icon={<FontAwesomeIcon icon={faMagnifyingGlass} color={'black'} />}
              classInput={cx('input-search')}
              setValue={setSearchValue}
              onFocus={() => setShowResult(true)}
            />
          </div>
        </HeadlessTippy>
      </span>

      <Modal isOpen={modalExpired} toggle={showExpired} className={cx('confirm-view')}>
        <ModalExpired />
      </Modal>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <div className={cx('user-name')}>{user.name}</div>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <div className={cx('wrapper-avatar')}>
              <img src={user.avatar || noAvatarLink} className={cx('user-avatar')} />
            </div>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          My Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Header;
