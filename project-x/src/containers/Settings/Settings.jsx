import React, { Component } from 'react';
import './Settings.css';
import * as config from '../../config';
import refreshBg from '../../images/refresh.png';
import Device from '../../device';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saveModeEnable: JSON.parse(localStorage.getItem('saveModeON')),
    };
  }
  onRefreshBtnClickHandler = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('Events');
    localStorage.removeItem('calendarId');
    window.plugins.googleplus.logout();
    window.location.reload();
  }
  updateCheck = () => {
    this.setState((oldState) => {
      Device.saveModeEnable = !oldState.saveModeEnable;
      localStorage.setItem('saveModeON', !oldState.saveModeEnable);
      return {
        saveModeEnable: !oldState.saveModeEnable,
      };
    });
  }

  render() {
    if (!this.props.show) return null;
    return (
      <div className="Settings">
        <h3>Settings</h3>
        <div className="Settings-content">
          <h2>{config.PROGRAM_NAME}</h2>
          <div className="version">{`version: ${config.VERSION}`}</div>
          <hr/>
          <div>
          <label class="switch">
            { this.state.saveModeEnable ? <input type="checkbox" id="saveModeCheck" onChange={this.updateCheck} checked/>
              : <input type="checkbox" id="saveModeCheck" onChange={this.updateCheck}/>
            }
            <span class="slider round"></span>
          </label>
           <label
            htmlFor="saveModeCheck"
            style={{
              position: 'relative',
              top: '-10px',
              left: '5px',
              'font-size': '20px',
            }}
            >{`Save mode ${this.state.saveModeEnable ? 'enabled' : 'disabled'}`}</label>
          </div>
          <p>Erase all data && Refresh</p>
          <button className="btn-refresh" style={{ backgroundImage: `url(${refreshBg})` }} onClick={this.onRefreshBtnClickHandler}>Refresh</button>
        </div>
          <button className="btn-close" onClick={() => this.props.hideWindow()}>Close</button>
      </div>
    );
  }
}
export default Settings;
