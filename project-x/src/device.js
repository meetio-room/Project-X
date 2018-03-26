class Device {

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
   * Set device mode (sleeped or active)
   * @param {boolean} sleeped 
   */
  static setDeviceSleeping(sleeped){
    const WifiManager = window.cordova.plugins.WifiManager
    WifiManager.setWifiEnabled(!sleeped);
   
    WifiManager.onwifistatechanged = function (data) {
      Device.showToast(`Wifi ${data.wifiState.toLocaleLowerCase()}!`);
    }
  }
}

export default Device;