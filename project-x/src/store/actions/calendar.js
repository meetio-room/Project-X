import axios from 'axios';
import moment from 'moment';
import Device from '../../device';
import store from '../store';
import * as config from './../../config';
import { showSpinner } from './UI';
import { refreshToken } from './auth';

/**
*  Select current calendar by id
* @param {string} id - calendar id
*/
export const selectCalendar = id => ({
  type: 'SELECT_CALENDAR',
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

const saveCalendarEvents = events => ({
  type: 'LOAD_CALENDAR_EVENTS',
  payload: events,
});

const saveCalendar = calendar => ({
  type: 'SAVE_CALENDAR',
  payload: calendar,
});

export const loadCalendarsFromGoogle = accessToken => (dispatch) => {
  dispatch(showSpinner(true));
  axios.get(`${config.GOOGLE_CALENDAR_URL}/users/me/calendarList?access_token=${accessToken}`)
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
      Device.showAlert('Something went wrong!\nPlease re-run the program!');
    });
};

/**
* Load future events for special calendar
* @param {string} calendarId - id of google calendar
* @param {string} access_token - user token for google api
* @returns { action } dispatch action
*/
export const loadEvents = (calendarId, accessToken) => (dispatch) => {
  const curTime = encodeURIComponent(moment().format());
  const maxTime = encodeURIComponent(moment().add(14, 'days').format());
  axios.get(`${config.GOOGLE_CALENDAR_URL}/calendars/${calendarId}/events?access_token=${accessToken}&singleEvents=true&timeMin=${curTime}&timeMax=${maxTime}`)
    .then((res) => { // get events from google
      const result = res.data;
      const calendarEvents = [];
      const curDate = new Date();
      result.items.forEach((e) => { // events
        if (e.end) {
          const endDatetime = Date.parse(e.end.dateTime);
          const attendees = e.attendees ?
            e.attendees.filter(a => a.responseStatus === 'accepted' && !a.resource)
            : [];
          if (endDatetime > curDate) {
            const event = {
              name: e.summary,
              id: e.id,
              start: e.start.dateTime,
              end: e.end.dateTime,
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
          a.name = a.email.split('@')[0].replace('.', ' ');
          if (user) {
            axios.get(`https://people.googleapis.com/v1/people/${user.userID}?personFields=photos&key=${process.env.REACT_APP_GOOGLE_API_KEY}`)
              .then((response) => {
                const imgUrl = response.data.photos
                  ? response.data.photos[0].url
                  : 'https://res.cloudinary.com/demo/image/upload/w_100,h_100,c_thumb,g_face,r_20,d_avatar.png/non_existing_id.png'; // default image
                a.img = imgUrl;
              });
          }
        });
      }
      return events;
    })
    .then(events => dispatch(saveCalendarEvents(events)))
    .catch(() => dispatch(refreshToken()));
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
    axios.post(`${config.GOOGLE_CALENDAR_URL}/calendars`, data, headers)
      .then((res) => {
        dispatch(saveCalendar({
          id: res.data.id,
          name: res.data.summary,
        }));
      })
      .catch(() => Device.showAlert('Please enable network connection!'));
  };
};

/**
* add event to google calendar
* @param {object} event -- describe event for calendar
*  event={
  *   start:"",
  *   end:"",
  *   summary: ""
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
    attendees: [],
    summary: event.summary || 'Event',
  };
  if (event.creator) {
    data.attendees.push({
      email: event.creator,
      responseStatus: 'accepted',
    });
  }
  const headers = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return (dispatch) => {
    axios.post(`${config.GOOGLE_CALENDAR_URL}/calendars/${calendarId}/events`, data, headers)
      .then(() => {
        Device.showToast('Event added!');
        dispatch(loadEvents(calendarId, accessToken));
      })
      .catch(() => Device.showAlert('Event doesn`t created\nPlease re-run the program!'));
  };
};
