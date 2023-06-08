import styles from './NotFound.module.scss';

import React from 'react';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function NotFound() {
  return <div className={cx('wrapper')}>Page Not Found</div>;
}

export default NotFound;
