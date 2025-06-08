// src/pages/common/RoleSelection.jsx
import { useNavigate } from 'react-router-dom'
import './RoleSelection.css'

function RoleSelection() {
  const navigate = useNavigate()

  return (
    <div className="role-selection">
      <h2>Welcome to Thoondil</h2>
      <button onClick={() => navigate('/consumer/login')}>
        Continue as Consumer
      </button>
      <button onClick={() => navigate('/seller/login')}>
        Continue as Seller
      </button>
    </div>
  )
}

export default RoleSelection
