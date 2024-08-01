import React, { useState } from 'react';
import './Register.css';
import useStore from '../Store/Store';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  const registerUser = useStore((state) => state.registerUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
        UserName: username,
        EmailAddress: email,
        UserAddress: address,
        UserPassword: password
    };
    console.log("Submitting data:", userData); 
    await registerUser(userData);
  };

  return (
    <div className="register-container">
      <h2 className="register-heading">Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            id="username"
            type="text"
            className="form-input"
            required
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
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
          <label htmlFor="address" className="form-label">Address</label>
          <input
            id="address"
            type="text"
            className="form-input"
            required
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
