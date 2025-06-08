import React from 'react'
import './DeliveryStatus.css'

const DeliveryStatus = () => {
  const deliveries = [
    {
      id: 1,
      customer: 'Amit Sharma',
      status: 'Out for Delivery',
      address: 'Mumbai',
    },
    { id: 2, customer: 'Rekha Das', status: 'Delivered', address: 'Chennai' },
    { id: 3, customer: 'Ravi Teja', status: 'Pending', address: 'Hyderabad' },
  ]

  return (
    <div className="container">
      <div className="delivery-container">
        <h2>Delivery Status</h2>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.id}>
                <td>{delivery.customer}</td>
                <td>{delivery.address}</td>
                <td
                  className={delivery.status.replace(/\s/g, '-').toLowerCase()}
                >
                  {delivery.status}
                </td>
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

export default DeliveryStatus
