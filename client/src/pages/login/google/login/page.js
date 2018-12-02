import React, { Component } from 'react';

import axios from 'axios';

export default class PageGoogleLogin extends Component {

    componentDidMount() {
        axios.post('/dashboard/do/auth/login/google', {}).then(res => {
            const data = res.data;
            
            if (data) {
                const index = data.index;
                
                if (index) {
                    const redirect = index.redirect;
                    
                    // Do redirect
                    window.location.href = redirect;
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