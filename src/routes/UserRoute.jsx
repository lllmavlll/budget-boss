import React from 'react'
import { UserAuth } from '../auth/AuthContext'
import { Navigate } from 'react-router-dom';


const UserRoute = ({ children }) => {

  const { user } = UserAuth()
  // const user = 'mahesh'
  if (user) {
    return <Navigate to='/' replace={true} />
  }
  return children;
}

export default UserRoute