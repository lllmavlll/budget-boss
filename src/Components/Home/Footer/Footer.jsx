import React from 'react'
import './Footer.css'
import { Container } from 'react-bootstrap';


const Footer = () => {
  return (
    <footer className="py-4">
      <Container>
        <hr className="my-4" />
        <p className="text-center">&copy; {new Date().getFullYear()} Budget Boss. All rights reserved.</p>
        <p className='text-center'>Crteated By Mahesh KN <a className='font-size-large' href='https://www.linkedin.com/in/mahesh-k-n-732121251/' target='_blank'><i className="fa-brands fa-linkedin"></i></a></p>
      </Container>
    </footer>
  )
}

export default Footer