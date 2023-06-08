import { toast } from 'react-toastify';

const optionsArtist = (artists) => {
  let array = [];
  for (const artist of artists) {
    let value = { ...artist };
    let label = artist.name;
    array.push({ value, label });
  }
  return array;
};
const optionsGenre = (genres) => {
  let array = [];
  for (const genre of genres) {
    let value = { ...genre };
    let label = genre.name;
    array.push({ value, label });
  }
  return array;
};
const optionsPage = () => {
  let array = [];
  let options = [1, 5, 10, 20, 50, 100];
  for (let i = 0; i <= options.length; i++) {
    array.push({ value: options[i], label: options[i] });
  }
  return array;
};
const calcTotalPages = (res, limit = 5) => {
  const totalRows = res;
  const totalPages = Math.floor(totalRows / limit) + (totalRows % limit !== 0 ? 1 : 0);
  return totalPages;
};
const convertDate = (date) => {
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Months start at 0!
  let dd = date.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  return dd + '/' + mm + '/' + yyyy;
};
const parseToDate = (dateString) => {
  var dateParts = dateString.split('/');
  return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
};
const notify = (string) => {
  toast.success(string, {
    position: toast.POSITION.TOP_RIGHT,
  });
};

const noAvatarLink = 'https://res.cloudinary.com/dicpaduof/image/upload/v1665828418/Other/noAvatar_c27pgy.png';
const mp3Link = 'https://res.cloudinary.com/dicpaduof/image/upload/v1677058297/Other/mp3_jkdiwx.png';
const baseUrl = 'http://localhost:3000';

export { noAvatarLink, mp3Link, baseUrl };
export { optionsArtist, optionsGenre, optionsPage };
export { calcTotalPages, notify };
export { convertDate, parseToDate };
