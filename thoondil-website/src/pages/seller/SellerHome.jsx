import React from 'react'
import './SellerHome.css'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  FiPlusCircle,
  FiPackage,
  FiTruck,
  FiSettings,
  FiShoppingBag,
  FiBarChart2,
  FiDollarSign,
  FiClock,
  FiLayers,
  FiUsers,
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import sellerBanner from '../../assets/seller-page.png'

const summaryData = [
  { name: 'Orders', value: 2500 },
  { name: 'Revenue', value: 8540 },
  { name: 'Pending', value: 400 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b']

const SellerHome = () => {
  return (
    <div className="container">
      <div className="seller-homepage">
        {/* Header Section */}
        {/* <header className="seller-header">
        <h2>Welcome back, Seller!</h2>
        <p>Keep an eye on your store, orders, and performance.</p>
      </header> */}

        {/* Banner */}
        <div className="seller-banner">
          <img src={sellerBanner} alt="Manage Your Store" />
          <p>Explore Thoondil to gain best experience in fishes.</p>
        </div>

        {/* Summary Cards */}
        <div className="seller-dashboard-container">
          {/* Summary Cards */}
          <div className="seller-summary">
            <div className="summary-card">
              <FiShoppingBag size={24} />
              <div>
                <h4>25</h4>
                <p>Total Orders Today</p>
              </div>
            </div>
            <div className="summary-card">
              <FiDollarSign size={24} />
              <div>
                <h4>₹8,540</h4>
                <p>Today's Revenue</p>
              </div>
            </div>
            <div className="summary-card">
              <FiClock size={24} />
              <div>
                <h4>4</h4>
                <p>Pending Deliveries</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-container">
            {/* Bar Chart */}
            <div className="chart-card">
              <h3>Summary Bar Chart</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={summaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="chart-card">
              <h3>Data Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={summaryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {summaryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="seller-actions">
          <Link to="/add-product" className="action-button">
            <FiPlusCircle size={20} />
            <span>Add New Product</span>
          </Link>

          <Link to="/manage-products" className="action-button">
            <FiPackage size={20} />
            <span>Manage Products</span>
          </Link>

          <Link to="/orders" className="action-button">
            <FiShoppingBag size={20} />
            <span>View Orders</span>
          </Link>

          <Link to="/delivery-status" className="action-button">
            <FiTruck size={20} />
            <span>Delivery Status</span>
          </Link>

          <Link to="/analytics" className="action-button">
            <FiBarChart2 size={20} />
            <span>Analytics</span>
          </Link>

          <Link to="/settings" className="action-button">
            <FiSettings size={20} />
            <span>Store Settings</span>
          </Link>

          <Link to="/available-quantity" className="action-button">
            <FiLayers size={20} />
            <span>Available Quantity</span>
          </Link>

          <Link to="/ordered-persons" className="action-button">
            <FiUsers size={20} />
            <span>Ordered Persons Details</span>
          </Link>
        </div>
      </div>

      <div className="home-container">
        {/* Get Our App Section */}
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

export default SellerHome
