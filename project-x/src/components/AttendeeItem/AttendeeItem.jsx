import React from 'react';
import './AttendeeItem.css';

/**
 * Use: <attendeeItem img="" name=""/>
 */
const attendeeItem = props => (
  <div className="AttendeeItem">
    <img src={props.img} alt="" />
    <div className="AttendeeItem-name">{props.name}</div>
  </div>
);
export default attendeeItem;
