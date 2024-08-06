import React, { useState } from 'react'
import useStore from '../Store/Store'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const Login = () => {
    const [password,setPassword] = useState('')
const [email,setEmail] = useState('')
const navigateTo = useNavigate('');

const loginUser = useStore((state)=>state.loginUser)
const handleSubmit = async (e) =>{

    e.preventDefault();
    const userData = {
        EmailAddress : email,
        UserPassword : password

    }

  const result =   await loginUser(userData)


  if(result)
  {
    console.log("loginsuccess")

    console.log(result)
    Cookies.set("Token", result)
    navigateTo('/Home')
  }
}

  return (
    <div className="register-container">
    <h2 className="register-heading">Register</h2>
    <form className="register-form" onSubmit={handleSubmit}>
     
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email Address</label>
        <input
          id="email"
          type="email"
          className="form-input"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
     
      <div className="form-group">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          id="password"
          type="password"
          className="form-input"
          required
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="register-button">Login</button>
    </form>
  </div>
  )
}

export default Login
