import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Home from './components/Home';
import Connected from './components/Connected';
import Header from './components/Header';

import "./App.css";
import "./react-material/assets/css/material-dashboard-react.css?v=1.6.0";

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/connected" component={Connected} />
      </Switch>
    </Router>
  );
}

export default App;
