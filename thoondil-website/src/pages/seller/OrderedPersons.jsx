import React from 'react'
import './OrderedPersons.css'

const orderedUsers = [
  {
    id: 1,
    name: 'Amit Kumar',
    phone: '9876543210',
    location: 'Lucknow, UP',
    fish: {
      name: 'Salmon',
      type: 'Freshwater',
      quantity: '5 kg',
      price: '₹600/kg',
    },
  },
  {
    id: 2,
    name: 'Sneha Roy',
    phone: '9123456789',
    location: 'Kolkata, WB',
    fish: {
      name: 'Rohu',
      type: 'Freshwater',
      quantity: '8 kg',
      price: '₹250/kg',
    },
  },
  {
    id: 3,
    name: 'Ravi Verma',
    phone: '9998887777',
    location: 'Mumbai, MH',
    fish: {
      name: 'Pomfret',
      type: 'Saltwater',
      quantity: '3 kg',
      price: '₹950/kg',
    },
  },
]

const OrderedPersons = () => {
  return (
    <div className="container">
      <div className="ordered-persons-page">
        <h2>Ordered Persons Details</h2>
        <div className="ordered-list">
          {orderedUsers.map((user) => (
            <div className="ordered-card" key={user.id}>
              <h3>{user.name}</h3>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
              <p>
                <strong>Location:</strong> {user.location}
              </p>
              <div className="fish-details">
                <p>
                  <strong>Fish Ordered:</strong> {user.fish.name}
                </p>
                <p>
                  <strong>Type:</strong> {user.fish.type}
                </p>
                <p>
                  <strong>Quantity:</strong> {user.fish.quantity}
                </p>
                <p>
                  <strong>Price:</strong> {user.fish.price}
                </p>
              </div>
            </div>
          ))}
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

export default OrderedPersons
