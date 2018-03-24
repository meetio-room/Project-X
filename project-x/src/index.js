import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import store from './store/store';


const startApp = () => {
  ReactDOM.render(
    <Provider store = { store }>
      <App />
    </Provider>, document.getElementById( 'root' ));
    registerServiceWorker();
    window.cordova.plugins.backgroundMode.enable();
  }
  
  if(!window.cordova) {
    startApp();
  } else {
    document.addEventListener( 'deviceready', startApp, false );
  }