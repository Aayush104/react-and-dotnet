import React from 'react'
import Register from './Components/Register/Register'
import Login from './Components/Login/Login'
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom'
import ForgetPassword from './Components/ForgetPassword/ForgetPassword'
import VerifyToken from './Components/VerifyToken/VerifyToken'
import Home from './Components/Home/Home'
import AddProducts from './Components/AddProducts/AddProducts'
import AddCategory from './Components/AddCatgeory/AddCategory'
import Category from './Components/Category/Category'
import Chat from './Components/Chat/Chat'


const App = () => {
  
  return (
    <Router>
   
    <div>
    <Routes>
     
      <Route path='/login' element={<Login />} />
      <Route path='/ForgetPassword' element={<ForgetPassword />} />
      <Route path='/' element={<Register />} />
      <Route path='/Home' element= {<Home/>} />
      <Route path='/AddProduct' element= {<AddProducts/>} />
      <Route path='/AddCategory' element= {<AddCategory/>} />
      <Route path='/VerifyToken/:otp/:Id' element={<VerifyToken />} />
      <Route path='/Category/:id' element={<Category />} />
      <Route path='/Chat' element={<Chat />} />
     
      </Routes>
      
    </div>

   
    </Router>
   
  )

}

export default App
