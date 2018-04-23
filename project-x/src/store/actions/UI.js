import { loadEvents } from './calendar';

const setAvailableRoom = timeToEvent => ({
  type: 'SET_AVAILABLE_ROOM',
  payload: {
    status: 'Available',
    timeStart: '',
    eventName: '',
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
    timeEnd: '',
    timeToNextEvent: timeToEvent,
  },
});

const setBusyRoom = (event, timeStart, timeEnd) => ({
  type: 'SET_BUSY_ROOM',
  payload: {
    status: 'Busy',
    eventName: event.name,
    timeStart,
    timeEnd,
    BtnName: 'View',
  },
});

const deleteEventFromStore = id => ({
  type: 'DELETE_EVENT',
  payload: id,
});

export const showSpinner = show => ({
  type: 'SHOW_SPINNER',
  payload: show,
});

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
    dispatch(loadEvents(localStorage.getItem('accessToken'), localStorage.getItem('calendarId')));
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
