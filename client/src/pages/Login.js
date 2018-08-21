import React, { Component } from 'react';
import { Link } from 'react-router-dom'
// Styles
import './login/Login.css';

class Login extends Component {
	render() {
		return (
			<div className="login">
                <span>You are not logged in. Please authenticate via your BB&N email.</span>
                <Link to="/login/auth/google">Log In</Link>
			</div>
		);
	}
    
    function 
}

export default Login;