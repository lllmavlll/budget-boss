import React from 'react'
import { UserAuth } from '../auth/AuthContext'
import { Navigate } from 'react-router-dom'

const PrivateRoutes = ({ children }) => {
  const { user } = UserAuth()
  // const user = 'mahesh'
  if (!user) {
    return <Navigate to='/auth' />
  }
  return children;

}

export default PrivateRoutes