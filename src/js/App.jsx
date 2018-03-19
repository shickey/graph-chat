import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, compose } from 'redux'
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import { HashRouter, Route } from 'react-router-dom'
import firebase from 'firebase'
import selectedNode from './reducers/selection'
import Navbar from './Navbar.jsx'
import Topic from './Topic.jsx'


const firebaseConfig = {
  apiKey: "AIzaSyBe1g2Dpa96RvbMRuwLa-ciG57Jc6ET0G0",
  authDomain: "graph-chat-258eb.firebaseapp.com",
  databaseURL: "https://graph-chat-258eb.firebaseio.com",
  projectId: "graph-chat-258eb",
  storageBucket: "graph-chat-258eb.appspot.com",
  messagingSenderId: "749342404967"
};

const rrfConfig = {};

firebase.initializeApp(firebaseConfig);

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig)
)(createStore);

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  selectedNode
});

const store = createStoreWithFirebase(rootReducer, {});


const App = () => (
  <Provider store={store}>
    <HashRouter>
      <div className="app-container">
        <Navbar />
        <Route path="/topic/:topicId" component={Topic} />
      </div>
    </HashRouter>
  </Provider>
)

ReactDOM.render(<App />, document.getElementById('root'));
