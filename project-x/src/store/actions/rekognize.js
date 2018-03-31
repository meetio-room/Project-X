import axios from 'axios';
const APP_ID = '259f785d';
const KEY = '65d0f21dead2effda11fb22e570aca05';

export const insertPhotoToGallery = (imageSrc,username) => {
  return dispatch => {
    axios.post(`https://api.kairos.com/enroll`, {
      gallery_name: 'newRoomManagerGallery',
      image: imageSrc,
      subject_id: username
    }, {
      headers: {
        app_id: APP_ID, 
        app_key: KEY
      }
    }).then((response) => {
      alert(JSON.stringify(response));
      //this.props.registerUser(response.data);
    })
    .catch(err=>alert(err));
  }
 
}

export const clearGallery = () => {
  return dispatch => {
    axios.post(`https://api.kairos.com/gallery/remove`, {
    gallery_name: "newRoomManagerGallery"
    }, {
      headers: {
        app_id: APP_ID,
        app_key: KEY
      }
    }).then((response) => {
      alert('Gallery has been reset. Feel free to register now');
    });
  }
}

export const comparePhoto = imageSrc => {
  return dispatch => {
    axios.post(`https://api.kairos.com/recognize`, {
    gallery_name: 'newRoomManagerGallery',
    image: imageSrc
    }, {
      // enter your secret credentials
      headers: {
        app_id: APP_ID,
        app_key: KEY
      }
    }).then((response) => {
      alert(JSON.stringify(response));
      //this.props.recognizeUser(response.data);
    }).catch((error) => {
     alert(JSON.stringify(error));
    });
  }
}
