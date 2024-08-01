import React, { useState } from 'react'
import useStore from '../Store/Store'
import { useNavigate } from 'react-router-dom'


const ForgetPassword = () => {
    const [email,setEmail] = useState('')
    const navigateTo = useNavigate()
const forgetPassword = useStore((store)=>store.forgetPassword)

    const handleSubmit= async (e)=>{
        e.preventDefault();
        const mail = {
            EmailAddress: email
        }
      const result =   await forgetPassword(mail);

      if(result){

        console.log("forgte to response", result)
        
        navigateTo(`/VerifyToken/${result.token}/${result.userId}`)
      }
    }



  return (
    <div className="register-container">
    <h2 className="register-heading">Enter Your Gmail</h2>
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
     
     
      <button type="submit" className="register-button">Submit</button>
    </form>
  </div>
  )
}

export default ForgetPassword
