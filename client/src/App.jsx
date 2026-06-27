import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import './App.css'
import Login from './Login';
import Setup from './Setup';
import axios from 'axios'
import AuthProvider from './hooks/AuthProvider';

function App() {
    const [userID, setUserID] = useState(-1)
  return (
    <>
      <div className='App'>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/setup" element={<Setup/>}/>
            <Route exact path="/" element={<Login/>}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      </div>

    </>
  )
}


export default App;