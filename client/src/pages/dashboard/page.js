import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

import FeatherIcon from 'feather-icons-react';

// Styles
import './styles.css';

export default class PageDashboard extends Component {

    state = {
        loading: true,
        overview: null,
        modules: null
    }

    componentDidMount() {
        axios.post('/dashboard/page/home', {
            _a: this.getAuthToken()
        }).then(res => {
            const data = res.data;
            
            if (data) {
                const index = data.index;
                
                if (index) {
                    this.setState({
                        loading: false,
                        overview: index.overview,
                        modules: index.modules
                    });
                    
                    return;
                }
            }
        })
    }

    render() {
        return (
            <div className='page-dashboard'>
                <h1>Dashboard</h1>
                { this.renderPage() }
            </div>
        );
    }

    renderPage = () => {
        if (this.state.loading) {
            return (
                <span>Loading...</span>
            );
        } else {
            return this.renderMain();
        }
    }
    
    renderMain = () => {
        return (
            <div className='page-content'>
                <section id='section-overview'>
                    <h2>{ this.state.name }</h2>
                    <h5>{ this.state.username }</h5>
                    <img src={ this.state.picture } style={{ width: '200px', height: 'auto' }}></img>
                </section>
                <section id='section-modules'>
                    { this.state.modules.map(module => (
                        <div id={ `modules-item-${ module.id }` } className='modules-item' style={{ border: '1px solid gray' }}>
                            <Link to={ `/dashboard/${ module.id }` }>
                                <FeatherIcon icon={ module.icon }></FeatherIcon>
                                <div className='modules-item-body'>
                                    <b>{ module.name }</b>
                                </div>
                            </Link>
                        </div>
                    )) }
                </section>
            </div>
        );
    }
    
    getAuthToken = () => {
        return sessionStorage.getItem('_a');
    }
    
}