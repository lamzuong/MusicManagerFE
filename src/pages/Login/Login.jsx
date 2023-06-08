/* eslint-disable jsx-a11y/alt-text */
import styles from './Login.module.scss';
import userAPI from '~/services/userAPI';
import { Context } from '~/context/Provider';

import React, { useContext, useState } from 'react';
import classNames from 'classnames/bind';
import { Button, Form, FormGroup, Input, Label, Spinner } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);

function Login() {
  const navigate = useNavigate();
  const { dispatch } = useContext(Context);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleLoading = (children) => {
    setTimeout(children, 1000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    const checkUser = async () => {
      try {
        const res = await userAPI.login({ username: username, password: password });

        if (res.status === 200) {
          localStorage.setItem('token', res.data);
          const user = await userAPI.getCurrentUser(res.data);
          dispatch({ type: 'LOGIN', payload: user.data });
          setLoading(false);
          handleLoading(() => navigate('/songs'));
        }
      } catch (error) {
        handleLoading(() => {
          setLoading(false);
          setFailed(true);
        });
        console.log('Login failed: ' + error);
      }
    };
    checkUser();
  };
  return (
    <div className={cx('wrapper')}>
      <img src={require('~/assets/images/background.jpg')} className={cx('background')} />
      <div className={cx('view-login')}>
        <div className={cx('header')}>
          <img src={require('~/assets/images/logoTMA.png')} className={cx('logo')} />
          <div className={cx('title')}>Welcome to Music Manager</div>
        </div>

        <Form>
          <FormGroup>
            <Label for="exampleEmail">Username</Label>
            <Input onChange={(e) => setUsername(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label for="exampleEmail">Password</Label>
            <Input type="password" onChange={(e) => setPassword(e.target.value)} />
          </FormGroup>

          {loading ? (
            <div className={cx('view-spinner')}>
              <Spinner color="primary" />
            </div>
          ) : failed ? (
            <div className={cx('login-failed')}>Username or Password is incorrect !!</div>
          ) : null}

          <div className={cx('sub-title')}>
            <div>You don't have account?</div>
            <div className={cx('register')} onClick={() => navigate('/register')}>
              Register now
            </div>
          </div>

          <Button color="primary" type="submit" className={cx('button')} onClick={handleLogin}>
            Sign In
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
