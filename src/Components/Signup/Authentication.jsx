import React, { useState } from 'react'
import { UserAuth } from '../../auth/AuthContext'
import { Form, Button } from 'react-bootstrap'
import { Toaster, toast } from 'sonner'
import wallet from '../../assets/images/digiWallet.webp'
import Card from '../UI elements/Card/Card'
import './Authentication.css'

const Authentication = () => {

  const { userLogin, createUser } = UserAuth()
  const [loginView, setLoginView] = useState(true)
  const [inputValue, setInputValue] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const cardStyle = {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const inputHandler = (e) => {
    const { value, name } = e.target

    setInputValue({
      ...inputValue,
      [name]: value
    })
  }

  const loginUser = async (e) => {
    e.preventDefault()
    const { email, password } = inputValue

    const loadingToast = toast.loading('Loading...!')
    try {
      await userLogin(email, password)
      toast.success('logged in succesfully')
      toast.dismiss(loadingToast)

    } catch (error) {
      toast.error(String(error.code).split("/")[1].replaceAll("-", " "))
      toast.dismiss(loadingToast)

    }

  }

  const signinUser = async (e) => {
    e.preventDefault()
    const { email, password, confirmPassword } = inputValue

    if (confirmPassword !== password) {
      toast.warning('Password dosen\'t match')
    }
    else {
      const loadingToast = toast.loading('Loadingg...!')
      try {
        await createUser(email, password)
        toast.success('Account created succesfully')
        toast.dismiss(loadingToast)

      } catch (error) {
        toast.error(String(error.code).split("/")[1].replaceAll("-", " "))
        toast.dismiss(loadingToast)
      }
    }

  }
  return (
    <>
      <div className='d-flex justify-content-center align-items-center signup-main' style={{ height: '100vh' }} >
        <Card size={3}>
          <h2 className="mb-4">Budget<span className='text-primary'>Boss</span></h2>
          <div className='sign-up-form-div'>
            {loginView ?
              (
                <Form onSubmit={e => loginUser(e)} >
                  <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      value={inputValue.email}
                      type="email"
                      name="email"
                      onChange={inputHandler}
                    />
                  </Form.Group>

                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      value={inputValue.password}
                      type="password"
                      name="password"
                      onChange={inputHandler}
                    />
                  </Form.Group>

                  <Button className='my-4' variant="primary" type="submit">
                    Login
                  </Button>
                  <Form.Text className='mx-3'>
                    new here? signup <span onClick={() => setLoginView(false)} style={{ cursor: 'pointer' }} className='text-primary cursor-pointer'>here</span>
                  </Form.Text>
                </Form>
              )
              :
              (
                <Form onSubmit={e => signinUser(e)} >
                  <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      value={inputValue.email}
                      name='email'
                      type="email"
                      onChange={inputHandler}
                    />
                  </Form.Group>

                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      value={inputValue.password}
                      type="password"
                      name="password"
                      onChange={inputHandler}
                    />
                  </Form.Group>

                  <Form.Group controlId="password">
                    <Form.Label> Confirm Password</Form.Label>
                    <Form.Control
                      value={inputValue.confirmPassword}
                      type="password"
                      name="confirmPassword"
                      onChange={inputHandler}

                    />
                  </Form.Group>

                  <Button className='my-4' variant="primary" type="submit">
                    signup
                  </Button>
                  <Form.Text className='mx-3'>
                    already have an account? login <span onClick={() => setLoginView(true)} className='text-primary' style={{ cursor: 'pointer' }}>here</span>
                  </Form.Text>
                </Form>
              )}
          </div>
        </Card>
      </div >
      <Toaster richColors position='bottom-right' />
    </>

  )
}

export default Authentication