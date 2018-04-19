import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import './EventDuration.css';

const eventDuration = props => (
  <MuiThemeProvider>
    <div className="EventDuration">
      {
        props.eventDurations.map(duration => (
          <button
            key={duration}
            className={props.active !== duration ? 'EventDuration-item' : 'EventDuration-item  EventDuration-item-active'}
            onClick={() => props.itemClick(duration)}
          >
            {duration}min
          </button>
        ))
      }

      <button
        onClick={() => props.customClick('custom')}
        className={props.active !== 'custom' ? 'EventDuration-item' : 'EventDuration-item EventDuration-item-active'}
      >custom
      </button>

      {props.showCustom
        ? <div className="inputFileds">
          <DateTimePicker
            returnMomentDate
            onChange={dateTime => props.changeDateTime('event-end', dateTime)}
            id="event-start"
            readOnly="readonly"
            floatingLabelText="Event end"
            format="MMM DD, YYYY HH:mm"
            timeFormat="24hr"
            DatePicker={DatePickerDialog}
            TimePicker={TimePickerDialog}
            fullWidth
            errorText={props.error.eventStart || props.error.eventEnd}
          />
        </div>
        : null
      }
    </div>
  </MuiThemeProvider>
);
export default eventDuration;
