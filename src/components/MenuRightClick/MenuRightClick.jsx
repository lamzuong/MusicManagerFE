/* eslint-disable jsx-a11y/alt-text */
import styles from './MenuRightClick.module.scss';
import { mp3Link } from '~/global/functionGlobal';

import { faCompactDisc, faDownload, faHeartCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';

const cx = classNames.bind(styles);

function MenuRightClick({ song, showMenu, addSong, showPlaylists }) {
  const [artists, setArtists] = useState();
  const handleDownload = () => {
    saveAs(song.url, song.name);
    showMenu(false);
  };

  useEffect(() => {
    const getArtists = async () => {
      try {
        let nameArtistShow = '';
        for (let e of song.artists) {
          nameArtistShow += e.name + ', ';
        }
        setArtists(nameArtistShow.slice(0, nameArtistShow.length - 2));
      } catch (error) {
        console.log('Failed to fetch artists list: ', error);
      }
    };
    getArtists();
  }, [song]);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <img src={song.image || mp3Link} className={cx('image')} />
        <div>
          <div className={cx('name')}>{song.name}</div>
          <div className={cx('artists')}>{artists}</div>
        </div>
      </div>
      {/* items */}
      <div className={cx('item')} onClick={handleDownload}>
        <div className={cx('icon')}>
          <FontAwesomeIcon icon={faDownload} />
        </div>
        <div className={cx('title')}>Download</div>
      </div>
      <div className={cx('item')} onClick={() => addSong(song)}>
        <div className={cx('icon')}>
          <FontAwesomeIcon icon={faHeartCirclePlus} />
        </div>
        <div className={cx('title')}>Add to Favorite list</div>
      </div>
      <div
        className={cx('item')}
        onClick={() => {
          showMenu(false);
          showPlaylists(true);
        }}
      >
        <div className={cx('icon')}>
          <FontAwesomeIcon icon={faCompactDisc} />
        </div>
        <div className={cx('title')}>Add to Playlists</div>
      </div>
    </div>
  );
}

export default MenuRightClick;
