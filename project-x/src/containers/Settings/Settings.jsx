import React,{Component} from 'react';
import './Settings.css';
import * as config from '../../config';
import {login} from '../../store/actions/calendar';
import refreshBg from '../../images/refresh.png';
import { connect } from 'react-redux';

class Settings extends Component{
  constructor(props){
    super(props);
  }
  onRefreshBtnClickHandler = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
    window.plugins.googleplus.logout();
  }

  render(){
    if(!this.props.show) return null;
    return (
      <div className="Settings">
        <h3>Settings</h3>
        <div className="Settings-content">
          <h2>{config.PROGRAM_NAME}</h2>
          <div className="version">{`version: ${config.VERSION}`}</div>
          <hr/>
          <p>Erase all data && Refresh</p>
          <button className="btn-refresh" style={{backgroundImage: `url(${refreshBg})`}} onClick={this.onRefreshBtnClickHandler}>Refresh</button>
        </div>
          <button className="btn-close" onClick={() =>this.props.hideWindow()}>Close</button>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
  };
};
export default connect( null, mapDispatchToProps )( Settings );