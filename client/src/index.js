import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Styles
import './index.css';

// Imports
import PageLogin from './pages/login/page';
import PageGoogleLogin from './pages/login/google/login/page';
import PageGoogleRedirect from './pages/login/google/redirect/page';

import PageDashboard from './pages/dashboard/page';

ReactDOM.render(
    <Router>
        <div className='page-wrapper'>
            <Route path="/login" component={ PageLogin } />
            <Route path="/login/google" component={ PageGoogleLogin } />
            <Route path="/login/google/redirect" component={ PageGoogleRedirect } />
            
            <Route path='/dashboard' component={ PageDashboard } />
        </div>
    </Router>,
    document.getElementById('container')
);