import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Profile.css'
import {
  FaUserEdit,
  FaTrashAlt,
  FaBell,
  FaLock,
  FaLanguage,
  FaCreditCard,
  FaShareAlt,
  FaClipboardList,
} from 'react-icons/fa'

const Profile = () => {
  const navigate = useNavigate()
  const [editMode, setEditMode] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [user, setUser] = useState({
    name: 'Vandana Singh',
    email: 'vandana@thoondil.com',
    phone: '9876543210',
    address: 'Delhi, India',
    profileImg: 'https://i.pravatar.cc/150?img=47',
  })

  const [formData, setFormData] = useState({ ...user })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, profileImg: imageUrl }))
      if (!editMode) setEditMode(true)
    }
  }

  const handleEditToggle = () => {
    if (editMode) {
      setUser({ ...formData })
    }
    setEditMode(!editMode)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDelete = () => {
    setShowModal(false)
    alert('Account deleted (simulation).')
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="image-wrapper">
            <img src={formData.profileImg} alt="User" className="profile-img" />
            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="upload-input"
              />
            )}
          </div>
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
          <button className="edit-btn" onClick={handleEditToggle}>
            <FaUserEdit /> {editMode ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="profile-details">
          <div className="detail-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          <div className="detail-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          <div className="detail-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Settings</h3>
          <ul className="settings-list">
            <li onClick={() => navigate('/orders')}>
              <FaClipboardList /> My Orders
            </li>
            <li onClick={() => navigate('/language')}>
              <FaLanguage /> Language Updates
            </li>
            <li onClick={() => navigate('/payment-settings')}>
              <FaCreditCard /> Payment Setting
            </li>
            <li
              onClick={() =>
                navigator.share
                  ? navigator.share({
                      title: 'Thoondil App',
                      text: 'Check out the Thoondil app!',
                      url: window.location.href,
                    })
                  : alert('Sharing not supported on this browser')
              }
            >
              <FaShareAlt /> Share the App
            </li>
            <li onClick={() => navigate('/privacy')}>
              <FaLock /> Account Privacy
            </li>
            <li onClick={() => navigate('/notifications')}>
              <FaBell /> Notifications
            </li>
            <li className="delete-account" onClick={() => setShowModal(true)}>
              <FaTrashAlt /> Delete Account
            </li>
          </ul>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure?</h3>
            <p>This action will permanently delete your account.</p>
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile