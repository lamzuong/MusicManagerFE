import React, { createContext, useEffect, useReducer } from 'react';
import Reducer from './Reducer';

const INIT_STATE = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  rerenderSongPage: false,
  listDelete: [],
  listRemove: [],
  listRemovePL: [],
  searchValue: '',
  url: window.location.href,
};

const Context = createContext(INIT_STATE);

function Provider({ children }) {
  const [state, dispatch] = useReducer(Reducer, INIT_STATE);
  useEffect(() => {
    localStorage.setItem('user', state.user && JSON.stringify(state.user));
  }, [state.user, state.token]);

  return (
    <Context.Provider
      value={{
        user: state.user,
        rerenderSongPage: state.rerenderSongPage,
        listDelete: state.listDelete,
        listRemove: state.listRemove,
        listRemovePL: state.listRemovePL,
        searchValue: state.searchValue,
        url: state.url,
        dispatch: dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default Provider;
export { Context };
