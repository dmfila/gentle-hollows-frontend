import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Home from './components/Home';
import Redirect from './components/Redirect';

import "./App.css";
import "./react-material/assets/css/material-dashboard-react.css?v=1.6.0";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/redirect" component={Redirect} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
