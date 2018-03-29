import * as config from './config.js';
class Device {
 static clickCounter = 0;

  /**
  * AutoHide navigation bar
  */
  static fulscreenMode() {
    let autoHideNavigationBar = true;
    window.navigationbar.setUp( autoHideNavigationBar );
  }
  
  /**
  * Show toast with some message
  * @param {string} message - user message for toast
  */
  static showToast = ( message ) => {
    window.plugins.toast.showWithOptions({
      message: message,
      duration: "3000", 
      position: "center",
      styling: {
        opacity: 0.75, 
        textColor: '#FFFF00', 
        textSize: 26.5, 
        cornerRadius: 16, 
      }
    });
  }

  /**
   * set Brightness for screen
   * @param {float} value brightness of screen [0.0,... 1]
   */
  static setBrightness(value){
    if (isNaN(value) || value > 1 || value < 0) return;
    if (window.cordova.plugins.brightness) {
      window.cordova.plugins.brightness.setBrightness(value);
    }
  }

   /**
   * Set device mode (sleeped or active)
   * @param {boolean} sleeped set devise to save mode
   */
  static setDeviceSleeping(sleeped){
    const WifiManager = window.cordova.plugins.WifiManager
    WifiManager.setWifiEnabled(!sleeped);
    
    WifiManager.onwifistatechanged = function (data) {
      Device.showToast(`Wifi ${data.wifiState.toLocaleLowerCase()}!`);
    }
    window.cordova.plugins.brightness.setKeepScreenOn(!sleeped);
    if(sleeped){
      Device.setBrightness(0);
      window.screenLocker.lock();
    } else {
      window.screenLocker.unlock();    
    }
  }

  /**
   * Set device config for special mode
   * @param {string} mode default IDLE_MODE ( SLEEP_MODE || ACTIVE_MODE || MIDDLE_MODE )
   */
  static setMode(mode){
    switch(mode){
      case 'SLEEP_MODE':{
        Device.setDeviceSleeping(true);
        break;
      }
      case 'ACTIVE_MODE': {
        Device.setDeviceSleeping(false);
        Device.setBrightness(config[mode].brightness);
        break;
      }
      case 'MIDDLE_MODE': {
        Device.setDeviceSleeping(false);
        Device.setBrightness(config[mode].brightness);
        break;
      }
      default: {
        Device.setDeviceSleeping(false);
        Device.setBrightness(config['IDLE_MODE'].brightness);
      }
    }    
  }

  //Events
  /**
   * Run function after 5 times touch
   * @param {function} callback 
   */
  static quinaryClick(callback){
    Device.clickCounter++;
    if(Device.clickCounter===5){
      callback();
      Device.clickCounter=0;
    }
    setTimeout(()=>{
      Device.clickCounter=0;
    },3000);
  }
}

export default Device;