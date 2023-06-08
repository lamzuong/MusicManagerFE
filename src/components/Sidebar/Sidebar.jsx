/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
import styles from './Sidebar.module.scss';
import { SidebarData } from '~/global/itemsSidebar';

import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Sidebar() {
  const navigate = useNavigate();
  const [page, setPage] = useState('Songs');

  useEffect(() => {
    let location = window.location.href;
    const url = 'http://localhost:3000';
    for (const item of SidebarData) {
      if (location.startsWith(url + item.path)) setPage(item.title);
    }
  }, [window.location.href]);

  const changePage = (path, page) => {
    setPage(page);
    navigate(path);
  };
  return (
    <aside className={cx('wrapper')}>
      {SidebarData.map((e, i) => (
        <div
          key={i}
          className={page === e.title ? cx('nav-item-active') : cx('nav-item-normal')}
          onClick={() => changePage(e.path, e.title)}
        >
          {e.icon}
          <div className={cx('nav-item-title')}>{e.title}</div>
        </div>
      ))}
    </aside>
  );
}

export default Sidebar;
