import React, { Component } from 'react';

// Styles
import './dashboard/Dashboard.css';

class Dashboard extends Component {
	render() {
		return (
			<div className="dashboard">
                <span>Home</span>
                <button onClick={refreshLunch}>Update Lunch</button>
			</div>
		);
	}
    
    refreshLunch() {
        fetch('/api/push/refresh/lunch?date=2018-08-21');
    }
}

export default Dashboard;