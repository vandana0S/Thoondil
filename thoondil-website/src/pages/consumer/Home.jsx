import React, { useState, useRef, useEffect } from 'react'
import './Home.css'
import { FiHeart, FiFilter, FiClock, FiGift } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import fishData from '../../FishData'
import banner from '../../assets/customer-page.png'

const Home = () => {
  const [showFilter, setShowFilter] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [showOffers, setShowOffers] = useState(false)
  const [showRewards, setShowRewards] = useState(false)

  const [specificDate, setSpecificDate] = useState('')

  const filterRef = useRef(null)
  const scheduleRef = useRef(null)

  const toggleFilter = () => {
    setShowFilter((prev) => !prev)
    setShowSchedule(false)
  }

  const toggleSchedule = () => {
    setShowSchedule((prev) => !prev)
    setShowFilter(false)
  }

  const [value, setValue] = useState(0)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        scheduleRef.current &&
        !scheduleRef.current.contains(event.target)
      ) {
        setShowFilter(false)
        setShowSchedule(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="container">
      <div className="homepage">
        <div className="offer-banner">
          <img src={banner} alt="20% offer on first order" />
          <p>Explore Thoondil to gain best experience in fishes.</p>
        </div>

        <div className="filter-row">
          <div className="filter-wrapper" ref={filterRef}>
            <button onClick={toggleFilter}>
              <FiFilter /> Filter
            </button>
            {showFilter && (
              <div className="dropdown filter-dropdown">
                <div>
                  <p>Fish Type</p>
                  <select className="dropdown-select">
                    <option>Fresh Water</option>
                    <option>Salt Water</option>
                    <option>Shellfish</option>
                    <option>Exotic</option>
                  </select>
                </div>

                <div>
                  <p>Category</p>
                  <select className="dropdown-select">
                    <option>Whole </option>
                    <option>Sliced </option>
                    <option>Fillet </option>
                    <option>With Head </option>
                    <option>Without Head </option>
                    <option>Ready to Cook</option>
                  </select>
                </div>

                <div>
                  <p>Price Range</p>
                  <label className="val">Value: {value}</label>
                  <input
                    className="dropdown-select"
                    type="range"
                    min="0"
                    max="1000"
                    step="100"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>

                <div>
                  <p>Availability by Weight</p>
                  <select className="dropdown-select">
                    <option>Less than 5kg</option>
                    <option>5 - 10kg</option>
                    <option>More than 10kg</option>
                  </select>
                </div>

                <div>
                  <p>Availability of product</p>
                  <select className="dropdown-select">
                    <option>In stock </option>
                    <option>Coming Soon </option>
                    <option>Pre-order Available </option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="filter-wrapper" ref={scheduleRef}>
            <button onClick={toggleSchedule}>
              <FiClock /> Schedule
            </button>
            {showSchedule && (
              <div className="dropdown schedule-dropdown">
                <p>Choose Delivery Date</p>
                <input
                  type="date"
                  className="dropdown-date"
                  value={specificDate}
                  onChange={(e) => setSpecificDate(e.target.value)}
                />

                <p>Choose Day</p>
                <select className="dropdown-select">
                  <option>Today</option>
                  <option>Tomorrow</option>
                </select>

                <p>Select Slot</p>
                <select className="dropdown-select">
                  <option>Morning (8am - 10am)</option>
                  <option>Afternoon (1pm - 3pm)</option>
                  <option>Evening (6pm - 8pm)</option>
                </select>

                <p>Subscription</p>
                <select className="dropdown-select">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Yearly</option>
                </select>
              </div>
            )}
          </div>

          <button onClick={() => setShowOffers(true)}>
            <FiGift /> Offers
          </button>
          <button onClick={() => setShowRewards(true)}>
            <FiHeart /> Rewards
          </button>
        </div>

        {/* Popups */}
        {showOffers && (
          <div className="popup">
            <div className="popup-content">
              <h2>Special Offers 🎉</h2>
              <p>Get 20% off on your first order.</p>
              <button onClick={() => setShowOffers(false)}>Close</button>
            </div>
          </div>
        )}
        {showRewards && (
          <div className="popup">
            <div className="popup-content">
              <h2>Rewards 💰</h2>
              <p>You’ve earned 150 points!</p>
              <button onClick={() => setShowRewards(false)}>Close</button>
            </div>
          </div>
        )}

        <div className="product-list">
          {fishData.map((fish) => (
            <div className="product-card" key={fish.id}>
              <Link to={`/product/${fish.id}`}>
                <img
                  src={fish.image}
                  alt={fish.name}
                  className="product-image"
                />
              </Link>
              <div className="product-details">
                <h4>{fish.name}</h4>
                <p>Rs. {fish.price}/kg</p>
                <p>Availability: {fish.availability}kg</p>
                <p className="special">Special discount available!</p>
                <div className="rating">
                  {[...Array(fish.rating)].map((_, i) => (
                    <FaStar key={i} color="gold" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-container">
        <section className="get-app-section">
          <h3>Get our Thoondil App</h3>
          <p>Order fresh seafood at your fingertips. Download now!</p>
          <div className="app-buttons">
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
              />
            </a>
            <a
              href="https://apple.com/app-store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
              />
            </a>
          </div>
        </section>

        <footer className="footer footer-links">
          <div className="footer-columns">
            <div className="column">
              <h4>Company</h4>
              <ul>
                <li>
                  <a href="/about">About Us</a>
                </li>
                <li>
                  <a href="/weprovide">What we provide</a>
                </li>
                <li>
                  <a href="/privacy">Privacy Policy</a>
                </li>
              </ul>
            </div>
            <div className="column">
              <h4>Contact</h4>
              <ul>
                <li>
                  Email:{' '}
                  <a href="mailto:thoondil@gmail.com">thoondil@gmail.com</a>
                </li>
                <li>
                  LinkedIn: <a href="/linkedin">Thoondil</a>
                </li>
              </ul>
            </div>
            <div className="column">
              <h4>Available in</h4>
              <ul>
                <li>Delhi</li>
                <li>Kolkata</li>
                <li>Tamil Nadu</li>
                <li>Hyderabad</li>
                <li>Bangalore</li>
                <li>and more...</li>
              </ul>
            </div>
            <div className="column">
              <h4>Connect</h4>
              <ul>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home
