import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { toast } from 'sonner'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { UserAuth } from '../../../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom'


const Header = () => {

  const navigate = useNavigate()

  const { user, logout } = UserAuth()

  //to navigate to sign up
  const LoginToggle = (e) => {
    e.preventDefault()
    navigate('/auth')
  }

  // logout
  const logOutUser = async (e) => {
    e.preventDefault()

    try {
      await logout()
      toast.success('logged out succesfully')
    } catch (error) {
      toast.error(String(error.code).split("/")[1].replaceAll("-", " "))
    }
  }

  return (
    <Navbar data-bs-theme="dark" collapseOnSelect expand="xl" className="bg-body-tertiary" sticky='top'>
      <Container>
        <Navbar.Brand className='logoMain'>Budget<span className='text-primary'>Boss</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link to='#' ></Nav.Link>
          </Nav>
          <Nav>
            {user ? <NavDropdown title={` user: ${user.email}`} id="collapsible-nav-dropdown">
              <NavDropdown.Item onClick={e => logOutUser(e)}>
                Logout?
              </NavDropdown.Item>
            </NavDropdown> :
              <Button onClick={e => LoginToggle(e)} variant='primary'>Login</Button>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header