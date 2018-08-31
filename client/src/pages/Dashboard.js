import React, { Component } from 'react';

// Styles
import './dashboard/Dashboard.css';

class Dashboard extends Component {
    
    constructor() {
        super();
        
        this.state = {
            date: ''
        }
        
        this.handleClick = this.handleClick.bind(this);
    }

	render() {
		return (
			<div className="dashboard">
                <h1>Send updates</h1>
                <form>
                    <input type="date" value={ this.state.date } onChange={ this.updateSelectedDate }/>
                </form>
                <button onClick={ this.sendScheduleUpdate }>Schedule</button>
                <button onClick={ this.sendEventsUpdate }>Events</button>
                <button onClick={ this.sendLunchUpdate }>Lunch</button>
            </div>
		);
	}

    updateSelectedDate = (event) => {
        console.log("Updating selected date to: " + event.target.value);
        
        this.setState({
            date: event.target.value
        })
    }

    sendScheduleUpdate = () => {
        console.log("Sending schedule update with date: " + this.state.date);
        
        fetch('https://bbnknightlife.com/api/push/refresh/schedule', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: this.state.date
            }),
        }); 
    }

    sendEventsUpdate = () => {
        console.log("Sending events update with date: " + this.state.date);

        fetch('https://bbnknightlife.com/api/push/refresh/events', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: this.state.date
            }),
        });
    }
    
    sendLunchUpdate = () => {
        console.log("Sending lunch update with date: " + this.state.date);

        fetch('https://bbnknightlife.com/api/push/refresh/lunch', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: this.state.date
            }),
        });
    }
}

export default Dashboard;