import React from 'react';
import './IdentifyBtn.css';

/**
 * Use: <IdentifyBtn canceled={event} message="" active={boolean} />
 */
const identifyBtn = props => (
  <div className="IdentifyBtn">

    { props.active
      ? <div className="Identify-content">
        <p className="creator-head">Creator:</p>
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
