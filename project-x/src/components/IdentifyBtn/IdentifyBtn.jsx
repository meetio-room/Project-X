import React from 'react';
import CameraIcon from 'react-icons/lib/fa/camera';
import './IdentifyBtn.css';

/**
 * Use: <IdentifyBtn clicked={event} canceled={event} message="" active={boolean} />
 */
const identifyBtn = props => (
  <div className="IdentifyBtn">
    <button className="btn-confirm" onClick={props.clicked}><CameraIcon /> Identify</button>
    { props.active
      ? <div className="Identify-content">
        <p>
          {props.message}
        </p>
        <button className="btn-cancel" onClick={props.canceled}>x</button>
      </div>
      : null
    }
  </div>
);
export default identifyBtn;
