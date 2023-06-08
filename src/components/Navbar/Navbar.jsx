/* eslint-disable react-hooks/exhaustive-deps */
import { SidebarData } from '~/global/itemsSidebar';
import styles from './Navbar.module.scss';

import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

export default function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  const [page, setPage] = useState('Songs');

  useEffect(() => {
    let location = window.location.href;
    const url = 'http://localhost:3000';
    for (const item of SidebarData) {
      if (location.startsWith(url + item.path)) setPage(item.title);
    }
  }, [window.location.href]);

  return (
    <div className={cx('wrapper-navbar')}>
      <div className={cx('navbar')}>
        <div className={cx('menu-bars')}>
          <FontAwesomeIcon icon={faBars} onClick={showSidebar} color="white" />
        </div>
      </div>
      <nav className={sidebar ? cx('nav-menu-active') : cx('nav-menu')}>
        <ul className={cx('nav-menu-items')} onClick={showSidebar}>
          <li className={cx('navbar-toggle')}>
            <div className={cx('button-close')}>
              <FontAwesomeIcon icon={faXmark} color="white" />
            </div>
          </li>

          {SidebarData.map((item, index) => {
            return (
              <li key={index} className={page === item.title ? cx('nav-text-choose') : cx('nav-text')}>
                <Link to={item.path} onClick={() => setPage(item.title)}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
