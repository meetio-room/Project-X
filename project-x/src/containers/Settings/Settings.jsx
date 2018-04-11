import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Settings.css';
import * as config from '../../config';
import RekognizeForm from '../../components/RekognizeRegistry/RekognizeRegistry';
import { insertPhotoToGallery, clearGallery } from '../../store/actions/rekognize';
import refreshBg from '../../images/refresh.png';
import Device from '../../device';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRekognizeForm: false,
      saveModeEnable: JSON.parse(localStorage.getItem('saveModeON')),
    };
    this.rekognitionDate = {
      name: '',
      email: '',
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

  onBtnAddUserClickHandler = () => {
    this.setState(prevState => ({
      showRekognizeForm: !prevState.showRekognizeForm,
    }));
  }

  onAddBtnClickHandler = (e) => {
    this.rekognitionDate = {
      name: e.target.rekognizeName.value,
      email: e.target.rekognizeEmail.value,
    };
    alert(e.target.rekognizeName.value);
    alert(e.target.rekognizeEmail.value);

    e.preventDefault();
    e.stopPropagation();
    this.setState({ showRekognizeForm: false });
  }
  onMakePhotoClickHandler = (e) => {
    const that = this;
    Device.createPhoto().then((img) => {
      this.props.insertToGallery(img, `${that.rekognitionDate.name}%%${that.rekognitionDate.email}`);
      this.props.hideWindow();
    }).catch(err => alert(err));

    e.preventDefault();
    e.stopPropagation();
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
          <div className="rekognize-section">
            <label className="Settings-title">Rekognize:</label>
            <button className="btn-rekognize" onClick={this.onBtnAddUserClickHandler}>Add User</button>
            <button className="btn-rekognize" onClick={this.props.resetGallery}>Reset users</button>
          </div>
          <RekognizeForm
            show ={this.state.showRekognizeForm}
            onAdd={this.onAddBtnClickHandler}
            onMakePhoto={this.onMakePhotoClickHandler}/>
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
