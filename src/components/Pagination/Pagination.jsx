import styles from './Pagination.module.scss';

import React from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Pagination({ totalPages, currentPage, setCurrentPage }) {
  return (
    <div className={cx('pagination')}>
      {totalPages.map(
        (e, i) =>
          (i === 0 ||
            (i === 1 && currentPage < 4) ||
            (i === 2 && currentPage < 5) ||
            (i === 3 && currentPage < 6) ||
            (i === currentPage - 2 && i > 3) ||
            (i === currentPage - 1 && i > 3) ||
            (i === currentPage && i < totalPages.length - 1) ||
            (i === totalPages.length - 4 && currentPage >= totalPages.length - 4) ||
            (i === totalPages.length - 3 && currentPage >= totalPages.length - 3) ||
            (i === totalPages.length - 2 && currentPage >= totalPages.length - 2) ||
            i === totalPages.length - 1) && (
            <div key={i} className={cx('wrapper-sub')}>
              {currentPage <= totalPages.length - 3 && i === totalPages.length - 1 && totalPages.length > 5 && (
                <FontAwesomeIcon icon={faEllipsis} className={cx('icon-more')} />
              )}
              <div
                key={i}
                className={currentPage === e + 1 ? cx('page-choose') : cx('page-button')}
                onClick={() => setCurrentPage(i + 1)}
              >
                <div className={cx('page-text')}>{e + 1}</div>
              </div>
              {currentPage >= 4 && i === 0 && totalPages.length > 5 && (
                <FontAwesomeIcon icon={faEllipsis} className={cx('icon-more')} />
              )}
            </div>
          ),
      )}
    </div>
  );
}

export default Pagination;
