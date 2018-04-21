import axios from 'axios';

const saveUsersTOStoreFromDB = users => ({
  type: 'SAVE_USERS_ID',
  payload: users,
});

/**
 * Create entry in firebase db
 * @param {string} userID -- id from google profile
 * @param {string} email -- user email
 */
export const saveUserToDB = (userID, email) => {
  axios.post(`${process.env.REACT_APP_FIREBASE_USER_URL}`, {
    email,
    userID,
  });
};
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
