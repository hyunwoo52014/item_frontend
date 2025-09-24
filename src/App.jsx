//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Main from './pages/Main';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Content from './Content';
import Returns from './pages/requests/Returns';

import './App.css';


const App = () => {
    return (
        <div id='app'>
            <Routes>
                <Route exact path='/' element={<Login />} />
                <Route exact path='/login' element={<Login />} />
                <Route exact path='/main' element={<Main />} />
                <Route path='/dashboard' element={<Dashboard />}>
                    <Route path='menu' element={<Menu />} />
                    <Route path=':type/:menu' element={<Content />} />
                </Route>
                <Route path='/returns' element={<Returns />} />
            </Routes>
        </div>
    );
}

export default App;

