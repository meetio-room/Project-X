import React from 'react';
import './CalendarItem.css';
/**
 * Use: <CalendarItem calendarId=""clicked={event}/>
 * @param {object} props contains all attr for component
 * @returns {component} stateless react component
 */
const calendarItem = props => (
  <div className = "CalendarItem" onClick = { props.clicked } >
    <div className = "calendarName"> { props.calendarName } </div>
    <div className = "calendarId" > { props.calendarId } </div>
  </div>
);

export default calendarItem;
