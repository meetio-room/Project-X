/* global console window */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers/index';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore( reducers, composeEnhancers(
  applyMiddleware( thunk )
) );
store.subscribe( () => {
  console.log( store.getState() );
} );
export default store;