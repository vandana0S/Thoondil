// src/pages/OTP.jsx
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './OTP.css'

const OTP = () => {
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const phone = location.state?.phone || 'your number'
  const userRole = location.state?.userRole 

  const handleVerify = () => {
    if (otp.length === 4 && /^\d{4}$/.test(otp)) {
      console.log(`OTP entered for ${phone}:`, otp)
      navigate('/location', { state: { userRole: userRole } }) // pass userRole
    } else {
      alert('Please enter a valid 4-digit OTP.')
    }
  }

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2 className="otp-title">Enter OTP</h2>
        <p className="otp-subtitle">
          Sent to <span className="otp-phone">{phone}</span>
        </p>

        <input
          type="text"
          inputMode="numeric"
          maxLength="4"
          placeholder="____"
          className="otp-input"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
        />

        <button className="otp-button" onClick={handleVerify}>
          Verify & Continue
        </button>

        <div className="otp-options">
          <button className="otp-link">Get via SMS</button>
          <button className="otp-link">Get via Call</button>
        </div>
      </div>
    </div>
  )
}

export default OTP
