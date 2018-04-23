import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App/App';

import store from './store/store';
import Device from './device';

require('dotenv').config();


const startApp = () => {
  ReactDOM.render(<Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
  Device.fulscreenMode();
  document.addEventListener('backbutton', e => e.preventDefault(), false);
  window.cordova.plugins.backgroundMode.enable();
};

if (!window.cordova) {
  startApp();
} else {
  document.addEventListener('deviceready', startApp, false);
}
