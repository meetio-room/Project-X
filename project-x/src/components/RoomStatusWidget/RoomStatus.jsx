import React from 'react';
import moment from 'moment';
import './RoomStatus.css';
import { getClock, getTimeString } from '../../service/util';

/**
 * Use: <RoomStatus status="" eventName="" timeEventBegin="" timeEventFinish="" description="" currentTime="" timeToNextEvent="" clicked={} BtnName="" />
 * Props: 
 *  {string} status - status of the room ('Available', 'Reserved' or 'Busy') 
 *  {string} eventName -  name of current event
 *  {string} timeToNextEvent -  time to next event in minutes
 *  {string} timeEventBegin -  start time of current event
 *  {string} timeEventFinish -  end time of current event
 *  {string} description -  description of current event(author, some about event)
 *  {string} BtnName - name for bottom button
 */
const roomStatus = props => {
  let statusText = '';
  if ( props.status === 'Available' ) {
    statusText = props.status; 
  } else if ( props.status === 'Reserved' ) {
    statusText = 'Available'; 
  } else if ( props.status === 'Busy' ) {
    statusText = props.eventName;
  }

  let timeToEvent = '';
  let time = props.timeToNextEvent;

  if ( getTimeString(props.timeToNextEvent) === '0' ) {
    timeToEvent = 'less than 1 minute';
  } else if ( getTimeString(props.timeToNextEvent)  === '- :-'  || time > 864e5 ) {
    timeToEvent = 'free for today';
  } else {
    timeToEvent = (<span>the nearest time in <br/>{`${getTimeString(props.timeToNextEvent).replace( ':', 'h ' )} min`}</span> );
  }

  let tToEnd = props.timeEventFinish - moment();
  let timeToFinish = getTimeString(tToEnd).replace(':', 'h ');
  if(tToEnd > 1000){
    if( timeToFinish.trim() === '0' ){
      let temp = (tToEnd / 1000).toFixed();
      if( temp >= 1) timeToFinish = temp + ' seconds';
      else timeToFinish = 0 + ' seconds';
    } else timeToFinish = timeToFinish + ' minutes';
  } else if (isNaN(tToEnd) || tToEnd < 0) {
    timeToFinish = 0;
  }
 

  return (
    <div className = "RoomStatus" >
      <div className = { `header header-${props.status}`} >
        <div className = { `container container-${props.status}`} >
          <div className = { `status status-${props.status}`} > {statusText}</div>
          { props.status === 'Busy' ?
            <div>
              <div className = "EventDuration" >
                { `will finish in ${timeToFinish}` }
              </div>
            </div>
            : <div>
              <div className = "EventStart" >
                { timeToEvent }
              </div>
              <div className = { `arrow arrow-${props.status}`} > &raquo; </div>
            </div>
          }
        </div>
      </div>

      <div className = { `footer footer-${props.status}`} >
        <div className = "container" >
         <div className = "clock" > { getClock(props.currentTime) } </div>
          <button
            to = "/newEvent"
            onClick = { props.clicked } 
            className = { `btn btn-${props.status}`}
          >
            { props.BtnName }
          </button>  
        </div>
      </div>
    </div>
  );
};
export default roomStatus;
