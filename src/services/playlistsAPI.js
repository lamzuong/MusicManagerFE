import axiosClient from '~/utils/axiosClient';

const playlistsAPI = {
  getAllByUserId: (token) => {
    const url = `/playlist/user?all=true`;
    return axiosClient(token).get(url);
  },
  getByUserId: (token, page) => {
    const url = `/playlist/user?page=${page}`;
    return axiosClient(token).get(url);
  },
  getAllSongByPlaylistId: (token, id) => {
    const url = `/song/playlist/${id}?all=true`;
    return axiosClient(token).get(url);
  },
  getSongByPlaylistId: (token, id, page = 1, limit = 5, sortBy = 'modified_at', direction = 'DESC', all = false) => {
    const url = `/song/playlist/${id}?page=${page}&limit=${limit}&sortBy=${sortBy}&direction=${direction}&all=${all}`;
    return axiosClient(token).get(url);
  },
  searchInPlaylist: (
    token,
    id,
    keyword,
    page = 1,
    limit = 5,
    sortBy = 'modified_at',
    direction = 'DESC',
    all = false,
  ) => {
    const url = `/song/search_in_playlist?playlistId=${id}&keyword=${keyword}&page=${page}&limit=${limit}&sortBy=${sortBy}&direction=${direction}&all=${all}`;
    return axiosClient(token).get(url);
  },
  addSongToPlaylist: (token, playlistId, listIdSong) => {
    const url = `/playlist/add_song/${playlistId}`;
    return axiosClient(token).put(url, listIdSong);
  },
  removeSongInPlaylist: (token, playlistId, listIdSong) => {
    const url = `/playlist/remove_song/${playlistId}`;
    return axiosClient(token).put(url, listIdSong);
  },
  add: (token, params) => {
    const url = `/playlist`;
    return axiosClient(token).post(url, params);
  },
  update: (token, id, params) => {
    const url = `/playlist/${id}`;
    return axiosClient(token).put(url, params);
  },
  delete: (token, id) => {
    const url = `/playlist/${id}`;
    return axiosClient(token).delete(url);
  },
};

export default playlistsAPI;
