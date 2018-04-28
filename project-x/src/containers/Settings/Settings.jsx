import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RekognizeForm from '../../components/RekognizeRegistry/RekognizeRegistry';
import SwitchComponent from '../../components/UI/Switch/SwitchComponent';
import './Settings.css';
import { insertPhotoToGallery, clearGallery } from '../../store/actions/rekognize';
import { saveUserToDB } from '../../store/actions/firebase';
import refreshBg from '../../images/refresh.png';
import Device from '../../device';
import * as config from '../../config';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRekognizeForm: false,
      isSaveModeEnable: JSON.parse(localStorage.getItem('saveModeON')),
      activePeopleIndex: -1,
    };
  }
  onRefreshBtnClickHandler = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('events');
    localStorage.removeItem('calendarId');
    localStorage.removeItem('refreshToken');
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
        this.props.insertPhotoToGallery(img, `${eventSubmit.target.rekognizeUserID.value}%%${eventSubmit.target.rekognizeEmail.value}`);
        this.setState({ showRekognizeForm: false });
        this.props.saveUserToDB(eventSubmit.target.rekognizeUserID.value, eventSubmit.target.rekognizeEmail.value);
      } else {
        navigator.notification.alert('Error!\nemail are required', null, 'Room Manager', 'OK');
      }
    });
    eventSubmit.preventDefault();
    eventSubmit.stopPropagation();
  }
  onChangeUserEmail = () => {
    for (let i = 0; i < window.event.target.list.options.length; i += 1) {
      if (window.event.target.list.options[i].value === window.event.target.value) {
        this.setState({ activePeopleIndex: i });
        break;
      }
      if (i === window.event.target.list.options.length - 1) {
        this.setState({ activePeopleIndex: -1 });
      }
    }
  }

  updateCheck() {
    this.setState((oldState) => {
      Device.isSaveModeEnable = !oldState.isSaveModeEnable;
      localStorage.setItem('saveModeON', !oldState.isSaveModeEnable);
      return {
        isSaveModeEnable: !oldState.isSaveModeEnable,
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
          <SwitchComponent
            active={this.state.isSaveModeEnable}
            message="Save mode"
            updateCheck={() => this.updateCheck()}
            id="1"
          />
          <button onClick={() => window.KioskPlugin.exitKiosk()} className="btn-rekognize">Exit</button>
          <p>Erase all data && Refresh</p>
          <button className="btn-refresh" style={{ backgroundImage: `url(${refreshBg})` }} onClick={this.onRefreshBtnClickHandler}>Reset</button>
          <div className="rekognize-section">
            <label className="Settings-title">Rekognize:</label>
            <button className="btn-rekognize" onClick={this.onBtnAddUserClickHandler}>Add User</button>
            <button className="btn-rekognize" onClick={this.props.clearGallery}>Reset users</button>
          </div>
          <RekognizeForm
            arrayData={this.props.people}
            activePeopleIndex={this.state.activePeopleIndex}
            changeEmail={this.onChangeUserEmail}
            show={this.state.showRekognizeForm}
            onAdd={this.onRekognizeSubmit}
          />
        </div>
        <button
          className="btn-close"
          onClick={() => { this.props.hideWindow(); this.setState({ showRekognizeForm: false }); }}
        >
          Close
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  people: state.calendar.people,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  insertPhotoToGallery,
  clearGallery,
  saveUserToDB,
}, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
