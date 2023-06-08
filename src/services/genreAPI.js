import axiosClient from '~/utils/axiosClient';

const genresAPI = {
  getAll: (token) => {
    const url = '/genre?all=true';
    return axiosClient(token).get(url);
  },
};

export default genresAPI;
