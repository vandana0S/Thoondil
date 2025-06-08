import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Splash.css'

import { FaPlusCircle } from 'react-icons/fa'

import fish2 from '../assets/rohu.jpg'
import fish3 from '../assets/roopchand.jpg'
import fish4 from '../assets/pomfret.avif'
import fish5 from '../assets/fish2.jpg'
import fish6 from '../assets/skates.webp'
import fish7 from '../assets/fish4.jpg'
import fish8 from '../assets/pearl-spot.webp'
import fish9 from '../assets/Pangasius.webp'
import fish10 from '../assets/prawns.jpeg'
import fish11 from '../assets/Sardines.jpg'

import fish12 from '../assets/banner4.png'

const images = [fish12]
const fishList = [
  { id: 1, name: 'Skates', price: '₹450/kg', image: fish6 },
  { id: 2, name: 'Tuna', price: '₹550/kg', image: fish3 },
  { id: 3, name: 'Rohu', price: '₹300/kg', image: fish2 },
  { id: 4, name: 'Pearl Spot', price: '₹420/kg', image: fish8 },
  { id: 4, name: 'Pangasius', price: '₹220/kg', image: fish9 },
  { id: 4, name: 'Prawns', price: '₹300/kg', image: fish10 },
  { id: 4, name: 'Sardines', price: '₹620/kg', image: fish11 },
]

const Splash = () => {
  const navigate = useNavigate()
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  // const navigate = useNavigate()

  const handleAddToCart = (fish) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true)
    } else {
      // Add logic to add fish to cart
      alert(`${fish.name} added to cart!`)
    }
  }

  const redirectToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="outer-screen">
      <div className="splash-container">
        <img
          src={images[currentImage]}
          alt="Splash Visual"
          className="splash-image"
        />
        {/* <p>Thoondil – Where Freshness Meets Convenience.</p>  */}
      </div>

      <div className="outer-container">
        <div className="about-section">
          <h2>About Thoondil</h2>
          <p className="allcontent">
            Thoondil connects fishermen, vendors, and consumers to promote
            sustainability and efficiency in India's fisheries. We ensure
            high-quality seafood, support local communities, and deliver
            freshness to your doorstep. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Necessitatibus, laudantium? Eum ad beatae
            voluptates at. Lorem ipsum dolor, sit amet consectetur adipisicing
            elit. Magnam, est impedit optio, excepturi porro tempora nemo
            architecto sed vel commodi eaque quod quaerat? Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Incidunt facere velit,
            accusantium sunt fuga harum dolores nesciunt ex iusto nisi voluptas
            reiciendis ducimus esse illum ipsam maiores, ullam sequi delectus.
          </p>
        </div>

        <div className="info-sections">
          <div className="services-section box">
            <h2>What We Provide</h2>
            <ul>
              <li>🛒 Fresh Fish Delivered Daily</li>
              <li>🚚 Fast & Hygienic Delivery</li>
              <li>📦 Eco-Friendly Packaging</li>
              <li>💬 24/7 Customer Support</li>
            </ul>
          </div>

          <div className="success-section box">
            <h2>Our Success Journey</h2>
            <p className="success-points">
              <span>
                ✅ <strong>10,000+</strong> Satisfied Customers
              </span>
              <span>
                ✅ <strong>95%</strong> Customer Retention
              </span>
              <span>
                ✅ Rated <strong>4.8/5</strong> on Delivery
              </span>
              <span>
                ✅ Preferred for <strong>Best Fish Supplies</strong>
              </span>
            </p>
          </div>
        </div>

        <div className="fish-preview-container">
          <h2>Available Fishes</h2>
          <div className="fish-grid">
            {fishList.map((fish) => (
              <div key={fish.id} className="fish-card">
                <img src={fish.image} alt={fish.name} className="fish-image" />
                <FaPlusCircle
                  className="add-icon"
                  onClick={() => handleAddToCart(fish)}
                  title="Add to cart"
                />
                <div className="fish-info">
                  <h3>{fish.name}</h3>
                  <p>{fish.price}</p>
                </div>
              </div>
            ))}
          </div>

          {showLoginPrompt && (
            <div className="login-prompt">
              <p>Please login to add items to your cart.</p>
              <button onClick={redirectToLogin}>Login</button>
            </div>
          )}
        </div>

        <div className="banner-section">
          <h2>Our Services in Action</h2>
          <div className="slider-container">
            <div className="slider">
              {[fish4, fish2, fish5, fish3, fish6, fish2, fish7, fish3].map(
                (img, i) => (
                  <img src={img} alt={`Slide ${i}`} key={i} />
                )
              )}
            </div>
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
                    <a href="mailto:Info@thoondil.co.in">Info@thoondil.co.in</a>
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
                      href="https://twitter.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Twitter
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default Splash
