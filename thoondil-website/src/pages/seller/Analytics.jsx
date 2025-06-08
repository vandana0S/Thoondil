import React from 'react'
import './Analytics.css'

const Analytics = () => {
  return (
    <div className="container">
      <div className="analytics-container">
        <h2>Sales Analytics</h2>
        <div className="analytics-cards">
          <div className="card">
            <h3>Total Orders</h3>
            <p>120</p>
          </div>
          <div className="card">
            <h3>Total Revenue</h3>
            <p>₹85,000</p>
          </div>
          <div className="card">
            <h3>New Customers</h3>
            <p>25</p>
          </div>
          <div className="card">
            <h3>Top Product</h3>
            <p>Crab Meat</p>
          </div>
        </div>
      </div>
      <div className="home-container">
        {/* Footer Links */}
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

export default Analytics
