import React from 'react';
import './Spinner.css';

const spinner = (props) => {
  if (!props.show) {
    return null;
  }
  return (
    <div className="Spinner">
      <div className="lds-css ng-scope">
        <div style={{ width: '75%', height: '75%' }} className="lds-double-ring">
          <div />
          <div />
        </div>
        <div className="loadingText"> Loading...</div>
      </div>
    </div>
  );
};
export default spinner;
