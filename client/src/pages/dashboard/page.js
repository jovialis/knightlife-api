import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from 'axios';

import FeatherIcon from 'feather-icons-react';

// Styles
import './styles.css';

export default class PageDashboard extends Component {

    state = {
        redirect: false,
        validating: true,
        loading: true,
        overview: null,
        modules: null
    }

    componentDidMount() {
        document.title = 'KL - Dashboard';

        this.validateToken().then((valid) => {
            if (valid) {
                this.setState({
                    validating: false
                });
            } else {
                this.setState({
                    redirect: true,
                    validating: false
                });
            }
        }, (error) => {
            this.setState({
                redirect: true,
                validating: false
            });
        });
    }

    componentDidUpdate() {
        // If we're no longer validating, and we don't have to redirect and we haven't loaded yet
        if (!this.state.validating && !this.state.redirect && this.state.loading) {
            axios.post('/dashboard/page/home', {
                _a: this.getAuthToken()
            }).then(res => {
                const data = res.data;

                if (data) {
                    const index = data.index;

                    if (index) {
                        this.setState({
                            overview: index.overview,
                            modules: index.modules,
                            loading: false
                        });

                        return;
                    }
                }
                
                this.setState({
                    loading: false
                });
            }, err => {
                this.setState({
                    loading: false
                });
            });
        }
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
        if (this.state.validating) {
            return (
                <span>Authenticating...</span>
            );
        } else if (this.state.redirect) {
            return (
                <Redirect to='/dashboard'></Redirect>
            );
        } else if (this.state.loading) {
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
                    <h2>{ this.state.overview.name }</h2>
                    <h5>{ this.state.overview.username }</h5>
                    <img src={ this.state.overview.picture } style={{ width: '200px', height: 'auto' }}></img>
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

    validateToken = () => {
        return new Promise((resolve, reject) => {
            const token = this.getAuthToken();

            if (!token) {
                resolve(false);
                return;
            }

            axios.post('/dashboard/do/auth/session/validate', {
                _a: token
            }).then(res => {
                const data = res.data;

                if (data) {
                    const index = data.index;

                    if (index) {
                        const valid = index.valid;
                        resolve(valid);

                        return;
                    }
                }

                reject('An error occurred.');
            }, err => {
                reject(err.message);
            });
        });
    }

    getAuthToken = () => {
        return sessionStorage.getItem('_a');
    }

}