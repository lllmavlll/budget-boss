import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal';
import { db } from '../../../firebase/config';
import { UserAuth } from '../../../auth/AuthContext';
import { toast } from 'sonner'

const EditExpense = ({ state, handleModal, fetchData, data }) => {

  const { user } = UserAuth()
  const [show, setShow] = useState(true)
  const [inputvalue, setInputValue] = useState({
    name: '',
    category: '',
    dateOfExpense: '',
    amount: '',
    description: '',
  });

  //handle form input
  const formInputHandler = (e) => {
    const { value, name } = e.target

    setInputValue({
      ...inputvalue,
      [name]: value
    })
  }

  //edit data
  const editData = (e) => {
    e.preventDefault()

    toast.success('lmao')
    setShow(false)
  }

  useEffect(() => {
    console.log(data)
    setInputValue({
      name: data.name,
      category: data.category,
      dateOfExpense: data.dateOfExpense,
      amount: data.amount,
      description: data.description,
    })
  }, [])
  return (
    <Modal
      show={show ? state : !state}
      onHide={handleModal}
      backdrop="static"
      keyboard={false}
      size='lg'
    // fullscreen={true}
    >
      <Form onSubmit={e => editData(e)}>

        <Modal.Header closeButton>
          <Modal.Title className='text-primary'>Edit  Exprense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={inputvalue.name}
              type="text"
              name='name'
              placeholder="name"
              autoFocus
              maxLength={140}
              onChange={formInputHandler}


            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="dateOfExpense">
            <Form.Label>Date Of Expense</Form.Label>
            <Form.Control
              value={inputvalue.dateOfExpense}
              type="date"
              name='dateOfExpense'

              onChange={formInputHandler}

            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={inputvalue.category}
              name='category'

              onChange={formInputHandler}


            >
              <option value=''>Select</option>
              <option value='Health'>Health</option>
              <option value='Education'>Education</option>
              <option value='Travel'>Travel</option>
              <option value='Electronics'>Electronics</option>
              <option value='Books'>Books</option>
              <option value='Others'>Others</option>
            </Form.Select>
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="description"
          >
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3}
              value={inputvalue.description}
              name='description'
              placeholder="description"
              onChange={formInputHandler}

            />
          </Form.Group>


          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              value={inputvalue.amount}
              type="number"
              name='amount'
              placeholder="Amount"
              onChange={formInputHandler}



            />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModal}>
            Cancel
          </Button>
          <Button type='submit' variant="primary">Update</Button>
        </Modal.Footer>
      </Form>

    </Modal>
  )
}

export default EditExpense