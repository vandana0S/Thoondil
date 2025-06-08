import React from 'react'
import './Orders.css'
import { FaBoxOpen, FaTruck, FaCheckCircle } from 'react-icons/fa'
import fish1 from '../../assets/rohu.jpg'
import fish2 from '../../assets/prawns.jpeg'
import fish3 from '../../assets/sardines.jpg'


const Orders = () => {
  const orders = [
    {
      id: 'ORD1234',
      product: 'Fresh Rohu Fish - 1kg',
      date: 'April 10, 2025',
      status: 'Delivered',
      img: fish1,
    },
    {
      id: 'ORD1235',
      product: 'Prawns - Medium Size (500g)',
      date: 'April 17, 2025',
      status: 'Shipped',
      img: fish2,
    },
    {
      id: 'ORD1236',
      product: 'Sardines (250g)',
      date: 'April 19, 2025',
      status: 'Processing',
      img: fish3,
    },
  ]

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <img src={order.img} alt={order.product} className="order-img" />
            <div className="order-info">
              <h4>{order.product}</h4>
              <p>Order ID: {order.id}</p>
              <p>Placed on: {order.date}</p>
              <div className={`order-status ${order.status.toLowerCase()}`}>
                {order.status === 'Delivered' && <FaCheckCircle />}
                {order.status === 'Shipped' && <FaTruck />}
                {order.status === 'Processing' && <FaBoxOpen />}
                <span>{order.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
