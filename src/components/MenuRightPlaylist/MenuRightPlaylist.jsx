/* eslint-disable jsx-a11y/alt-text */
import styles from './MenuRightPlaylist.module.scss';

import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function MenuRightPlaylist({ showFormUpdate, showConfirm }) {
  return (
    <div className={cx('wrapper')}>
      {/* items */}
      <div className={cx('item')} onClick={() => showFormUpdate(true)}>
        <div className={cx('icon')}>
          <FontAwesomeIcon icon={faEdit} />
        </div>
        <div className={cx('title')}>Edit</div>
      </div>
      <div className={cx('item')} onClick={() => showConfirm(true)}>
        <div className={cx('icon')}>
          <FontAwesomeIcon icon={faTrash} />
        </div>
        <div className={cx('title')}>Delete</div>
      </div>
    </div>
  );
}

export default MenuRightPlaylist;
