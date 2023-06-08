import { Context } from '~/context/Provider';
import songsAPI from '~/services/songsAPI';
import styles from './Confirm.module.scss';
import playlistsAPI from '~/services/playlistsAPI';

import classNames from 'classnames/bind';
import { useContext, useState } from 'react';
import { Button, Spinner } from 'reactstrap';
import { notify } from '~/global/functionGlobal';
import { noAction, playMusic, updateListSong } from '~/store/musicSlice';
import { useDispatch, useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function Confirm({ favorite = false, songs, showConfirm, playlist = false, songsPlaylist, idPlaylist }) {
  const { dispatch } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const music = useSelector((state) => state.music);
  const dispatchRedux = useDispatch();
  const token = localStorage.getItem('token');

  const totalSongsRemove = () => {
    if (playlist) {
      let listRemove = songsPlaylist.filter((x) => x.idPlaylists === idPlaylist);
      return listRemove.length;
    } else return 0;
  };

  const handleDeleteSong = async () => {
    setLoading(true);

    for (let id of songs) {
      await songsAPI.delete(token, id);
    }

    dispatch({ type: 'LIST_DELETE', payload: -1 });

    const action = updateListSong({ updateDelete: true, listRemoveId: [...songs] });
    dispatchRedux(action);
    //  if playing in songs
    handleNextSong(favorite);
    if (music.favorite === true) {
      if (songs.includes(music.song.id)) {
        handleNextSong(true);
      }
    }

    showConfirm(false);
    dispatch({ type: 'RERENDER' });
    notify('Delete success!');

    setLoading(false);
  };
  const handleRemoveFavorite = async () => {
    try {
      setLoading(true);

      await songsAPI.removeFromFavoriteSong(token, [...songs]);
      dispatch({ type: 'LIST_REMOVE', payload: -1 });

      const action = updateListSong({ updateDelete: true, listRemoveId: [...songs] });
      dispatchRedux(action);

      //  if playing in favorite songs
      handleNextSong(favorite);

      showConfirm(false);
      dispatch({ type: 'RERENDER' });
      notify('Remove success!');

      setLoading(false);
    } catch (error) {
      console.log(error);
      alert('Failed to remove in favorite list');
    }
  };
  const handleRemovePlaylists = async () => {
    try {
      setLoading(true);
      let listRemove = songsPlaylist.filter((x) => x.idPlaylists === idPlaylist);

      let listIdRemove = [];
      for (const item of listRemove) {
        listIdRemove.push(item.idSong);
        dispatch({
          type: 'LIST_REMOVE_PLAYLISTS',
          payload: {
            idSong: item.idSong,
            idPlaylists: idPlaylist,
          },
        });
      }
      const action = updateListSong({ updateDelete: true, listRemoveId: listIdRemove });
      dispatchRedux(action);
      await playlistsAPI.removeSongInPlaylist(token, idPlaylist, listIdRemove);
      handleNextSongPlaylist();
      setLoading(false);

      showConfirm(false);
      dispatch({ type: 'RERENDER' });
      notify('Remove success!');
    } catch (error) {
      console.log(error);
      alert('Failed to remove in playlist');
    }
  };
  const handleNextSong = (favoriteList) => {
    if (music.song !== null && music.favorite === favoriteList) {
      let listCurrentSongs = music.listSongs;
      if (listCurrentSongs !== null) {
        listCurrentSongs = listCurrentSongs.filter((element) => !songs.includes(element.id));
      }
      if (listCurrentSongs == null || listCurrentSongs.length === 0) {
        dispatchRedux(noAction());
      } else {
        let songPlaying = music.song.id;
        let songPlayNext = null;

        if (songs.includes(songPlaying)) {
          const index = music.listSongs.findIndex((x) => x.id === songPlaying);
          if (index < music.listSongs.length - 1) {
            for (let i = index; i < music.listSongs.length - 1; i++) {
              if (!songs.includes(music.listSongs[i + 1].id) && i + 1 < music.listSongs.length) {
                songPlayNext = music.listSongs[i + 1];
                break;
              }
            }
          }
          if (songPlayNext === null) {
            for (let i = 0; i < index; i++) {
              if (!songs.includes(music.listSongs[i].id)) {
                songPlayNext = music.listSongs[i];
                break;
              }
            }
          }
          const action = playMusic({ song: songPlayNext, listSongs: listCurrentSongs, favorite: favoriteList });
          dispatchRedux(action);
        } else {
          const action = playMusic({ listSongs: listCurrentSongs, favorite: favoriteList });
          dispatchRedux(action);
        }
      }
    }
  };
  const handleNextSongPlaylist = () => {
    if (music.song !== null && music.playlist === idPlaylist) {
      let listCurrentSongs = music.listSongs;
      let listIdRemove = songsPlaylist.map((x) => x.idSong);
      if (listCurrentSongs !== null) {
        listCurrentSongs = listCurrentSongs.filter((item) => !listIdRemove.includes(item.id));
      }

      if (listCurrentSongs.length === 0) {
        dispatchRedux(noAction());
      } else {
        let songPlaying = music.song.id;
        let songPlayNext = null;

        if (listIdRemove.includes(songPlaying)) {
          const index = music.listSongs.findIndex((x) => x.id === songPlaying);
          if (index < music.listSongs.length - 1) {
            for (let i = index; i < music.listSongs.length - 1; i++) {
              if (!listIdRemove.includes(music.listSongs[i + 1].id) && i + 1 < music.listSongs.length) {
                songPlayNext = music.listSongs[i + 1];
                break;
              }
            }
          }
          if (songPlayNext === null) {
            for (let i = 0; i < index; i++) {
              if (!listIdRemove.includes(music.listSongs[i].id)) {
                songPlayNext = music.listSongs[i];
                break;
              }
            }
          }
          const action = playMusic({ song: songPlayNext, listSongs: listCurrentSongs, playlist: idPlaylist });
          dispatchRedux(action);
        } else {
          const action = playMusic({ listSongs: listCurrentSongs, playlist: idPlaylist });
          dispatchRedux(action);
        }
      }
    }
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('title')}>
        {playlist
          ? `Are you sure you want to remove ${
              totalSongsRemove() > 1 ? totalSongsRemove() + ' songs' : 'this song'
            } from Playlists Songs ?`
          : favorite
          ? `Are you sure you want to remove ${
              songs.length > 1 ? songs.length + ' songs' : 'this song'
            } from Favorite Songs ?`
          : `Are you sure you want to delete ${songs.length > 1 ? songs.length + ' songs' : 'this song'} ?`}
      </div>
      {/* Spinner */}
      {loading && (
        <div className={cx('view-spinner')}>
          <Spinner color="primary" />
        </div>
      )}
      <div className={cx('view-button')}>
        <Button
          color="primary"
          className={cx('button')}
          onClick={favorite ? handleRemoveFavorite : playlist ? handleRemovePlaylists : handleDeleteSong}
        >
          Yes
        </Button>
        <Button color="danger" className={cx('button')} onClick={() => showConfirm(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default Confirm;
