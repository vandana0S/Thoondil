// src/pages/Location.jsx
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Location.css'

const Location = () => {
  const [address, setAddress] = useState('')
  const navigate = useNavigate()
  const location = useLocation() // new
  const userRole = location.state?.userRole // new

  const handleConfirm = () => {
    if (address.trim().length > 3) {
      console.log('Location confirmed:', address)

      if (userRole === 'seller') {
        navigate('/seller/home')
      } else {
        navigate('/consumer/home')
      }
    } else {
      alert('Please enter a valid location.')
    }
  }

  return (
    <div className="location-container">
      <div className="location-card">
        <h2 className="location-title">Where should we deliver?</h2>
        <input
          type="text"
          placeholder="Enter your delivery location"
          className="location-input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button className="location-button" onClick={handleConfirm}>
          Confirm Location
        </button>
      </div>
    </div>
  )
}

export default Location
