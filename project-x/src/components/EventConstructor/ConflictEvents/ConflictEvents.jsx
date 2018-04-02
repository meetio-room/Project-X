import React from 'react';
import moment from 'moment';
import './ConflictEvents.css';

const conflictEvents=(props)=>{
  if(( props.error.conflictEvents || [] ).length > 0){
    return (
      <div className = "conflicts" >
      <h3>Conflicts:</h3>
      <ol className = "conflicts-container" >
      { ( props.error.conflictEvents || [] ).map( ev => {
        return ( <li 
          className = "conflicts-item"
          key = { ev.id } >
          <span className = "conflicts-item-name" >{ ev.name } </span>
          <br/>
          <span className = "conflicts-item-time"> start: { `${moment( ev.start ).format( 'MMMM Do, HH:mm' )}` } </span>
          <span className = "conflicts-item-time"> end: {` ${moment( ev.end ).format( 'MMMM Do, HH:mm' )}` } </span>
          </li> );
        } )}
        </ol>
        </div>);
      } else {
        return null;
      }
  }
export default conflictEvents;