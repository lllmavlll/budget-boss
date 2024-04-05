import React from 'react'

const Card = ({ children, size }) => {
  return (
    <div className={`col-md-${size} grid-margin stretch-card shadow bg-white rounded`}>
      <div className="card">
        <div className="card-body d-grid ">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Card