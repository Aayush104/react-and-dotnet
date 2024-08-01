import React from 'react'
import Register from './Components/Register/Register'
import Login from './Components/Login/Login'
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom'
import ForgetPassword from './Components/ForgetPassword/ForgetPassword'
import VerifyToken from './Components/VerifyToken/VerifyToken'


const App = () => {
  
  return (
    <Router>
   
    <div>
    <Routes>
     
      <Route path='/login' element={<Login />} />
      <Route path='/ForgetPassword' element={<ForgetPassword />} />
      <Route path='/' element={<Register />} />
      <Route path='/VerifyToken/:otp/:Id' element={<VerifyToken />} />
      </Routes>
      
    </div>

   
    </Router>
   
  )

}

export default App
