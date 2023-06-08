import { createSlice } from '@reduxjs/toolkit';
// import { current } from '@reduxjs/toolkit';

const initState = {
  action: 'No Action',
  song: null,
  listSongs: null,
  loop: false,
  random: false,
  favorite: false,
  playlist: -1,
};

const music = createSlice({
  name: 'music',
  initialState: initState,
  reducers: {
    noAction: (state, action) => {
      return initState;
    },
    playMusic: (state, action) => {
      const newState = {
        ...state,
        action: 'Play',
        song: action.payload.song || state.song,
        listSongs: action.payload.listSongs.data || state.listSongs,
        favorite: action.payload.favorite || false,
        playlist: action.payload.playlist || -1,
      };
      return newState;
    },
    nextSong: (state, action) => {
      // console.log(current(state));
      let index = 0;
      const currentList = state.listSongs;
      for (let i = 0; i < currentList.length; i++) {
        if (state.song.id === currentList[i].id) {
          index = i;
          break;
        }
      }
      let random = Math.floor(Math.random() * currentList.length);
      if (random === index) {
        if (index !== currentList.length - 1) random += 1;
        else random = 0;
      }
      const newState = {
        ...state,
        action: 'Next',
        song: state.random
          ? currentList[random]
          : index === currentList.length - 1
          ? currentList[0]
          : currentList[index + 1],
      };
      return newState;
    },
    previousSong: (state, action) => {
      let index = -1;
      const currentList = state.listSongs;
      for (let i = 0; i < currentList.length; i++) {
        if (state.song.id === currentList[i].id) {
          index = i;
        }
      }
      const newState = {
        ...state,
        action: 'Next',
        song: index === 0 ? currentList[currentList.length - 1] : currentList[index - 1],
      };
      return newState;
    },
    loopSong: (state, action) => {
      const newState = {
        ...state,
        action: 'Loop',
        loop: !state.loop,
      };
      return newState;
    },
    randomSong: (state, action) => {
      const newState = {
        ...state,
        action: 'Random',
        random: !state.random,
      };
      return newState;
    },
    updateListSong: (state, action) => {
      if (action.payload.updateDelete) {
        const listRemoveId = action.payload.listRemoveId;
        if (state.listSongs !== null) {
          const currentList = [...state.listSongs];
          const filterList = currentList.filter((itemA) => listRemoveId.some((itemB) => itemB !== itemA.id));
          const newState = {
            ...state,
            action: 'Update',
            listSongs: filterList,
          };
          return newState;
        }
      } else {
        const newSong = action.payload.newSong;
        if (state.listSongs !== null) {
          const currentList = [...state.listSongs];
          const isExistSong = currentList.some((x) => x.id === newSong.id);
          const newState = {
            ...state,
            action: 'Update',
            listSongs: !isExistSong ? [action.payload.newSong, ...state.listSongs] : state.listSongs,
          };
          return newState;
        }
      }
    },
  },
});
const { reducer, actions } = music;
export const { noAction, playMusic, nextSong, previousSong, loopSong, randomSong, updateListSong } = actions;
export default reducer;
