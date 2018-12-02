import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import axios from 'axios';

export default class PageGoogleLogin extends Component {

    componentDidMount() {
        axios.post('/dashboard/do/auth/login/google', {}, (res) => {
            const data = res.data;
            
            if (data) {
                const index = data.index;
                
                if (index) {
                    const redirect = index.redirect;
                    
                    window.location = redirect; // Do redirect
                }
            }
        });
    }
    
	render() {
        return (
            <div className='page-google-login'></div>
        );
	}
    
}