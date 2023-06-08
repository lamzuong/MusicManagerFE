import axiosClient from '~/utils/axiosClient';
import axiosClientUnauthorize from '~/utils/axiosClientUnauthorize';

const userAPI = {
  login: (params) => {
    const url = '/login';
    return axiosClientUnauthorize.post(url, params);
  },
  register: (params) => {
    const url = '/register';
    return axiosClientUnauthorize.post(url, params);
  },
  getCurrentUser: (token) => {
    const url = '/user/current_user';
    return axiosClient(token).get(url);
  },

  update: (token, id, params) => {
    const url = `/user/${id}`;
    return axiosClient(token).put(url, { ...params });
  },
};

export default userAPI;
