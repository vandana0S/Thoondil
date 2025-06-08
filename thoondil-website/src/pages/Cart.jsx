import React from 'react'
import './Cart.css'
import { FaTrashAlt } from 'react-icons/fa'
import catla from '../assets/catla.jpg'
import rohu from '../assets/rohu.jpg'
import squid from '../assets/squid.png'

const Cart = () => {
  // Dummy cart items for display purpose
  const cartItems = [
    {
      id: 1,
      name: 'Catla',
      price: 250,
      quantity: 2,
      image: catla,
    },
    {
      id: 2,
      name: 'Rohu',
      price: 180,
      quantity: 1,
      image: rohu,
    },
    {
      id: 3,
      name: 'Squid',
      price: 480,
      quantity: 1,
      image: squid,
    },
  ]

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-img" />
              <div className="cart-details">
                <h4>{item.name}</h4>
                <p>
                  ₹{item.price} x {item.quantity}
                </p>
              </div>
              <div className="cart-actions">
                <p className="cart-price">₹{item.price * item.quantity}</p>
                <button className="remove-btn">
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h3>Total: ₹{totalPrice}</h3>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
