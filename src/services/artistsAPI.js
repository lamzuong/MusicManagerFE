import axiosClient from '~/utils/axiosClient';

const artistsAPI = {
  getAll: (token) => {
    const url = '/artist?all=true';
    return axiosClient(token).get(url);
  },
};

export default artistsAPI;
