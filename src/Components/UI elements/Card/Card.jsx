import React from 'react'
import './Card.css'

const Card = ({ children, size }) => {
  return (
    <div className={`col-md-${size} grid-margin stretch-card shadow bg-white rounded cardMain`}>
      <div className="card cardMain">
        <div className="card-body d-grid ">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Card