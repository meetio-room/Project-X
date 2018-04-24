import React from 'react';
import CameraIcon from 'react-icons/lib/fa/camera';
import './RekognizeRegistry.css';

const rekognize = (props) => {
  if (!props.show) return null;
  return (
    <div className="RekognizeRegistry" >
      <form onSubmit={props.onAdd}>
        <label htmlFor="rekognizeEmail">email:</label>
        <input type="email" name="example" list="exampleList" onChange={props.changeEmail} id="rekognizeEmail" />
        <datalist id="exampleList">
          {
            props.arrayData.map(people => (<option value={people.email} key={people.email} />))
          }
        </datalist>

        <label htmlFor="rekognizeUserID">userId:</label>
        {props.activePeopleIndex !== -1
          ? <input
            type="text"
            id="rekognizeUserID"
            value={props.arrayData[props.activePeopleIndex].userID}
          />
          : <input
            type="text"
            id="rekognizeUserID"
          /> }
        <button type="submit"><CameraIcon />Create User</button>
      </form>
    </div>
  );
};
export default rekognize;
