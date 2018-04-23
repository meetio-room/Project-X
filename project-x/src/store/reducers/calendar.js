const initialState = {
  allCalendars: [],
  currentCalendar: localStorage.getItem('calendarId') || '',
  currentCalendarEvents: JSON.parse(localStorage.getItem('events')) || [],
  people: [],

  access_token: '',
  loading: false,
  room: {
    status: 'Available',
    timeStart: '',
    eventName: '',
    timeEnd: '',
    BtnName: 'Quick book for now!',
    timeToNextEvent: ' - ',
  },
};

export default function calendar(state = initialState, action) {
  switch (action.type) {
    case 'SELECT_CALENDAR':
    {
      localStorage.setItem('calendarId', action.payload);
      return {
        ...state,
        currentCalendar: action.payload,
      };
    }
    case 'SAVE_CALENDAR':
    {
      const calendars = [...state.allCalendars];
      calendars.push(action.payload);
      return {
        ...state,
        allCalendars: [...calendars],
      };
    }
    case 'CREATE_CALENDARS_LIST':
    {
      return {
        ...state,
        allCalendars: [...action.payload],
        loading: false,
      };
    }
    case 'REFRESH_TOKEN':
    {
      localStorage.setItem('accessToken', action.payload);
      localStorage.setItem('expires_in', action.TTL);
      return {
        ...state,
        access_token: action.payload,
      };
    }
    case 'SET_AVAILABLE_ROOM':
    {
      return {
        ...state,
        room: { ...action.payload },
      };
    }
    case 'SET_RESERVED_ROOM':
    {
      return {
        ...state,
        room: { ...action.payload },
      };
    }
    case 'SET_BUSY_ROOM':
    {
      return {
        ...state,
        room: { ...action.payload },
      };
    }
    case 'SHOW_SPINNER':
    {
      return {
        ...state,
        loading: action.payload,
      };
    }
    case 'DELETE_EVENT':
    {
      const events = [...state.currentCalendarEvents];
      const index = events.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        events.splice(index, 1);
      }
      return {
        ...state,
        currentCalendarEvents: events,
      };
    }
    case 'SAVE_USERS_ID':
    {
      return {
        ...state,
        people: [...action.payload],
      };
    }
    case 'LOAD_CALENDAR_EVENTS':
    {
      const events = [...action.payload];
      let isEventsPresent;
      let isAttendeesPresent;
      if (state.currentCalendarEvents.length !== events.length) {
        isEventsPresent = false;
      } else {
        isEventsPresent = events.every((e, index) => e.id === state.currentCalendarEvents[index].id);
      }
      if (events[0].attendees.length > 0
          && (state.currentCalendarEvents[0] && state.currentCalendarEvents[0].attendees && state.currentCalendarEvents[0].attendees.length > 0)) {
        isAttendeesPresent = events[0].attendees.every((attendee, index) => {
          const storeAttendee = state.currentCalendarEvents[0].attendees[index];
          if (!storeAttendee) {
            return false;
          }
          return storeAttendee.email === attendee.email && storeAttendee.img;
        });
      } else {
        isAttendeesPresent = false;
      }
      if (isEventsPresent && isAttendeesPresent) {
        return state;
      }
      localStorage.setItem('events', JSON.stringify(action.payload));
      return {
        ...state,
        currentCalendarEvents: [...action.payload],
      };
    }
    default:
      return state;
  }
}
