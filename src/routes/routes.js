import Login from '~/pages/Login/Login';
import Register from '~/pages/Register/Register';
import FavoritePage from '~/pages/Favorite/FavoritePage';
import SongsPage from '~/pages/Songs/SongsPage';
import ProfilePage from '~/pages/Profile/ProfilePage';
import PlaylistPage from '~/pages/Playlist/PlaylistPage';
import PlaylistSong from '~/pages/PlaylistSong/PlaylistSong';

const routes = [
  { path: '/', component: Login, layout: null },
  { path: '/register', component: Register, layout: null },
  { path: '/songs', component: SongsPage },
  { path: '/favorite', component: FavoritePage },
  { path: '/profile', component: ProfilePage },
  { path: '/playlists', component: PlaylistPage },
  { path: '/playlists/:id', component: PlaylistSong },
];
export default routes;
