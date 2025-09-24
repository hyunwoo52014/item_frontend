//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Main from './pages/Main';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Content from './Content';



import './App.css'
import Notice from "./pages/notice/Notice";


const App = () => {
  return (
    <div id='app'>
    <Routes>
      <Route exact path='/' element={<Login />} />
      <Route exact path='/login' element={<Login />} />
      <Route exact path='/main' element={<Main />} />
      <Route exact path='/dashboard' element={<Dashboard />} >
        <Route path='/dashboard/menu' element={<Menu />} />
          <Route path='notice' element={<Notice />} />
          <Route path='/dashboard/:type/:menu' element={<Content />} />

      </Route>
    </Routes>
    </div>
  );
}

export default App

