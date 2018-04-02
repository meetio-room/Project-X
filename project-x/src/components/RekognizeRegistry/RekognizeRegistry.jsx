import React from 'react';
import './RekognizeRegistry.css';
import CameraIcon  from 'react-icons/lib/fa/camera'

const  rekognize=(props)=>{
  if (!props.show) return null;
  return (
  <div className="RekognizeRegistry">
    <form onSubmit={props.onAdd}>
      <label htmlFor="rekognizeName">username:</label>
      <input type="text"  id="rekognizeName"/>
      
      <label htmlFor="rekognizeEmail">email:</label>
      <input type="email" id="rekognizeEmail"/>

      <button type="button" onClick={props.onMakePhoto}><CameraIcon/> Make a photo</button>
      <button type="submit"> Add</button>
    </form>
    {props.img ? <img src="" alt="" className="RekognizePhoto"/>:null}
  </div>
);}
export default  rekognize;