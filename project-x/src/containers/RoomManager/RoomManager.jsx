/* global alert */
import React, { Component } from 'react';
import RoomStatus from '../../components/RoomStatusWidget/RoomStatus';
import EventBuilder from '../EventBuilder/EventBuilder';
import { connect } from 'react-redux';
import { loadEvents, loadCurrentEvent, refreshToken } from '../../store/actions/calendar';
import { getClock, getTimeString } from '../../service/util';
import Device from '../../device';
import * as config from '../../config';

class RoomManager extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      currentTime: new Date(),
      isEventBuilderShow: false
    };
    this.timer = null;
    this.clock = null;
  }
  
  onRoomStatusBtnClickHandler = () => {
    this.setEventBuilderVisibility( true );
  }
  setEventBuilderVisibility = show => {
    this.setState( { isEventBuilderShow: show } );
  }

  render() {
    return (
      <div >
        <RoomStatus 
          status = { this.props.room.status } 
          eventName = { this.props.room.eventName } 
          timeEventBegin = { getClock( this.props.room.timeStart ) } 
          timeEventFinish = { getClock( this.props.room.timeEnd ) }
          timeToNextEvent = { getTimeString( this.props.room.timeToNextEvent ) } 
          description = { this.props.room.description }
          currentTime = { getClock( this.state.currentTime ) }
          BtnName = { this.props.room.BtnName }
          clicked = { () => this.onRoomStatusBtnClickHandler() }
        />
        <EventBuilder 
          show = { this.state.isEventBuilderShow }
          hideEventBuilder = { () => this.setEventBuilderVisibility( false ) }
        />

      </div>
    );
  }

  componentDidMount() {
    const that = this;
    const syncStep = 60; 
    this.timer = setInterval( () => {
      if ( !window.cordova.plugins.backgroundMode.isEnabled()){
        window.cordova.plugins.backgroundMode.enable();
      }

      let tokenExpires = localStorage.getItem( 'expires_in' );
      if ( that.props.currentCalendar ) {
        that.props.loadCalenadarEvents( that.props.currentCalendar, that.props.token );
      }
      if ( tokenExpires ) {
        tokenExpires -= syncStep;
        if ( tokenExpires <= 0 ) { // refresh token
          that.props.updateToken();
        }
        localStorage.setItem('expires_in', tokenExpires);
      }

      const time = this.state.currentTime;
      const timeToEvent = Date.parse(that.props.events[0].start)-time;
      if(time.getHours() <= config.SLEEP_MODE.start || time.getHours() >= config.SLEEP_MODE.end ){
        alert('Sleep');
        Device.setMode('SLEEP_MODE');
      } else if ( that.props.room.status === 'Busy' ){
        alert('ACTIVE_MODE');
        Device.setMode('ACTIVE_MODE');
      } else if ( timeToEvent < config.MIDDLE_MODE.timeToStart * 60 * 1000 && timeToEvent > 0 ) {
        alert('MIDDLE_MODE');
        Device.setMode('MIDDLE_MODE');
      } else {
        alert('IDLE_MODE');
        Device.setMode('IDLE_MODE');
      }

    }, syncStep * 1000 );

    this.clock = setInterval( () => { //every seconds
      const t = new Date();
      if ( that.state.currentTime.getMinutes() !== t.getMinutes() ) {
        that.setState( { currentTime: t } );
      }
      that.props.loadCurrentState( that.props.events[0] );
    }, 1000 );
  }
  componentWillUnmount() {
    clearInterval( this.timer );
    clearInterval( this.clock );
  }
}


const mapStateToProps = state => {
  return {
    events: state.calendar.currentCalendarEvents,
    token: state.calendar.access_token,
    currentCalendar: state.calendar.currentCalendar,
    room: state.calendar.room
  };
};
const mapDispatchToProps = dispatch => {
  return {
    loadCalenadarEvents: ( calendarId, token ) => dispatch( loadEvents( calendarId, token ) ),
    loadCurrentState: event => dispatch( loadCurrentEvent( event ) ),
    updateToken: () => dispatch( refreshToken() )
  };
};

export default connect( mapStateToProps, mapDispatchToProps )( RoomManager );
