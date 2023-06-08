import styles from './Input.module.scss';

import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { Spinner } from 'reactstrap';

const cx = classNames.bind(styles);

function Input({
  placeholder,
  valueInit = '',
  setValue,
  icon,
  classWrapper,
  classInput,
  loading = false,
  onFocus = () => {},
}) {
  const [valueInput, setValueInput] = useState(valueInit);
  const changeValue = (e) => {
    setValue(e.target.value);
    setValueInput(e.target.value);
  };
  return (
    <div className={classWrapper || cx('wrapper')}>
      {icon && <div>{icon}</div>}
      <input
        onChange={(e) => changeValue(e)}
        value={valueInput}
        placeholder={placeholder}
        className={classInput || cx('txt-input')}
        onFocus={onFocus}
      />
      {loading && <Spinner color="primary" size="sm" />}
    </div>
  );
}

export default Input;
