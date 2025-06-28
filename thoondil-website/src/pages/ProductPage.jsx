// src/ProductPage.jsx
import React from 'react'
import { useParams } from 'react-router-dom'
import fishData from '../FishData.jsx'
import { FiShare2 } from 'react-icons/fi'
import './ProductPage.css'

const ProductPage = () => {
  const { productId } = useParams()
  const fish = fishData.find((f) => f.id === parseInt(productId))

  if (!fish) return <p>Fish not found.</p>

  const discountedPrice = fish.price - (fish.price * fish.discount) / 100

  return (
    <div className="container">
      <div className="product-page">
        <div className="product-wrapper">
          {/* Left Side: Image */}
          <div className="image-section">
            <img src={fish.image} alt={fish.name} className="product-image" />
            <button className="share-btn">
              <FiShare2 />
            </button>
          </div>

          {/* Right Side: Sticky Details */}
          <div className="detail-section">
            <div className="sticky-box">
              <div className="offer-tag">Limited time offer</div>
              <div className="price-row">
                <span className="discount">-{fish.discount}%</span>
                <span className="price">₹{discountedPrice}</span>
                <span className="per-kg">(₹{fish.price}/kg)</span>
              </div>

              <h4>{fish.name}</h4>
              <p>{fish.description}</p>
              <p className="special">Special discount available!</p>
              <p>Availability: {fish.availability}kg</p>

              <select className="quantity-select">
                <option>Quantity in kg: 1</option>
                <option>2</option>
                <option>5</option>
              </select>

              <div className="action-buttons">
                <button className="add-cart">Add to Cart</button>
                <button className="buy-now">Buy Now</button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="reviews-section">
            <h3>Customer Reviews</h3>
            <div className="review">
              <p className="reviewer">Amit Sharma</p>
              <p>Fresh and delicious! Will order again. ⭐⭐⭐⭐⭐</p>
            </div>
            <div className="review">
              <p className="reviewer">Sneha Raj</p>
              <p>Good packaging and timely delivery. ⭐⭐⭐⭐☆</p>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="related-section">
            <h3>Related Products</h3>
            <div className="related-products">
              {fishData
                .filter((item) => item.id !== fish.id)
                .slice(0, 4)
                .map((item) => (
                  <div key={item.id} className="related-card">
                    <img src={item.image} alt={item.name} />
                    <p>{item.name}</p>
                    <p className="price">₹{item.price}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-container">
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

export default ProductPage
