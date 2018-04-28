import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RoomStatus from '../../components/RoomStatusWidget/RoomStatus';
import EventBuilder from '../EventBuilder/EventBuilder';
import Setting from '../Settings/Settings';
import { loadEvents } from '../../store/actions/calendar';
import { loadCurrentEvent } from '../../store/actions/UI';
import { refreshToken } from '../../store/actions/auth';
import Device from '../../device';
import * as config from '../../config';


class RoomManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: new Date(),
      isEventBuilderShow: false,
      isSettingsShow: false,
    };
    this.timer = null;
    this.clock = null;
  }

  componentDidMount() {
    const that = this;
    const syncStep = 60;
    this.timer = setInterval(() => {
      if (!window.cordova.plugins.backgroundMode.isEnabled()) {
        window.cordova.plugins.backgroundMode.enable();
      }

      let tokenExpires = localStorage.getItem('expires_in');
      if (that.props.currentCalendar && navigator.connection.type !== window.Connection.NONE) {
        that.props.loadEvents(that.props.currentCalendar, that.props.token);
      }
      if (tokenExpires) {
        tokenExpires -= syncStep;
        if (tokenExpires <= 0 && navigator.connection.type !== window.Connection.NONE) { // refresh token
          that.props.refreshToken();
        }
        localStorage.setItem('expires_in', tokenExpires);
      }
    }, syncStep * 1000);

    this.clock = setInterval(() => { // every seconds
      const time = new Date();
      if (that.state.currentTime.getMinutes() !== time.getMinutes()) {
        that.setState({ currentTime: time });
        const timeToEvent = that.props.events.length > 0 ? Date.parse(that.props.events[0].start) - time : 10e12;
        if (Device.isSaveModeEnable && (time.getHours() < config.SLEEP_MODE.end || time.getHours() >= config.SLEEP_MODE.start)) {
          Device.setMode('SLEEP_MODE');
        } else if (that.props.room.status === 'Busy') {
          Device.setMode('ACTIVE_MODE');
        } else if (timeToEvent < config.MIDDLE_MODE.timeToStart * 60 * 1000 && timeToEvent > 0) {
          Device.setMode('MIDDLE_MODE');
        } else {
          Device.setMode('IDLE_MODE');
        }
      }
      that.props.loadCurrentEvent(that.props.events[0]);
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.clock);
  }

  onRoomStatusBtnClickHandler = () => {
    this.setEventBuilderVisibility(true);
  }

  onScreenClickHandler = () => {
    window.event.stopPropagation();
    Device.setMode('MIDDLE_MODE');
    Device.quinaryClick(() => {
      Device.showPrompt('Enter Password:', (result) => {
        if (result.input1 === process.env.REACT_APP_SETTINGS_PASSWORD) {
          this.setState({ isSettingsShow: true });
        } else {
          Device.showAlert('Password wrong!');
        }
      });
    });
  }

  setEventBuilderVisibility = (show) => {
    this.setState({ isEventBuilderShow: show });
  }

  render() {
    return (
      <div onClick={this.onScreenClickHandler}>
        <RoomStatus
          status={this.props.room.status}
          eventName={this.props.room.eventName}
          timeEventBegin={this.props.room.timeStart}
          timeEventFinish={this.props.room.timeEnd}
          timeToNextEvent={this.props.room.timeToNextEvent}
          description={this.props.room.description}
          currentTime={this.state.currentTime}
          attendees={this.props.events[0] ? this.props.events[0].attendees : []}
          BtnName={this.props.room.BtnName}
          clicked={() => this.onRoomStatusBtnClickHandler()}
        />
        <EventBuilder
          show={this.state.isEventBuilderShow}
          hideEventBuilder={() => this.setEventBuilderVisibility(false)}
        />
        <Setting
          show={this.state.isSettingsShow}
          hideWindow={() => this.setState({ isSettingsShow: false })}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  events: state.calendar.currentCalendarEvents,
  token: state.calendar.access_token,
  currentCalendar: state.calendar.currentCalendar,
  room: state.calendar.room,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  loadEvents,
  loadCurrentEvent,
  refreshToken,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RoomManager);
