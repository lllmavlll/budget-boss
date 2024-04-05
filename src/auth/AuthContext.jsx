import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from '../firebase/config';

const UserContext = createContext();


export const AuthContext = ({ children }) => {
  const [isloading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  //signup
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  //signout
  const logout = () => {
    return signOut(auth);
  };

  //signin
  const userLogin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(true);
    });
    return () => {
      unsubscribe();
    };
  });

  return (
    <UserContext.Provider
      value={{
        user,
        createUser,
        userLogin,
        logout,
      }}
    >
      {
        isloading ?
          children
          :
          <>
            <div className="d-flex justify-center align-item-center vh-100">
              <span className="visually-hidden">Loading...</span>
            </div>
          </>
      }
    </UserContext.Provider>
  )
}

export const UserAuth = () => {
  return useContext(UserContext);
}