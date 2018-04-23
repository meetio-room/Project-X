import axios from 'axios';
import Device from '../../device';

export const insertPhotoToGallery = (imageSrc, username) => () => {
  axios.post('https://api.kairos.com/enroll', {
    gallery_name: 'newRoomManagerGallery',
    image: imageSrc,
    subject_id: username,
  }, {
    headers: {
      app_id: process.env.REACT_APP_KAIRO_APP_ID,
      app_key: process.env.REACT_APP_KAIRO_KEY,
    },
  }).then(() => {
    Device.showToast('user added!');
  });
};

export const clearGallery = () => () => {
  axios.post('https://api.kairos.com/gallery/remove', {
    gallery_name: 'newRoomManagerGallery',
  }, {
    headers: {
      app_id: process.env.REACT_APP_KAIRO_APP_ID,
      app_key: process.env.REACT_APP_KAIRO_KEY,
    },
  }).then(() => {
    Device.showAlert('Gallery has been reset.\nFeel free to register now');
  });
};

export const comparePhoto = imageSrc => () => axios.post(
  'https://api.kairos.com/recognize',
  {
    gallery_name: 'newRoomManagerGallery',
    image: imageSrc,
  }, {
    headers: {
      app_id: process.env.REACT_APP_KAIRO_APP_ID,
      app_key: process.env.REACT_APP_KAIRO_KEY,
    },
  },
).then(response => response.data.images[0].candidates[0].subject_id);
