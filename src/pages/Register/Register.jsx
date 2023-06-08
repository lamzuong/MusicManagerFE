/* eslint-disable no-useless-escape */
/* eslint-disable jsx-a11y/alt-text */
import styles from './Register.module.scss';
import { Context } from '~/context/Provider';
import userAPI from '~/services/userAPI';

import React, { useContext, useState } from 'react';
import classNames from 'classnames/bind';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Spinner } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Register() {
  const navigate = useNavigate();
  const { dispatch } = useContext(Context);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [duplicate, setDuplicate] = useState(false);

  const handleLoading = (children) => {
    setTimeout(children, 1000);
  };

  const isEmpty = () => {
    return username === '' && password === '' && repassword === '';
  };
  const checkUsername = () => {
    const regex = /^\w{5,}$/;
    if (!regex.test(username)) return false;
    if (duplicate) return false;
    return true;
  };
  const checkPassword = () => {
    const regex = /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;
    return regex.test(password);
  };
  const checkRepass = () => {
    return password === repassword;
  };

  const handleRegister = async () => {
    setLoading(true);
    setFirstTime(false);

    if (isEmpty()) {
      setLoading(false);
      return;
    } else {
      try {
        const res = await userAPI.register({
          username: username,
          password: password,
          role: 'USER',
        });
        localStorage.setItem('token', res.data);
        const user = await userAPI.getCurrentUser(res.data);
        dispatch({ type: 'LOGIN', payload: user.data });
        handleLoading(() => navigate('/songs'));
      } catch (error) {
        handleLoading(() => setLoading(false));
        let message = error.response.data;
        let status = error.response.status;
        console.log('Register failed: ' + message);
        setDuplicate(status === 409 ? true : false);
      }
    }
  };

  return (
    <div className={cx('wrapper')}>
      <img src={require('~/assets/images/background.jpg')} className={cx('background')} />
      <div className={cx('view-login')}>
        <div className={cx('header')}>
          <img src={require('~/assets/images/logoTMA.png')} className={cx('logo')} />
          <div className={cx('title')}>Fill out your information</div>
        </div>

        <Form>
          <FormGroup>
            <Label>
              Username
              <span className={cx('note')}>(At least 5 characters just only includes word, number)</span>
            </Label>
            <Input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              invalid={(!checkUsername() || username === '') && !firstTime}
            />
            <FormFeedback>
              {username.trim() === ''
                ? 'Username must not be empty'
                : username.trim().length < 5
                ? 'Username must have at least 5 character includes word and number'
                : 'Please choose other username'}
            </FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label>
              Password
              <span className={cx('note')}>
                (At least 8 characters and have lowercase, uppercase, number, special character)
              </span>
            </Label>
            <Input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              invalid={(!checkPassword() || password === '') && !firstTime}
            />
            <FormFeedback>Please set password stronger as instructed above</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label>Re-Password</Label>
            <Input
              type="password"
              onChange={(e) => setRepassword(e.target.value)}
              value={repassword}
              invalid={(!checkRepass() || repassword === '') && !firstTime}
            />
            <FormFeedback>Re-Password and Password don't match </FormFeedback>
          </FormGroup>
          {loading && (
            <div className={cx('view-spinner')}>
              <Spinner color="primary" />
            </div>
          )}
          <Button color="primary" className={cx('button')} onClick={handleRegister}>
            Register
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Register;
