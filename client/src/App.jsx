import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import './App.css'
import Login from './Login';
import Setup from './Setup';
import Home from './TutorPage/home';
import Student from './TutorPage/student'
import Test from './test';
import Tutoring from './StudentPage/tutoring'
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
            <Route exact path="/student/:clientlink" element={<Student />}/>
            <Route exact path="/tutoring/:clientlink" element={<Tutoring />}/>
            <Route exact path="/test" element={<Test/>}/>
          </Routes>
        </BrowserRouter>

    </>
  )
}


export default App;