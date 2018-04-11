import axios from 'axios';

export const insertPhotoToGallery = (imageSrc, username) => (dispatch) => {
  axios.post('https://api.kairos.com/enroll', {
    gallery_name: 'newRoomManagerGallery',
    image: imageSrc,
    subject_id: username,
  }, {
    headers: {
      app_id: process.env.REACT_APP_KAIRO_APP_ID,
      app_key: process.env.REACT_APP_KAIRO_KEY,
    },
  }).then((response) => {
    alert(JSON.stringify(response));
    // this.props.registerUser(response.data);
  })
    .catch(err => alert(err));
};

export const clearGallery = () => (dispatch) => {
  axios.post('https://api.kairos.com/gallery/remove', {
    gallery_name: 'newRoomManagerGallery',
  }, {
    headers: {
      app_id: process.env.REACT_APP_KAIRO_APP_ID,
      app_key: process.env.REACT_APP_KAIRO_KEY,
    },
  }).then((response) => {
    alert('Gallery has been reset. Feel free to register now');
  });
};

export const comparePhoto = imageSrc => (dispatch) => {
  axios.post('https://api.kairos.com/recognize', {
    gallery_name: 'newRoomManagerGallery',
    image: imageSrc,
  }, {
    headers: {
      app_id: process.env.REACT_APP_KAIRO_APP_ID,
      app_key: process.env.REACT_APP_KAIRO_KEY,
    },
  }).then((response) => {
    alert(JSON.stringify(response.data.images[0].candidates[0].subject_id));
    // this.props.recognizeUser(response.data);
  }).catch((error) => {
    alert(JSON.stringify(error));
  });
};
