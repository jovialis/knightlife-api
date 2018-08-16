import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Styles
import './index.css';

// Imports
import Home from './pages/Home';
import Login from './pages/Login';

ReactDOM.render(
  <Router>
      <div>
        <Route exact path="/" component={ Home } />
        <Route exact path="/login" component={ Login } />
      </div>
  </Router>,
  document.getElementById('root')
);