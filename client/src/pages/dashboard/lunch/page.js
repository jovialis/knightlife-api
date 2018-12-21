// 

import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from 'axios';

import Navigation from '../../../components/navigation/component';

import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

// Styles
import './styles.css';

export default class PageLunch extends Component {

    state = {
        selectedDate: new Date(),
        
        pickerHidden: true,
        
        title: '',
        current: [],
        __v: -1,
        
        search: '',
        suggested: [],
    }

    componentDidMount() {
        document.title = 'KL Dashboard - Lunch';
        
        this.fetchDateResults();
    }

    render() {
        return (
            <div className='page-dashboard-lunch'>
                <Navigation />
                <h1>Lunch</h1>
                { this.renderPage() }
            </div>
        );
    }

    renderPage = () => {
        return (
            <div>
                <div style={{ 'backgroundColor': 'lightgray' }}>
                    <div onClick={ () => { this.setState({ pickerHidden: !(this.state.pickerHidden) }) } }>
                        <span style={{ 'color': 'red' }}>
                            { this.state.selectedDate.toLocaleDateString('en-US') }
                        </span>
                    </div>
                    <div style={{ 'position': 'absolute', 'left': 0, 'backgroundColor': 'lightgray' }}>
                        {
                        this.state.pickerHidden ? 
                            (<span></span>)
                            :
                            (<DayPicker 
                                month={ this.state.selectedDate }
                                todayButton={ 'Today' } 
                                onDayClick={ this.updateSelectedDate }
                                selectedDays={ this.state.selectedDate }
                                onTodayButtonClick={ (day, modifiers) => { this.setState({ selectedDate: day }) } }
                                style={{ 'position': 'absolute', left: 0, 'backgroundColor': 'white' }}
                            />)
                        }
                    </div>
                </div>
                <button onClick={ this.pushChangesToServer }>SAVE</button>
                <div>
                    <h5>Today Menu</h5>
                    <input type='text' value={ this.state.title } onChange={ this.updateTitleField } placeholder='Menu Name'></input>
                    <ul>
                        {
                            this.state.current.map(item => (
                                <li>
                                    <h6>Name: { item.name }</h6>
                                    <h6>Allergy: { item.allergy }</h6>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <label>
                    <h4>Add Food</h4>
                    <input type='text' value={ this.state.search } onChange={ this.updateSearchField } placeholder='Food Name' required></input>
                    <div>
                        {
                            this.state.suggested.map((item) => {
                                return (
                                    <SuggestedFood item={ item } onSelect={ this.addItemToCurrent }  />
                                );
                            })
                        }
                    </div>
                </label>
            </div>
        );
    }
    
    updateSelectedDate = (day) => {
        this.setState({
            selectedDate: day 
        }, () => {
            this.fetchDateResults();
        });
    }
    
    updateTitleField = (event) => {
        this.setState({
            title: event.target.value
        });
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
//            _a: this.getAuthToken(),
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
    
    addItemToCurrent = (item) => {
        this.setState({
            current: [
                ...this.state.current,
                item
            ]
        });
    }
    
    fetchDateResults = () => {
        const date = this.state.selectedDate;

        axios.post(`/dashboard/page/lunch/${ date.getFullYear() }/${ date.getMonth() + 1 }/${ date.getDate() }`, {
//            _a: this.getAuthToken()    
        }).then(res => {
            // Selected date changed
            if (this.state.selectedDate !== date) {
                return;
            }
            
            const data = res.data;
            
            if (data) {
                const index = data.index;
                
                if (index) {
                    const lunch = index.lunch;
                    
                    const title = lunch.title;
                    const items = lunch.items;
                    
                    const __v = lunch.__v;
                    
                    this.setState({
                        title: title,
                        current: items,
                        __v: __v
                    });
                }
            }
        });
    }
    
    pushChangesToServer = () => {
        const date = this.state.selectedDate;
        
        const __v = this.state.__v;
        const title = this.state.title;
        const items = this.state.current;
        
        axios.post(`/dashboard/page/lunch/${ date.getFullYear() }/${ date.getMonth() + 1 }/${ date.getDate() }/do/update`, {
            __v: __v,
            title: title,
            items: items
        }).then(res => {
            window.location.reload();
        });
    }
    
    getAuthToken = () => {
        return sessionStorage.getItem('_a');
    }
    
    setAuthToken = (token) => {
        return sessionStorage.setItem('_a', token);
    }

}

class SuggestedFood extends Component {
    
    constructor(props) {
        super(props);
        
        console.log(JSON.stringify(props))
    }
    
    render() {
        return (
            <div>
                <button onClick={ this.selected }>Add</button>
                <div style={{ 'backgroundColor': 'yellow', 'border': '1px solid gray' }}>
                    <h4>{ this.props.item.name }</h4>
                    <h5>{ this.props.item.allergy }</h5>
                </div>
            </div>
        );
    }
    
    selected = () => {
        this.props.onSelect(this.props.item);
    }
    
}