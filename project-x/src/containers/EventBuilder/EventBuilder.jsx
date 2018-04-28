import React, { Component } from 'react';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Device from '../../device';
import EventNames from '../../components/EventConstructor/EventName/EventNames';
import EventStarts from '../../components/EventConstructor/EventTimeStart/EventStarts';
import EventDuration from '../../components/EventConstructor/EventDuration/EventDuration';
import ConflictEvents from '../../components/EventConstructor/ConflictEvents/ConflictEvents';
import IdentifyBtn from '../../components/IdentifyBtn/IdentifyBtn';
import { createEvent } from '../../store/actions/calendar';
import { comparePhoto } from '../../store/actions/rekognize';
import { getConflictEvents } from '../../service/util';
import './EventBuilder.css';

class EventBuilder extends Component {
  constructor(props) {
    super(props);
    this.onChangeDateTimeHandler = this.onChangeDateTimeHandler.bind(this);
    this.onNameItemClickHandler = this.onNameItemClickHandler.bind(this);
    this.onCustomNameItemHandler = this.onCustomNameItemHandler.bind(this);
    this.onEvStartItemClickHandler = this.onEvStartItemClickHandler.bind(this);
    this.onCustomEvStartItemClickHandler = this.onCustomEvStartItemClickHandler.bind(this);
    this.onEvDurationItemClickHandler = this.onEvDurationItemClickHandler.bind(this);
    this.onCustomEvDurationItemClickHandler = this.onCustomEvDurationItemClickHandler.bind(this);
    this.onConfirmClickHandler = this.onConfirmClickHandler.bind(this);
    this.onInputHandler = this.onInputHandler.bind(this);
    this.closeEventBuilder = this.closeEventBuilder.bind(this);
    this.identificateUser = this.identificateUser.bind(this);
    this.checkEventErrors = this.checkEventErrors.bind(this);
    this.onClearCreator = this.onClearCreator.bind(this);

    this.deltaHours = 60 - moment().minute();
    if (this.deltaHours > 30) this.deltaHours -= 30;
    this.state = {
      errors: {},
      eventNames: [
        {
          name: 'call',
          icon: 'https://image.flaticon.com/icons/svg/17/17819.svg',
        },
        {
          name: 'conference',
          icon: 'https://i.pinimg.com/originals/5e/52/af/5e52af2fa14f8242431ad74d8b0f11fe.png',
        },
      ],
      eventStarts: ['now', this.deltaHours, this.deltaHours + 30, this.deltaHours + 60],
      eventDurations: ['5', '15', '30', '45', '60'],
      activeName: '',
      activeEvStart: '',
      activeEvStartId: '',
      activeEvDuration: '',
      customNameShow: false,
      customEvStart: false,
      customEvDuration: false,
      eventCreator: '',
    };
    this.newEvent = {};
    this.timer = null;
  }
  componentDidMount() {
    Device.switchOnCamera();
    const that = this;
    that.timer = setInterval(() => {
      that.deltaHours = 60 - moment().minute();
      if (that.deltaHours > 30) that.deltaHours -= 30;
      that.setState({
        eventStarts: ['now', that.deltaHours, that.deltaHours + 30, that.deltaHours + 60],
      });
    }, 1000);
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.show || this.props.show;
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
    Device.switchOffCamera();
  }

  onChangeDateTimeHandler(id, dateTime) {
    this.identificateUser();
    const errors = { ...this.state.errors };
    if (id === 'event-start') {
      if (dateTime < moment()) {
        errors.eventStart = 'Error!\n Event start in the past';
      } else {
        errors.eventStart = null;
        this.newEvent.start = dateTime; // - (dateTime.second() * 1000);
        if (this.state.activeEvDuration && this.state.activeEvDuration !== 'custom') {
          this.newEvent.end = moment(this.newEvent.start).add(this.state.activeEvDuration, 'minutes');
        }
      }
      this.setState({ errors });
    } else if (id === 'event-end') {
      this.newEvent.end = dateTime - (dateTime.second() * 1000);
      if (!this.newEvent.start) {
        this.newEvent.start = moment();
        this.newEvent.start -= this.newEvent.start.second() * 1000;
        this.setState({
          activeEvStart: 'now',
          activeEvStartId: 0,
        });
      }
    }
    this.checkEventErrors();
  }

  onNameItemClickHandler(sender) {
    this.identificateUser();
    this.newEvent.summary = sender;
    this.setState({
      customNameShow: false,
      activeName: sender,
    });
  }

  onCustomNameItemHandler(sender) {
    this.identificateUser();
    this.newEvent.summary = '';
    this.setState(prevState => ({
      customNameShow: !prevState.customNameShow,
      activeName: sender,
    }));
  }

  onEvStartItemClickHandler(sender, index) {
    this.identificateUser();
    this.setState({
      activeEvStart: sender,
      activeEvStartId: index,
      customEvStart: false,
    });
    const curTime = moment();
    this.newEvent.start = curTime;
    if (sender !== 'now') {
      this.newEvent.start = curTime.add(sender, 'minutes');
    }
    this.newEvent.start -= this.newEvent.start.second() * 1000;
    if (this.state.activeEvDuration) {
      this.newEvent.end = moment(this.newEvent.start).add(this.state.activeEvDuration, 'minutes');
    }
    this.checkEventErrors();
  }

  onCustomEvStartItemClickHandler(sender) {
    this.identificateUser();
    this.newEvent.start = null;
    this.setState(prevState => ({
      customEvStart: !prevState.customEvStart,
      activeEvStart: sender,
      activeEvStartId: '',
    }));
  }

