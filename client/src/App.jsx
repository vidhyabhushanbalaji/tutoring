import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import './App.css'
import Login from './Login'
import Setup from './Setup'
import axios from 'axios'

function App() {
  const nav = useNavigate()
  nav('/login')

  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/login" element={<Login/>}/>
      <Route exact path="/setup" element={<Blog/>}/>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App;