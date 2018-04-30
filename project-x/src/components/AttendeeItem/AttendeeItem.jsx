import React from 'react';
import './AttendeeItem.css';

/**
 * Use: <attendeeItem img="" name=""/>
 */
const attendeeItem = props => (
  <div className="AttendeeItem">
    <img src={props.img || 'https://res.cloudinary.com/demo/image/upload/w_100,h_100,c_thumb,g_face,r_20,d_avatar.png/non_existing_id.png'} alt="" />
    <div className="AttendeeItem-name">{props.name}</div>
  </div>
);
export default attendeeItem;
