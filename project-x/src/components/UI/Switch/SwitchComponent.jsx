import React from 'react';
import './SwitchComponent.css';

/**
 * Use: <SwitchComponent message="" updateCheck={onChangeEvent} active={bool}/>
 */
const switchComponent = props => (
  <div>
    <div>
      <label className="switch">
        { props.active
            ? <input type="checkbox" id={`switch-${props.id}`} onChange={props.updateCheck} checked />
            : <input type="checkbox" id={`switch-${props.id}`} onChange={props.updateCheck} />
        }
        <span className="slider round" />
      </label>
      <label
        htmlFor={`switch-${props.id}`}
        style={{
            position: 'relative',
            top: '-10px',
            left: '5px',
            'font-size': '20px',
        }}
      >
        {`${props.message} ${props.active ? 'enabled' : 'disabled'}`}
      </label>
    </div>
  </div>
);
export default switchComponent;
