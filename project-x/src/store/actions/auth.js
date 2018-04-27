import axios from 'axios';
import Device from '../../device';
import { loadCalendarsFromGoogle } from './calendar';
import { readUsersFromDb } from './firebase';
/**
* Save new token
* @param {string} token -- new Token
* @param {string} TTL - Time to live new token in seconds
*/
const saveToken = (token, TTL) => ({
  type: 'REFRESH_TOKEN',
  payload: token,
  TTL,
});

export const refreshToken = serverCode => (dispatch) => {
  let data = '';
  if (serverCode) {
    data = `client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID
    }&client_secret=${process.env.REACT_APP_GOOGLE_CLIENT_SECRET
    }&grant_type=authorization_code` +
      `&code=${serverCode}`;
  } else if (localStorage.getItem('refreshToken')) {
    data = `client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID
    }&client_secret=${process.env.REACT_APP_GOOGLE_CLIENT_SECRET
    }&grant_type=refresh_token` +
      `&refresh_token=${localStorage.getItem('refreshToken')}`;
  }
  const headers = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  };

  axios.post('https://www.googleapis.com/oauth2/v4/token', data, headers)
    .then((res) => {
      if (res.data.refresh_token) {
        localStorage.setItem('refreshToken', res.data.refresh_token);
      }
      dispatch(saveToken(res.data.access_token, res.data.expires_in));
    });
};

export const login = () => (dispatch) => {
  if (navigator.connection.type === window.Connection.NONE) {
    setTimeout(() => {
      Device.showToast('Please enable network!');
      Device.setMode('MIDDLE_MODE');
      dispatch(login());
    }, 1500);
  } else {
    window.plugins.googleplus.login(
      {
        scopes: 'profile email https://www.googleapis.com/auth/calendar https://www.google.com/calendar/feeds',
        webClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        offline: true,
      },
      (obj) => {
        dispatch(loadCalendarsFromGoogle(obj.accessToken));
        dispatch(refreshToken(obj.serverAuthCode));
        dispatch(readUsersFromDb());
      },
      () => {
        dispatch(login());
      },
    );
  }
};

