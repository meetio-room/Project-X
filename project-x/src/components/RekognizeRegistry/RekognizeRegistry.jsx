import React from 'react';
import CameraIcon from 'react-icons/lib/fa/camera';
import './RekognizeRegistry.css';

const rekognize = (props) => {
  if (!props.show) return null;
  return (
    <div className="RekognizeRegistry">
      <form onSubmit={props.onAdd}>
        <label htmlFor="rekognizeName" placeholder="Ivan Petrov">userId:</label>
        <input type="text" id="rekognizeName" />

        <label htmlFor="rekognizeEmail">email:</label>
        <input type="email" id="rekognizeEmail" />

        <button type="submit"><CameraIcon />Create User</button>
      </form>
    </div>
  );
};
export default rekognize;
