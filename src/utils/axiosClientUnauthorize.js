import axios from 'axios';

const axiosClientUnauthorize = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Origin, X-Auth-Token, Authorization',
  },
});
export default axiosClientUnauthorize;
