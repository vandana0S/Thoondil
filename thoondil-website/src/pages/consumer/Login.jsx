// src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const navigate = useNavigate()

  const handleContinue = () => {
    if (name.trim() === '') {
      alert('Please enter your name.')
    } else if (phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number.')
    } else {
      console.log('Sending OTP to:', phone)
    navigate('/otp', { state: { phone: phone, userRole: 'consumer' } })
    }
  }

  const handleGoogleLogin = () => {
    console.log('Redirecting to Google Login...')
    // You can integrate Firebase Auth / OAuth logic here
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome to Thoondil</h2>
        <p className="login-subtitle">Login to continue as customer.</p>

        <input
          type="text"
          placeholder="Enter your name"
          className="login-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="tel"
          maxLength="10"
          placeholder="Enter mobile number"
          className="login-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
        />

        <button className="login-button" onClick={handleContinue}>
          Continue with OTP
        </button>

        <div className="login-divider">OR</div>

        <button className="google-button" onClick={handleGoogleLogin}>
          Login with Google
        </button>
      </div>
    </div>
  )
}

export default Login
