/* global localStorage window navigator */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import RekognizeForm from '../../components/RekognizeRegistry/RekognizeRegistry';
import './Settings.css';
import { insertPhotoToGallery, clearGallery } from '../../store/actions/rekognize';
import refreshBg from '../../images/refresh.png';
import Device from '../../device';
import * as config from '../../config';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRekognizeForm: false,
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

  onBtnAddUserClickHandler = () => {
    this.setState(prevState => ({
      showRekognizeForm: !prevState.showRekognizeForm,
    }));
  }

  onRekognizeSubmit = () => {
    const eventSubmit = window.event;
    Device.createPhoto().then((img) => {
      if (eventSubmit.target.rekognizeEmail.value) {
        this.props.insertToGallery(img, `${eventSubmit.target.rekognizeName.value}%%${eventSubmit.target.rekognizeEmail.value}`);
        this.setState({ showRekognizeForm: false });
      } else {
        navigator.notification.alert('Error!\nemail are required', null, 'Room Manager', 'OK');
      }
    });
    eventSubmit.preventDefault();
    eventSubmit.stopPropagation();
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
          <hr />
          <div>
            <label className="switch">
              { this.state.saveModeEnable ? <input type="checkbox" id="saveModeCheck" onChange={this.updateCheck} checked />
              : <input type="checkbox" id="saveModeCheck" onChange={this.updateCheck} />
            }
              <span className="slider round" />
            </label>
            <label
              htmlFor="saveModeCheck"
              style={{
              position: 'relative',
              top: '-10px',
              left: '5px',
              'font-size': '20px',
            }}
            >{`Save mode ${this.state.saveModeEnable ? 'enabled' : 'disabled'}`}
            </label>
          </div>
          <p>Erase all data && Refresh</p>
          <button className="btn-refresh" style={{ backgroundImage: `url(${refreshBg})` }} onClick={this.onRefreshBtnClickHandler}>Reset</button>
          <div className="rekognize-section">
            <label className="Settings-title">Rekognize:</label>
            <button className="btn-rekognize" onClick={this.onBtnAddUserClickHandler}>Add User</button>
            <button className="btn-rekognize" onClick={this.props.resetGallery}>Reset users</button>
          </div>
          <RekognizeForm
            show={this.state.showRekognizeForm}
            onAdd={this.onRekognizeSubmit}
          />
        </div>
        <button className="btn-close" onClick={() => this.props.hideWindow()}>Close</button>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  insertToGallery: (img, name) => dispatch(insertPhotoToGallery(img, name)),
  resetGallery: () => dispatch(clearGallery()),
});
export default connect(null, mapDispatchToProps)(Settings);
