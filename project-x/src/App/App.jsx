import React, { Component } from 'react';
import { connect } from 'react-redux';
import CalendarList from '../containers/Calendars/CalendarsList';
import { login } from '../store/actions/calendar';
import RoomManager from '../containers/RoomManager/RoomManager';
import Spinner from '../components/UI/Spinner/Spinner';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarListShow: false,
    };
  }

  componentDidMount() {
    this.props.loadProfile();
    if (this.props.calendarId) {
      this.toggleCalendarListVisibility(false);
    } else {
      this.toggleCalendarListVisibility(true);
    }
  }

  toggleCalendarListVisibility = isShow => this.setState({ calendarListShow: isShow });

  render() {
    return (
      <div>
        <Spinner show={this.props.isLoading} />
        { this.state.calendarListShow
          ? <CalendarList clicked={this.toggleCalendarListVisibility} />
          : <RoomManager /> }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  calendarId: state.calendar.currentCalendar,
  isLoading: state.calendar.loading,
});

const mapDispatchToProp = dispatch => ({
  loadProfile: () => dispatch(login()),
});

export default connect(mapStateToProps, mapDispatchToProp)(App);