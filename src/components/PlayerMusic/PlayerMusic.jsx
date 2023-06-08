/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/alt-text */
import { mp3Link, notify } from '~/global/functionGlobal';
import songsAPI from '~/services/songsAPI';
import { nextSong, updateListSong } from '~/store/musicSlice';
import Player from '../Player/Player';
import styles from './PlayerMusic.module.scss';

import { faHeart } from '@fortawesome/free-regular-svg-icons';
import {
  faDownload,
  faHeart as faHeartTym,
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { saveAs } from 'file-saver';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function PlayerMusic({ song = {} }) {
  const dispatch = useDispatch();
  const music = useSelector((state) => state.music);
  const token = localStorage.getItem('token');

  const [currentSong, setCurrentSong] = useState(song);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);

  const [nameSong, setNameSong] = useState(currentSong.name);
  const [artistSong, setArtistSong] = useState(currentSong.artist);

  const audioElem = useRef();
  useEffect(() => {
    const getSongs = async () => {
      try {
        let result = '';
        for (const artist of song.artists) {
          result += artist.name + ', ';
        }
        setCurrentSong({ ...song, artist: result.slice(0, result.length - 2) });
      } catch (error) {
        console.log('Failed to fetch artists list: ', error);
      }
    };
    getSongs();
  }, [song]);

  useEffect(() => {
    if (audioElem.current) audioElem.current.volume = volume / 100;
    if (isPlaying) {
      audioElem.current.play();
    } else {
      audioElem.current.pause();
    }
  }, [isPlaying, volume]);

  const onPlaying = () => {
    const duration = audioElem.current.duration;
    const ct = audioElem.current.currentTime;
    const progress = (ct / duration) * 100;
    setCurrentSong({
      ...currentSong,
      progress: progress,
      length: duration,
    });
    if (progress === 100 && !music.loop) dispatch(nextSong());
  };

  const clickRef = useRef();
  const adjustVolume = (e) => {
    let width = clickRef.current.clientWidth;
    const offset = e.nativeEvent.offsetX;
    const progress = (offset / width) * 100;
    setVolume(Math.floor(progress));
  };
  const handleChangeVolume = () => {
    if (volume > 0) setVolume(0);
    else setVolume(100);
  };
  const handleDownload = () => saveAs(song.url, song.name);

  const addToFavoriteList = async () => {
    try {
      if (!song.favorite) {
        const res = await songsAPI.addToFavoriteSong(token, [song.id]);
        if (music.favorite === true) {
          const action = updateListSong({ newSong: res.data });
          dispatch(action);
        }
        setCurrentSong({ ...currentSong, favorite: true });
      }
      notify('Add success!');
    } catch (error) {}
  };
  // Get Dimensions and Responsive
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  // Handle with dimensions
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    if (windowDimensions.width < 600 || (windowDimensions.width < 1024 && currentSong.name.length > 15)) {
      let nameTemp = currentSong.name.slice(0, 15);
      nameTemp = nameTemp !== currentSong.name ? nameTemp + '...' : nameTemp;
      setNameSong(nameTemp);
      let artistTemp = currentSong.artist.slice(0, 20);
      artistTemp = artistTemp !== currentSong.artist ? artistTemp + '...' : artistTemp;
      setArtistSong(artistTemp);
    } else {
      setNameSong(currentSong.name);
      setArtistSong(currentSong.artist);
    }
  }, [windowDimensions, currentSong]);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('media')}>
        <div className={cx('media-left')}>
          <img src={currentSong.image || mp3Link} className={cx('image')} />
        </div>
        <div className={cx('media-content')}>
          <div className={cx('music-name')}>{nameSong}</div>
          <div className={cx('singer-name')}>{artistSong}</div>
        </div>
        <div className={cx('media-right')}>
          {currentSong.favorite ? (
            <FontAwesomeIcon icon={faHeartTym} color="red" className={cx('icon-heart')} onClick={addToFavoriteList} />
          ) : (
            <FontAwesomeIcon icon={faHeart} color="white" className={cx('icon-heart')} onClick={addToFavoriteList} />
          )}
        </div>
      </div>
      <div className={cx('player-controls')}>
        <audio src={currentSong.url} ref={audioElem} onTimeUpdate={onPlaying} autoPlay loop={music.loop} />
        <Player
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          audioElem={audioElem}
          currentSong={currentSong}
          loop={music.loop}
          random={music.random}
        />
      </div>
      <div className={cx('right-actions')}>
        <div className={cx('wrapper-actions')}>
          <abbr title="Download Song" className={cx('icon-action')} onClick={handleDownload}>
            <FontAwesomeIcon icon={faDownload} color="white" />
          </abbr>
          <div className={cx('volume')}>
            <div className={cx('icon-volume')}>
              {volume > 65 ? (
                <FontAwesomeIcon icon={faVolumeHigh} color="white" onClick={handleChangeVolume} />
              ) : volume <= 65 && volume > 0 ? (
                <FontAwesomeIcon icon={faVolumeLow} color="white" onClick={handleChangeVolume} />
              ) : (
                <FontAwesomeIcon icon={faVolumeXmark} color="white" onClick={handleChangeVolume} />
              )}
            </div>
            <div className={cx('volume-range')} onClick={adjustVolume} ref={clickRef}>
              <div className={cx('volume-current')} style={{ width: `${volume + '%'}` }} />
              <div className={cx('circle')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerMusic;
