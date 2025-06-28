import React, { useState } from 'react'
import './Navbar.css'
import {
  FaHome,
  FaSearch,
  FaShoppingCart,
  FaUserCircle,
  FaClipboardList,
  FaBars,
  FaTimes,
  FaLanguage,
} from 'react-icons/fa'
import logo from '../assets/logo2.jpg'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <nav className="thoondil-navbar">
      <div className="navbar-header">
        <div className="logo-section">
          <img src={logo} alt="Thoondil Logo" className="logo-img" />
          <div className="name-slogan">
            <h2 className="logo-text">THOONDIL</h2>
            <p className="slogan">The Best Fish Supplies</p>
          </div>
        </div>

        <div className="nav-right-buttons">
          <div className="search-btn">
            <input type="search" placeholder="Search your favorite fish." />
            <FaSearch className="search-icon" />
          </div>

          <div className="lang-btn">
            {/* <label htmlFor="language-select" className="lang-label"></label> */}
            <select id="language-select" className="language-select">
              <option value="" className="display-value">
                Preferred Language
              </option>
              <option value="en" className="display-value">
                English
              </option>
              <option value="hi" className="display-value">
                Hindi
              </option>
              <option value="ta" className="display-value">
                Tamil
              </option>
              <option value="te" className="display-value">
                Telugu
              </option>
              <option value="bn" className="display-value">
                Bengali
              </option>
              <option value="ml" className="display-value">
                Malayalam
              </option>
              <option value="mr" className="display-value">
                Marathi
              </option>
              <option value="ur" className="display-value">
                Urdu
              </option>
            </select>
          </div>

          <div className="login-buttons">
            <Link to="/consumer/login">
              <button className="login-btn cust">Login as Customer</button>
            </Link>
            <Link to="/seller/login">
              <button className="login-btn seller">Login as Seller</button>
            </Link>
          </div>
        </div>

        <div className="menu-toggle white-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {menuOpen && (
        <ul className="nav-list open">
          <li className="nav-item">
            <a href="/consumer/Home">
              <FaHome className="nav-icon toggle-icon" />
              <span>Customer's Home</span>
            </a>
          </li>

          <li className="nav-item">
            <a href="/seller/SellerHome">
              <FaHome className="nav-icon toggle-icon" />
              <span>Seller's Home</span>
            </a>
          </li>

          <li className="nav-item">
            <a href="/Orders">
              <FaClipboardList className="nav-icon toggle-icon" />
              <span>My Orders</span>
            </a>
          </li>

          <li className="nav-item">
            <a href="/Cart">
              <FaShoppingCart className="nav-icon toggle-icon" />
              <span>Cart</span>
            </a>
          </li>

          <li className="nav-item">
            <a href="/Profile">
              <FaUserCircle className="nav-icon toggle-icon" />
              <span>My Profile</span>
            </a>
          </li>
        </ul>
      )}
    </nav>
  )
}

export default Navbar
