import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const VerifyToken = () => {
    const [token, setToken] = useState('');
    const [passwordReset, setPasswordReset] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [userId,setUserId] = useState('')
    const navigateTo = useNavigate('')
    const { otp, Id } = useParams();



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`https://localhost:7252/api/Account/VerifyToken/${otp}/${Id}`, {
                Otp: token
            });

            if (response.status === 200) {

                console.log(response.data)
                setToken('')
                setPasswordReset(true);
              setUserId(response.data);
             
               
            } else {
                throw new Error('An error occurred');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleNewPassword = async (e) => {
        e.preventDefault();
    const response = await axios.post(`https://localhost:7252/api/Account/ResetPassword/${userId}`,{
        NewPassword : newPassword,
        OldPassword : oldPassword
    })

    console.log(response)

    if(response.status == 200)
    {
        navigateTo('/login');
        setPasswordReset(false)
    }
    
    };

    return (
        passwordReset ? (
            <div className="register-container">
                <h2 className="register-heading">Enter Your New Password</h2>
                <form className="register-form" onSubmit={handleNewPassword}>
                    <div className="form-group">
                        <label htmlFor="newpassword" className="form-label">New Password</label>
                        <input
                            id="newpassword"
                            type="password"
                            className="form-input"
                            required
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e)=>setNewPassword(e.target.value)}
                           
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmpassword" className="form-label">Confirm Password</label>
                        <input
                            id="confirmpassword"
                            type="password"
                            className="form-input"
                            required
                            placeholder="Confirm your new password"
                            value={oldPassword}
                            onChange={(e)=>setOldPassword(e.target.value)}
                            
                        />
                    </div>
                    <button type="submit" className="register-button">Submit</button>
                </form>
            </div>
        ) : (
            <div className="register-container">
                <h2 className="register-heading">Enter Your OTP</h2>
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="token" className="form-label">OTP</label>
                        <input
                            id="token"
                            type="text"
                            className="form-input"
                            required
                            placeholder="Enter your OTP"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="register-button">Submit</button>
                </form>
            </div>
        )
    );
};

export default VerifyToken;
