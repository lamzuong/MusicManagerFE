import React from 'react';
import { faGratipay } from '@fortawesome/free-brands-svg-icons';
import { faCompactDisc, faMusic } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const SidebarData = [
  { path: '/songs', title: 'Songs', icon: <FontAwesomeIcon icon={faMusic} /> },
  { path: '/favorite', title: 'Favorite Songs', icon: <FontAwesomeIcon icon={faGratipay} /> },
  { path: '/playlists', title: 'Playlists', icon: <FontAwesomeIcon icon={faCompactDisc} /> },
];
