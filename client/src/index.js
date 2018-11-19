import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Styles
import './index.css';

// Imports
import Home from './pages/Home';
import Help from './pages/Help';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Privacy from './pages/Privacy';

ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={ Home } />
            <Route exact path="/help" component={ Help } />
            <Route exact path="/login" component={ Login } />
            <Route exact path="/privacy" component={ Privacy } />
            <Route exact path="/dashboard" component={ Dashboard } />
        
        </div>
    </Router>,
    document.getElementById('root')
);