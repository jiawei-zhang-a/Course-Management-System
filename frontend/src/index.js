import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Dashboard from './components/dashboard/Dashboard.js';
import School from './components/Shop/School.js'
import Subject from './components/Shop/Subject.js'
import Course from './components/Shop/Course.js'

import './Login.css';

ReactDOM.render(
    <BrowserRouter>
        <h1>Course Management System</h1>
        <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path='/register' component={Register} />
            <Route path='/shop/school' component={School}/>
            <Route path='/shop/subject' component={Subject}/>
            <Route path='/shop/course' component={Course}/>
            <Route path='/dashboard' component={Dashboard} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);