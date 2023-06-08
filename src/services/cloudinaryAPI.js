import axios from 'axios';

const cloudinaryAPI = {
  addImage: async (image) => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'wkabclwe');
    return await axios.post('https://api.cloudinary.com/v1_1/dicpaduof/upload', data);
  },
  addAudio: async (audio) => {
    const data = new FormData();
    data.append('file', audio);
    data.append('upload_preset', 'wrlxmdin');
    return await axios.post('https://api.cloudinary.com/v1_1/dicpaduof/upload', data);
  },
};

export default cloudinaryAPI;
