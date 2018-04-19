import React from 'react';
import './EventNames.css';

const eventNames = props => (
  <div className="EventNames">
    {
      props.names.map(name => (
        <button
          key={name}
          className={props.active !== name ? 'EventName-item' : 'EventName-item  EventName-item-active'}
          onClick={() => props.itemClick(name)}
        >{name}
        </button>))
    }
    <button
      onClick={() => props.customClick('custom')}
      className={props.active !== 'custom' ? 'EventName-item' : 'EventName-item  EventName-item-active'}
    >custom
    </button>
    {props.showCustom
       ? <div className="inputFileds" >
         <label
           htmlFor="eventNameInput"
         >
        Event name:
         </label>
         <br />
         <input
           type="text"
           id="eventNameInput"
           placeholder="Enter event name"
           onInput={props.inputedValue}
         />
         {props.error.summary ?
           <div className="error" > {props.error.summary} </div>
        : null
      }
       </div>
       : null}
  </div>
);
export default eventNames;
