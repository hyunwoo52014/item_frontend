//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Main from './pages/Main';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Content from './Content';
import Register from "./pages/Register";
import Find from "./pages/Find";
import { GoogleOAuthProvider } from "@react-oauth/google";

import AdditionalInfo from "./pages/AdditionalInfo";
import AuthCallback from "./pages/AuthCallback";

import './App.css';



const GOOGLE_CLIENT_ID = "1021558466697-kla37dmk6qbmlmborh0f3e99pugk71qr.apps.googleusercontent.com";

const App = () => {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div id='app'>
                <Routes>
                    <Route exact path='/' element={<Login />} />
                    <Route exact path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/additional-info' element={<AdditionalInfo />} />
                    <Route path='/auth-callback' element={<AuthCallback />} />
                    <Route path='/find' element={<Find />} />
                    <Route exact path='/main' element={<Main />} />
                    <Route path='/dashboard' element={<Dashboard />}>
                        <Route path='menu' element={<Menu />} />
                        <Route path=':type/:menu' element={<Content />} />
                    </Route>
                </Routes>
            </div>
        </GoogleOAuthProvider>


    );
}

export default App;

