import axios from 'axios';
import Device from '../../device';
import store from '../store';

/**
*  Select current calendar by id
* @param {string} id - calendar id
*/
export const selectCalendar = id => ({
  type: 'SELECT_CALENDAR',
  payload: id,
});
const deleteEventFromStore = id => ({
  type: 'DELETE_EVENT',
  payload: id,
});

/**
* Save calendars id to store
* @param {Array} calendarsId -- Array of calendar`s id
*/
const createCalendarsList = calendarsId => ({
  type: 'CREATE_CALENDARS_LIST',
  payload: calendarsId,
});

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

const setAvailableRoom = timeToEvent => ({
  type: 'SET_AVAILABLE_ROOM',
  payload: {
    status: 'Available',
    timeStart: '',
    eventName: '',
    description: '',
    timeEnd: '',
    BtnName: 'Quick book for now!',
    timeToNextEvent: timeToEvent,
  },
});

const setReservedRoom = timeToEvent => ({
  type: 'SET_RESERVED_ROOM',
  payload: {
    status: 'Reserved',
    timeStart: '',
    BtnName: 'Quick check-in',
    eventName: '',
    description: '',
    timeEnd: '',
    timeToNextEvent: timeToEvent,
  },
});

const setBusyRoom = (event, timeStart, timeEnd) => ({
  type: 'SET_BUSY_ROOM',
  payload: {
    status: 'Busy',
    eventName: event.name,
    description: event.description,
    timeStart,
    timeEnd,
    BtnName: 'View',
  },
});

const showSpinner = show => ({
  type: 'SHOW_SPINNER',
  payload: show,
});
const saveCalendarEvents = events => ({
  type: 'LOAD_CALENDAR_EVENTS',
  payload: events,
});

const saveCalendar = calendar => ({
  type: 'SAVE_CALENDAR',
  payload: calendar,
});
const saveEvent = event => ({
  type: 'SAVE_EVENT',
  payload: event,
});

const errorHandler = error => ({
  type: 'ERROR_HANDLER',
  payload: error,
});

const saveUsersTOStoreFromDB = users => ({
  type: 'SAVE_USERS_ID',
  payload: users,
});

const loadCalendarsFromGoogle = accessToken => (dispatch) => {
  dispatch(showSpinner(true));
  axios.get(`https://www.googleapis.com/calendar/v3/users/me/calendarList?access_token=${accessToken}`)
    .then((res) => {
      const result = res.data.items;
      const calendars = [];
      result.forEach((element) => {
        calendars.push({
          id: element.id,
          name: element.summary,
        });
      });
      dispatch(createCalendarsList(calendars));
    }).catch(() => {
      dispatch(showSpinner(false));
      dispatch(errorHandler('Something went wrong!\nPlease re-run the program!'));
    });
};

export const saveUserToDB = (userID, email) => {
  axios.post('https://roommanager-44c77.firebaseio.com/users.json', {
    email,
    userID,
  });
};
export const readUsersFromDb = () => (dispatch) => {
  axios.get('https://roommanager-44c77.firebaseio.com/users.json')
    .then((response) => {
      const users = [];
      for (const key in response.data) {
        const user = response.data[key];
        users.push(user);
      }
      dispatch(saveUsersTOStoreFromDB(users));
    });
};

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

/**
 * Load current event from store and update room status
 * @param { object } event first event from list
 * @returns { action } dispatch action
 */
export const loadCurrentEvent = event => (dispatch) => {
  const currentTime = new Date().valueOf();
  if (!event) {
    dispatch(setAvailableRoom(' - '));
  } else if (Date.parse(event.end) < currentTime) {
    dispatch(deleteEventFromStore(event.id));
  } else {
    const timeToEvent = Date.parse(event.start) - currentTime;

    if (Date.parse(event.start) > currentTime) {
      if (timeToEvent > 15 * 60 * 1000) {
        dispatch(setAvailableRoom(timeToEvent));
      } else {
        dispatch(setReservedRoom(timeToEvent));
      }
    } else {
      const timeStart = Date.parse(event.start);
      const timeEnd = Date.parse(event.end);
      dispatch(setBusyRoom(event, timeStart, timeEnd));
    }
  }
};

/**
* Load future events for special calendar
* @param {string} calendarId - id of google calendar
* @param {string} access_token - user token for google api
* @returns { action } dispatch action
*/
export const loadEvents = (calendarId, accessToken) => (dispatch) => {
  axios.get(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?access_token=${accessToken}`)
    .then((res) => { // get events from google
      const result = res.data;
      const calendarEvents = [];
      const curDate = new Date();
      result.items.forEach((e) => { // events
        if (e.end) {
          const endDatetime = Date.parse(e.end.dateTime);
          const attendees = e.attendees ?
            e.attendees.filter(a => a.responseStatus === 'accepted' && !a.self)
            : [{ email: e.creator.email }];
          if (endDatetime > curDate) {
            const event = {
              name: e.summary,
              id: e.id,
              start: e.start.dateTime,
              end: e.end.dateTime,
              description: e.description,
              attendees,
            };
            calendarEvents.push(event);
          }
        }
      });
      calendarEvents.sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
      return calendarEvents;
    })
    .then((events) => { // load attendees image url for first event
      if (events.length > 0) {
        events[0].attendees.forEach((a) => {
          const user = store.getState().calendar.people.filter(u => u.email === a.email)[0];
          if (user) {
            a.name = a.email.split('@')[0].replace('.', ' ');
            axios.get(`https://people.googleapis.com/v1/people/${user.userID}?personFields=photos&key=${process.env.REACT_APP_GOOGLE_API_KEY}`)
              .then((response) => {
                const imgUrl = response.data.photos ? response.data.photos[0].url : '';
                a.img = imgUrl;
              });
          }
        });
        dispatch(saveCalendarEvents(events));
      }
    });
};

/**
*  Create a new google Calendar
* @param {string} calendarName - name of new Calendar
* @param {string} accessToken -user token for google api
*/
export const createCalendar = (calendarName, accessToken) => {
  const data = {
    summary: calendarName,
  };
  const headers = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return (dispatch) => {
    axios.post('https://www.googleapis.com/calendar/v3/calendars', data, headers)
      .then((res) => {
        dispatch(saveCalendar({
          id: res.data.id,
          name: res.data.summary,
        }));
      })
      .catch(() => dispatch(errorHandler('Please enable network connection!')));
  };
};

/**
* add event to google calendar
* @param {object} event -- describe event for calendar
*  event={
  *   start:"",
  *   end:"",
  *   summary: "",
  *   description: ""
  *  }
  *  @param {string} calendarId - google calendar id
  *  @param {string} access_token - user token for google api
  */
export const createEvent = (event, calendarId, accessToken) => { // should add attendees
  const data = {
    start: {
      dateTime: event.start.format(),
      timeZone: 'Europe/Kiev',
    },
    end: {
      dateTime: event.end.format(),
      timeZone: 'Europe/Kiev',
    },
    description: event.description,
    summary: event.summary || '',
  };
  const headers = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return (dispatch) => {
    axios.post(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, data, headers)
      .then((res) => {
        const newEvent = {
          id: res.data.id,
          name: res.data.summary,
          start: res.data.start.dateTime,
          end: res.data.end.dateTime,
        };
        dispatch(saveEvent(newEvent));
      })
      .catch(() => dispatch(errorHandler('Event doesn`t created\nPlease re-run the program!')));
  };
};
