import React from 'react'
import './AvailableQuantity.css'
import '../../FishData'

const sampleStockData = [
  {
    id: 1,
    name: 'Salmon',
    type: 'Freshwater',
    availableQty: '45 kg',
    pricePerKg: '₹600',
  },
  {
    id: 2,
    name: 'Tuna',
    type: 'Saltwater',
    availableQty: '30 kg',
    pricePerKg: '₹750',
  },
  {
    id: 3,
    name: 'Rohu',
    type: 'Freshwater',
    availableQty: '100 kg',
    pricePerKg: '₹250',
  },
  {
    id: 4,
    name: 'Pomfret',
    type: 'Saltwater',
    availableQty: '20 kg',
    pricePerKg: '₹950',
  },
]

const AvailableQuantity = () => {
  return (
    <div className="container">
      <div className="available-quantity-page">
        <h2>Available Fish Stock</h2>
        <table className="stock-table">
          <thead>
            <tr>
              <th>Fish Name</th>
              <th>Type</th>
              <th>Available Quantity</th>
              <th>Price per Kg</th>
            </tr>
          </thead>
          <tbody>
            {sampleStockData.map((fish) => (
              <tr key={fish.id}>
                <td>{fish.name}</td>
                <td>{fish.type}</td>
                <td>{fish.availableQty}</td>
                <td>{fish.pricePerKg}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default AvailableQuantity
