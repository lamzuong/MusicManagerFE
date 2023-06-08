import axiosClient from '~/utils/axiosClient';

const songsAPI = {
  getSongByUserId: (
    token,
    page = 1,
    limit = 5,
    favorite = false,
    sortBy = 'modified_at',
    direction = 'DESC',
    all = false,
  ) => {
    const url = `/song/user?page=${page}&limit=${limit}&sortBy=${sortBy}&direction=${direction}&favorite=${favorite}&all=${all}`;
    return axiosClient(token).get(url);
  },
  searchSong: (
    token,
    keyword,
    page = 1,
    limit = 5,
    favorite = false,
    sortBy = 'modified_at',
    direction = 'DESC',
    all = false,
  ) => {
    const url = `/song/search?keyword=${keyword}&page=${page}&limit=${limit}&sortBy=${sortBy}&direction=${direction}&favorite=${favorite}&all=${all}`;
    return axiosClient(token).get(url);
  },

  deleteSongById: (token, id) => {
    const url = `/song/${id}`;
    return axiosClient(token).delete(url);
  },

  addToFavoriteSong: (token, params) => {
    const url = `/song/add_favorite`;
    return axiosClient(token).put(url, params);
  },

  removeFromFavoriteSong: (token, params) => {
    const url = `/song/remove_favorite`;
    return axiosClient(token).put(url, params);
  },

  add: (token, params) => {
    const url = `/song`;
    return axiosClient(token).post(url, { ...params });
  },

  update: (token, id, params) => {
    const url = `/song/${id}`;
    return axiosClient(token).put(url, { ...params });
  },

  delete: (token, id) => {
    const url = `/song/${id}`;
    return axiosClient(token).delete(url);
  },
};

export default songsAPI;
