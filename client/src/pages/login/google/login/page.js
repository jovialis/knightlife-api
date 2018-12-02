import React, { Component } from 'react';

import axios from 'axios';

export default class PageGoogleLogin extends Component {

    state = {
        redirect: false,
        location: null
    };
    
    componentDidMount() {
        axios.post('/dashboard/do/auth/login/google', {}, (res) => {
            const data = res.data;
            
            if (data) {
                const index = data.index;
                
                if (index) {
                    const redirect = index.redirect;
                    
                    this.setState({
                        redirect: true,
                        location: redirect
                    });
                }
            }
        });
    }
    
	render() {
        return (
            <div className='page-google-login'></div>
        );
	}

    componentDidUpdate() {
        if (this.state.redirect) {
            window.location.href = this.state.location; // Do redirect
        }
    }
    
}