import React, { Component } from 'react';

// Styles
import './dashboard/Dashboard.css';

class Dashboard extends Component {
	render() {
		return (
			<div className="dashboard">
                <span>Home</span>
                <button onClick={this.refreshLunch}>Update Lunch</button>
			</div>
		);
	}
    
    refreshLunch() {
        const data = {
            "items": [
                {
                    "name": "Potato"
                }
            ]
        }
        
        const dataString = JSON.stringify(data);
        
        fetch(`/api/submit/lunch?date=2018-08-21,data=${dataString}`, {
            method: 'POST'
        });
    }
}

export default Dashboard;