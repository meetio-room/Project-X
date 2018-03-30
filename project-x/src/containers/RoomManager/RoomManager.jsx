/* global alert */
import React, { Component } from 'react';
import RoomStatus from '../../components/RoomStatusWidget/RoomStatus';
import EventBuilder from '../EventBuilder/EventBuilder';
import { connect } from 'react-redux';
import { loadEvents, loadCurrentEvent, refreshToken } from '../../store/actions/calendar';
import { getClock, getTimeString } from '../../service/util';
import Device from '../../device';
import * as config from '../../config';
import Setting from '../Settings/Settings';

class RoomManager extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      currentTime: new Date(),
      isEventBuilderShow: false,
      isSettingsShow: false
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
  onScreenClickHandler = () => {
    Device.setMode('MIDDLE_MODE');
    Device.quinaryClick(()=>{
      this.setState({isSettingsShow: true});
    });
  }
  hideSettings = () => {
    this.setState({isSettingsShow: false});
  }
  
  render() {
    return (
      <div onClick={ this.onScreenClickHandler } >
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
      <Setting show ={this.state.isSettingsShow} hideWindow = {this.hideSettings}/>
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
      if ( that.props.currentCalendar && navigator.connection.type !== window.Connection.NONE ) {
        that.props.loadCalenadarEvents( that.props.currentCalendar, that.props.token );
      }
      if ( tokenExpires ) {
        tokenExpires -= syncStep;
        if ( tokenExpires <= 0 && navigator.connection.type !== window.Connection.NONE ) { // refresh token
          that.props.updateToken();
        }
        localStorage.setItem('expires_in', tokenExpires);
      }
    }, syncStep * 1000 );
    
    this.clock = setInterval( () => { //every seconds
      const time = new Date();
      if ( that.state.currentTime.getMinutes() !== time.getMinutes() ) {
        that.setState( { currentTime: time } );
        const timeToEvent = that.props.events.length>0? Date.parse(that.props.events[0].start)-time : 10e12 ;
        if(time.getHours() < config.SLEEP_MODE.end || time.getHours() >= config.SLEEP_MODE.start ){
          Device.setMode('SLEEP_MODE');
        }  else if ( that.props.room.status === 'Busy' ){
          Device.setMode('ACTIVE_MODE');
        } else if ( timeToEvent < config.MIDDLE_MODE.timeToStart * 60 * 1000 && timeToEvent > 0 ) {
          Device.setMode('MIDDLE_MODE');
        } else {
          Device.setMode('IDLE_MODE');
        }
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
