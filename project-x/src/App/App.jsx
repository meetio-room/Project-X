import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CalendarList from '../containers/Calendars/CalendarsList';
import { login, refreshToken } from '../store/actions/auth';
import { readUsersFromDb } from '../store/actions/firebase';
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
    if (localStorage.getItem('refreshToken')) {
      this.props.refreshToken();
    } else {
      this.props.login();
    }
    this.props.readUsersFromDb();
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

const mapDispatchToProps = dispatch => bindActionCreators({
  login,
  refreshToken,
  readUsersFromDb,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