  onEvDurationItemClickHandler(sender) {
    this.identificateUser();
    this.setState({
      activeEvDuration: sender,
      customEvDuration: false,
    });
    if (!this.newEvent.start) {
      this.newEvent.start = moment();
      this.newEvent.start -= this.newEvent.start.second() * 1000;
      this.setState({
        activeEvStart: 'now',
        activeEvStartId: 0,
      });
    }
    this.newEvent.end = moment(this.newEvent.start).add(sender, 'minutes');
    this.checkEventErrors();
  }

  onCustomEvDurationItemClickHandler(sender) {
    this.identificateUser();
    this.newEvent.end = null;
    this.setState(prevState => ({
      customEvDuration: !prevState.customEvDuration,
      activeEvDuration: sender,
    }));
  }

  onConfirmClickHandler() {
    this.identificateUser();
    if (!this.newEvent.summary) {
      this.newEvent.summary = 'Event';
    }

    if (this.state.activeEvStart === 'now') {
      this.newEvent.start = moment();
    } else if (this.state.activeEvStart !== 'custom') {
      this.newEvent.start = moment().add(this.state.activeEvStart, 'minutes');
    }

    this.newEvent.start -= this.newEvent.start.second() * 1000;
    this.newEvent.start = moment(this.newEvent.start);
    if (this.state.activeEvDuration !== 'custom') {
      this.newEvent.end = moment(this.newEvent.start).add(this.state.activeEvDuration, 'minutes');
    }
    this.checkEventErrors();
    if (this.newEvent.start && this.newEvent.end) {
      const isHasErrors = this.state.errors.eventEnd || this.state.errors.conflictEvents.length !== 0
                            || this.state.errors.eventStart;
      if (isHasErrors) {
        Device.showAlert('Room will be busy in this time(or event time is incorrect)\nPlease select another time');
        return;
      }
      this.props.createEvent(this.newEvent, this.props.calendarId, this.props.token);
      this.closeEventBuilder();
    } else {
      Device.showAlert('Please choose time for event!');
    }
  }

  onInputHandler(e) {
    this.newEvent.summary = e.target.value;
  }

  onClearCreator() {
    this.newEvent.creator = '';
    this.setState({
      eventCreator: '',
    });
  }

  identificateUser() {
    if (this.newEvent.creator) return;
    const that = this;
    Device.createRealTimePhoto()
      .then((img) => {
        that.props.comparePhoto(img)
          .then((email) => {
            [, that.newEvent.creator] = email.split('%%');
            that.setState({ eventCreator: that.newEvent.creator });
          });
      });
  }

  checkEventErrors() {
    const errors = {};
    if (this.newEvent.start && this.newEvent.end) { // validation
      if (this.newEvent.start - this.newEvent.end >= 0) {
        errors.eventEnd = 'The event has start faster than the end!';
      }
      errors.conflictEvents = getConflictEvents(this.props.events, this.newEvent);
      this.setState({ errors });
    }
  }
  closeEventBuilder() {
    this.setState({
      activeName: '',
      activeEvStart: '',
      activeEvDuration: '',
      activeEvStartId: '',
      customNameShow: false,
      customEvStart: false,
      customEvDuration: false,
      errors: {},
      eventCreator: '',
    });
    this.newEvent = {};
    this.props.hideEventBuilder();
  }
  render() {
    if (this.props.show === false) {
      return null;
    }
    return (
      <div className="EventBuilder" onDoubleClick={() => this.closeEventBuilder()} >
        <ConflictEvents error={this.state.errors} />
        <div style={{ opacity: 0.8 }}>
          <h2>Please choose event type</h2>
          <EventNames
            active={this.state.activeName}
            itemClick={this.onNameItemClickHandler}
            names={this.state.eventNames}
            inputedValue={this.onInputHandler}
            error={this.state.errors}
            customClick={this.onCustomNameItemHandler}
            showCustom={this.state.customNameShow}
          />
        </div>

        <div style={{ display: this.state.activeName ? 'block' : 'none' }}>
          <h2>Please select the start of event</h2>
          <EventStarts
            active={this.state.activeEvStart}
            activeId={this.state.activeEvStartId}
            itemClick={this.onEvStartItemClickHandler}
            eventStart={this.state.eventStarts}
            changeDateTime={this.onChangeDateTimeHandler}
            error={this.state.errors}
            customClick={this.onCustomEvStartItemClickHandler}
            showCustom={this.state.customEvStart}
          />
        </div>

        <div style={{ display: this.state.activeEvStart ? 'block' : 'none' }}>
          <h2>Please select the duration of the event</h2>
          <EventDuration
            active={this.state.activeEvDuration}
            itemClick={this.onEvDurationItemClickHandler}
            eventDurations={this.state.eventDurations}
            changeDateTime={this.onChangeDateTimeHandler}
            error={this.state.errors}
            customClick={this.onCustomEvDurationItemClickHandler}
            showCustom={this.state.customEvDuration}
          />
        </div>
        <IdentifyBtn
          clicked={this.identificateUser}
          canceled={this.onClearCreator}
          message={this.newEvent.creator}
          active={this.state.eventCreator}
        />
        <div style={{ display: this.state.activeEvDuration ? 'block' : 'none' }}>
          <button className="btn-confirm" onClick={this.onConfirmClickHandler}>Confirm</button>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  token: state.calendar.access_token,
  calendarId: state.calendar.currentCalendar,
  events: state.calendar.currentCalendarEvents,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  createEvent,
  comparePhoto,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EventBuilder);
