import axios from 'axios';
import store from '../store';

const saveUsersTOStoreFromDB = users => ({
  type: 'SAVE_USERS_ID',
  payload: users,
});

export const readUsersFromDb = () => (dispatch) => {
  axios.get(`${process.env.REACT_APP_FIREBASE_USER_URL}`)
    .then((response) => {
      const users = [];
      for (const key in response.data) {
        const user = response.data[key];
        users.push(user);
      }
      dispatch(saveUsersTOStoreFromDB(users));
    });
};

/**
 * Create entry in firebase db
 * @param {string} userID -- id from google profile
 * @param {string} email -- user email
 */
export const saveUserToDB = (userID, email) => (dispatch) => {
  const peoples = store.getState().calendar.people.filter(u => u.email === email);
  if (peoples.length === 0) {
    axios.post(`${process.env.REACT_APP_FIREBASE_USER_URL}`, {
      email,
      userID,
    }).then(() => dispatch(readUsersFromDb()));
  }
};

