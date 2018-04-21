import React, { Component } from 'react';
import { connect } from 'react-redux';
import CalendarList from '../containers/Calendars/CalendarsList';
import { login } from '../store/actions/auth';
import RoomManager from '../containers/RoomManager/RoomManager';
import Spinner from '../components/UI/Spinner/Spinner';

class App extends Component {
  constructor(props) {
    super(props);
    this.setCalendarListVisibility = this.setCalendarListVisibility.bind(this);
    this.state = {
      isCalendarListShow: false,
    };
  }

  componentDidMount() {
    this.props.loadProfile();
    if (this.props.calendarId) {
      this.setCalendarListVisibility(false);
    } else {
      this.setCalendarListVisibility(true);
    }
  }

  setCalendarListVisibility(isShow) {
    this.setState({ isCalendarListShow: isShow });
  }

  render() {
    return (
      <div>
        <Spinner show={this.props.isLoading} />
        { this.state.isCalendarListShow
          ? <CalendarList clicked={this.setCalendarListVisibility} />
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
