import styles from './ModalExpired.module.scss';

import React from 'react';
import classNames from 'classnames/bind';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function ModalExpired() {
  const navigate = useNavigate();
  return (
    <div className={cx('wrapper')}>
      <p className={cx('title')}>Your login session has expired! Please login again!</p>
      <Button color="primary" block onClick={() => navigate('/')}>
        OK
      </Button>
    </div>
  );
}

export default ModalExpired;
