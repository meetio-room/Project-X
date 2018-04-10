import React from 'react';
import moment from 'moment';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import './EventStarts.css';

const eventStarts = props => (
  <MuiThemeProvider>
    <div className="EventStarts">
        {
          props.eventStart.map((start, index) => {
            let btnText;
            if (props.activeId === index && index !== 0) {
              btnText = moment().add(start, 'minutes').format('HH:mm');
            } else {
              btnText = isNaN(start) ? start : `+${start}min`;
            }
           return (<button
              className = { props.activeId !== index ? 'EventStart-item' : 'EventStart-item  EventStart-item-active'}
              onClick = { () => {
                props.itemClick(start, index);
              }}
              >{ btnText }
              </button>);
        }) }
        <button onClick={() => props.customClick('custom')}
          className={ props.active !== 'custom' ? 'EventStart-item' : 'EventStart-item  EventStart-item-active'}
          >custom</button>
        { props.showCustom ?
          <div className = "inputFileds" >
            <DateTimePicker
              returnMomentDate = { true }
              onChange = { dateTime => props.changeDateTime('event-start', dateTime) }
              id = "event-start"
              readOnly = "readonly"
              floatingLabelText = "Event start"
              format = 'MMM DD, YYYY HH:mm'
              timeFormat = "24hr"
              DatePicker = { DatePickerDialog }
              TimePicker = { TimePickerDialog }
              fullWidth = { true }
              errorText = { props.error.eventStart || props.error.eventEnd }
            />
          </div>
        : null }
      </div>
  </MuiThemeProvider>
);
export default eventStarts;
