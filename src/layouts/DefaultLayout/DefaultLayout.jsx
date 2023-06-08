import styles from './DefaultLayout.module.scss';
import Header from '~/components/Header/Header';
import PlayerMusic from '~/components/PlayerMusic/PlayerMusic';

import React from 'react';
import classNames from 'classnames/bind';
import Sidebar from '~/components/Sidebar/Sidebar';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  const music = useSelector((state) => state.music);
  // const { innerWidth: width, innerHeight: height } = window;

  return (
    <div className={cx('wrapper')}>
      <ToastContainer />
      <div>
        <Header />
        <div className={cx('body')}>
          <Sidebar />
          <div className={cx('content')}>{children}</div>
        </div>
        {music.action !== 'No Action' && <PlayerMusic song={music.song} />}
      </div>
    </div>
  );
}

export default DefaultLayout;
