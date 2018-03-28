/* global alert */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './CalendarList.css';
import CalendarItem from '../../components/CalendarItem/CalendarItem.jsx';
import { createCalendar, loadEvents, selectCalendar } from '../../store/actions/calendar';

class CalendarList extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      showCreateCalendarInput: false
    };
  }

  onAddCalendarClickHandler = () => {
    if ( this.state.showCreateCalendarInput ) {
      const name = this.newCalendarInput.value.trim() || '';
      const nameIndex = this.props.calendars.findIndex( el => el.name === name );
      const isNameUniq = nameIndex === -1;
      if ( name && isNameUniq ) {
        this.props.createCalendar( name, this.props.token );
      } else if ( name !== '' || isNameUniq ) {
        navigator.notification.alert( 'Error!\n name must be uniq', null, 'Room Manager', 'OK' );
        return;
      }
    }
    this.setState( prevState => ( {
      showCreateCalendarInput: !prevState.showCreateCalendarInput
    } ) );
  }

  onCalendarItemClickHandler = id => {
    this.props.selectCalendar( id );
    this.props.loadCalendarEvents( id, this.props.token );
    this.props.clicked( false );
  }
  render() {
    return (
      <div className="CalendarList" >
        <h2>Select Calendars for device:</h2>
        <ul>
          { this.props.calendars.map( calendar =>
            <CalendarItem
              key = { calendar.id }
              calendarId = { calendar.id }
              calendarName = { calendar.name }
              clicked = {() => this.onCalendarItemClickHandler( calendar.id )}
            />
          )
          }
        </ul>
        { this.state.showCreateCalendarInput ?
          <input
            placeholder = "enter name for calendar"
            type = "text"
            ref = { inp => this.newCalendarInput = inp }
            className = "newCalendarInput" />
          : null }
        <button
           onClick = {this.onAddCalendarClickHandler } 
          className = "AddBtn" >
           +
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { 
    calendars: state.calendar.allCalendars,
    token: state.calendar.access_token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createCalendar: ( name, token ) => dispatch( createCalendar( name, token ) ),
    loadCalendarEvents: ( calendarId, token ) => dispatch( loadEvents( calendarId, token ) ),
    selectCalendar: calendarId => dispatch( selectCalendar( calendarId ) )
  };
};
export default connect( mapStateToProps, mapDispatchToProps )( CalendarList );
