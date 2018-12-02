import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import axios from 'axios';

export default class PageGoogleRedirect extends Component {

    state = {
        redirect: false   
    };

    componentDidMount() {
        const code = this.props.location.query.code;

        axios.post('/dashboard/do/auth/login/google/login', {
            code: code
        }, (res) => {
            const data = res.data;

            if (data) {
                const index = data.index;

                if (index) {
                    const token = index._a;
                    this.setAuthToken(token);

                    this.setState({
                        redirect: true
                    });
                }
            }
        });
    }

    render() {
        if (this.state.redirect) {
            return (
                <Redirect to='/dashboard'></Redirect>
            );
        } else {
            return (
                <div className='page-google-redirect'></div>
            );
        }
    }

    setAuthToken = (token) => {
        sessionStorage.setItem('_a', token);
    }

}