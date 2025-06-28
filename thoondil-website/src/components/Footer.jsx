import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="thoondil-footer">
      <pre>
        &copy; {new Date().getFullYear()} Thoondil. All Rights Reserved.
      </pre>
    </footer>
  )
}
