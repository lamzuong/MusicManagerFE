/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import styles from './Profile.module.scss';
import { Context } from '~/context/Provider';
import { convertDate, noAvatarLink, parseToDate } from '~/global/functionGlobal';

import { faCameraRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, FormGroup, Input, Label, Spinner } from 'reactstrap';
import userAPI from '~/services/userAPI';
import { useNavigate } from 'react-router-dom';
import cloudinaryAPI from '~/services/cloudinaryAPI';

const cx = classNames.bind(styles);

function ProfilePage() {
  const { user, dispatch } = useContext(Context);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [imgCloudinary, setImgCloudinary] = useState(null);
  const [change, setChange] = useState(false);

  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name !== null ? user.name : '');
  const [gender, setGender] = useState(user.gender);
  const [birthday, setBirthday] = useState(user.birthday !== null ? parseToDate(user.birthday) : null);

  const [loading, setLoading] = useState(false);
  var blob = window.URL || window.webkitURL;
  const handleChangeImage = (e) => {
    var target = e.target || e.srcElement;
    if (target.value.length !== 0) {
      setAvatar(blob.createObjectURL(e.target.files[0]));
      setImgCloudinary(e.target.files[0]);
    }
  };
  useEffect(() => {
    if (
      avatar !== user.avatar ||
      name !== user.name ||
      gender !== user.gender ||
      (birthday != null && birthday.getTime() !== parseToDate(user.birthday).getTime())
    ) {
      if (name !== '' && birthday !== null && gender !== null) setChange(true);
    } else {
      setChange(false);
    }
  }, [avatar, name, gender, birthday]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let resImg = null;
      if (avatar !== user.avatar) {
        resImg = await cloudinaryAPI.addImage(imgCloudinary);
      }

      const res = await userAPI.update(token, user.id, {
        avatar: resImg === null ? avatar : resImg.data.url,
        name: name,
        gender,
        birthday: convertDate(birthday),
      });
      dispatch({ type: 'UPDATE', payload: res.data });
      setLoading(false);
      navigate('/songs');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={cx('wrapper')}>
      <div>
        <div className={cx('wrapper-avatar')}>
          <img src={avatar || noAvatarLink} className={cx('avatar')} />
        </div>
        <input type="file" id="img" accept="image/*" onChange={handleChangeImage} />
        <label htmlFor="img" className={cx('wrapper-icon')}>
          <FontAwesomeIcon icon={faCameraRotate} className={cx('icon-camera')} />
        </label>
      </div>
      <FormGroup className={cx('form-group')}>
        <Label className={cx('label')}>Name</Label>
        <Input className={cx('input')} onChange={(e) => setName(e.target.value)} value={name} />
      </FormGroup>
      <FormGroup className={cx('form-group')}>
        <Label className={cx('label')}>Gender</Label>
        <Input
          className={cx('radio')}
          name="radio1"
          type="radio"
          defaultChecked={gender === 'Male'}
          onClick={() => setGender('Male')}
        />
        <Label check>Male</Label>
        <Input
          className={cx('radio')}
          name="radio1"
          type="radio"
          defaultChecked={gender === 'Female'}
          onClick={() => setGender('Female')}
        />
        <Label check>Female</Label>
      </FormGroup>
      <FormGroup className={cx('form-group')}>
        <Label className={cx('label')}>Birthday</Label>
        <DatePicker
          className={cx('calendar')}
          dateFormat="dd/MM/yyyy"
          selected={birthday}
          onChange={(date) => setBirthday(date)}
        />
      </FormGroup>
      {/* Spinner */}
      {loading && (
        <div className={cx('view-spinner')}>
          <Spinner color="primary" />
        </div>
      )}
      <Button color="success" onClick={handleSubmit} disabled={!change}>
        Save
      </Button>
    </div>
  );
}

export default ProfilePage;
