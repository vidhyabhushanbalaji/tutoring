import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import './App.css'
import Login from './Login';
import Setup from './Setup';
import Home from './home';
import axios from 'axios'
//import AuthProvider from './hooks/AuthProvider';

function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/setup" element={<Setup/>}/>
            <Route exact path="/home" element={<Home/>}/>
            <Route exact path="/" element={<Login/>}/>
          </Routes>
        </BrowserRouter>

    </>
  )
}


export default App;