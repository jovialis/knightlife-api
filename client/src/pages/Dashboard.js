import React, { Component } from 'react';

// Styles
import './Dashboard.css';

class Dashboard extends Component {
    
    constructor() {
        super();
        
        this.state = {
            date: '',
            message: '',
            username: '',
            password: '',
        }
    }

	render() {
		return (
			<div className="dashboard">
                <h1>Login</h1>
                <form>
                    <span>Username</span>
                    <input type="email" value={ this.state.username } onChange={ this.usernameChanged } name="username"/>
                    <br/>
                    <span>Password</span>
                    <input type="password" value={ this.state.password } onChange={ this.passwordChanged } name="password"/>
                </form>
                <h2>Send updates</h2>
                <form>
                    <input type="date" value={ this.state.date } onChange={ this.updateSelectedDate }/>
                </form>
                <button onClick={ this.sendScheduleUpdate }>Schedule</button>
                <button onClick={ this.sendEventsUpdate }>Events</button>
                <button onClick={ this.sendLunchUpdate }>Lunch</button>
                <h3>Send message</h3>
                <form>
                    <input type="text" value={ this.state.message } onChange={ this.messageChanged }/>
                </form>
                <button onClick={ this.sendMessage }>Send</button>
            </div>
		);
	}

    usernameChanged = (event) => {
        this.setState({
            date: this.state.date,
            message: this.state.message,
            username: event.target.value,
            password: this.state.password
        })
    }

    passwordChanged = (event) => {
        this.setState({
            date: this.state.date,
            message: this.state.message,
            username: this.state.username,
            password: event.target.value
        })
    }

    messageChanged = (event) => {
        this.setState({
            date: this.state.date,
            message: event.target.value,
            username: this.state.username,
            password: this.state.password
        })
    }

    updateSelectedDate = (event) => {        
        this.setState({
            date: event.target.value,
            message: this.state.message,
            username: this.state.username,
            password: this.state.password
        })
    }
                
    sendMessage = () => {
        fetch('/api/push/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: this.state.message,
                username: this.state.username,
                password: this.state.password
            })
        }); 
    }

    sendScheduleUpdate = () => {        
        fetch('/api/push/refresh/schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: this.state.date,
                username: this.state.username,
                password: this.state.password
            })
        }); 
    }

    sendEventsUpdate = () => {
        fetch('/api/push/refresh/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: this.state.date,
                username: this.state.username,
                password: this.state.password
            })
        });
    }
    
    sendLunchUpdate = () => {
        fetch('/api/push/refresh/lunch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: this.state.date,
                username: this.state.username,
                password: this.state.password
            })
        });
    }
}

export default Dashboard;