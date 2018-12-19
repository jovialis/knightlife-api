// 

import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from 'axios';

import Navigation from '../../../components/navigation/component';

// Styles
import './styles.css';

export default class PageLunch extends Component {

    state = {
        search: '',
        suggested: []
    }

    componentDidMount() {
        document.title = 'KL Dashboard - Lunch';
    }

    render() {
        return (
            <div className='page-dashboard'>
                <Navigation />
                <h1>Dashboard</h1>
                { this.renderPage() }
            </div>
        );
    }

    renderPage = () => {
        return (
            <div>
                <input type='text' value={ this.state.search } onChange={ this.updateSearchField } placeholder='Food Name' required></input>
                <div>
                    {
                        this.state.suggested.map(item => (
                            <div style={{ 'background-color': 'yellow', 'border': '1px solid gray' }}>
                                <h4>{ item.name }</h4>
                                <h5>{ item.allergy }</h5>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
    
    updateSearchField = (event) => {
        this.setState({
            search: event.target.value
        }, () => {
            this.fetchSearchResults();
        });
    }
    
    fetchSearchResults = () => {
        const searchTerm = this.state.search.trim();
        if (searchTerm.length === 0) {
            this.setState({
                suggested: []
            });
            return;
        }
        
        axios.post('/dashboard/page/lunch/food/suggest', {
            _a: this.getAuthToken(),
            text: searchTerm
        }).then(res => {
            // If we've changed the search terms.
            if (this.state.search.trim() !== searchTerm) {
                return;
            }
            
            const data = res.data;

            if (data) {
                const index = data.index;

                if (index) {
                    this.setState({
                        suggested: index.items
                    });

                    return;
                }
            }
        });
    }
    
    getAuthToken = () => {
        return sessionStorage.getItem('_a');
    }
    
    setAuthToken = (token) => {
        return sessionStorage.setItem('_a', token);
    }

}