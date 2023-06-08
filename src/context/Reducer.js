const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      };
    case 'UPDATE':
      return {
        ...state,
        user: action.payload,
      };
    case 'RERENDER':
      return {
        ...state,
        rerenderSongPage: !state.rerenderSongPage,
      };
    case 'LIST_DELETE':
      const id = action.payload;
      const isExist = state.listDelete.includes(id);
      let newList = [];
      if (id === -1) {
        return {
          ...state,
          listDelete: newList,
        };
      }
      if (isExist) {
        let listTemp = [...state.listDelete];
        newList = listTemp.filter((x) => x !== id);
      } else {
        newList = [...state.listDelete, id];
      }
      return {
        ...state,
        listDelete: newList,
      };
    case 'LIST_REMOVE':
      const idFavorite = action.payload;
      const isExistFavorite = state.listRemove.includes(idFavorite);
      let listRemove = [];
      if (idFavorite === -1) {
        return {
          ...state,
          listRemove: listRemove,
        };
      }
      if (isExistFavorite) {
        let listTemp = [...state.listRemove];
        listRemove = listTemp.filter((x) => x !== idFavorite);
      } else {
        listRemove = [...state.listRemove, idFavorite];
      }
      return {
        ...state,
        listRemove: listRemove,
      };
    case 'LIST_REMOVE_PLAYLISTS': {
      const idSong = action.payload.idSong;
      const idPlaylists = action.payload.idPlaylists;
      // const isExistPL = state.listRemovePL.includes(idSong);
      let isExistPL = false;
      if (state.listRemovePL) {
        for (const item of state.listRemovePL) {
          if (item.idSong === idSong && item.idPlaylists === idPlaylists) {
            isExistPL = true;
          }
        }
      }

      let listRemovePL = [];
      if (isExistPL) {
        let listTemp = [...state.listRemovePL];
        for (let i = 0; i < listTemp.length; i++) {
          if (listTemp[i].idSong === idSong && listTemp[i].idPlaylists === idPlaylists) {
          } else listRemovePL.push({ idSong: listTemp[i].idSong, idPlaylists: listTemp[i].idPlaylists });
        }
      } else {
        if (state.listRemovePL) listRemovePL = [...state.listRemovePL, { idSong, idPlaylists }];
        else listRemovePL.push({ idSong, idPlaylists });
      }
      return {
        ...state,
        listRemovePL: listRemovePL,
      };
    }
    case 'LOGOUT':
      return {
        user: null,
        rerenderSongPage: false,
        listDelete: [],
        listRemove: [],
        searchValue: '',
        url: window.location.href,
      };
    case 'SEARCH':
      return {
        ...state,
        searchValue: action.payload,
        url: window.location.href,
      };
    default:
      return state;
  }
};
export default AuthReducer;
