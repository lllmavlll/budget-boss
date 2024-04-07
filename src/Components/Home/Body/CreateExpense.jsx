import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap'
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { UserAuth } from '../../../auth/AuthContext';
import { toast } from 'sonner'



const CreateExpense = ({ state, handleModal, fetchData }) => {
  const { user } = UserAuth()
  const [show, setShow] = useState(true)
  const [otherOption, setOtherOption] = useState(false)

  const [inputvalue, setInputValue] = useState({
    name: '',
    category: '',
    dateOfExpense: '',
    amount: '',
    description: '',
    otherCategory: ''
  });

  //handle form input
  const formInputHandler = (e) => {
    const { value, name } = e.target

    setInputValue({
      ...inputvalue,
      [name]: value
    })
  }

  //categoryField handler
  const categoryHandler = (e) => {
    const { value, name } = e.target

    setInputValue({
      ...inputvalue,
      [name]: value
    })
    if (value === 'Others') {
      setOtherOption(true)
    }
    else {
      setOtherOption(false)
    }
  }

  //amount field handler
  const amountFieldHandler = (e) => {
    const { value, name } = e.target

    if (/^\d*$/.test(value)) {
      setInputValue({
        ...inputvalue,
        [name]: value
      })
    }
  }

  const fibaseDatabase = collection(db, 'ExpenseStore')

  const PostData = async (e) => {
    e.preventDefault()

    const { name, category, otherCategory, dateOfExpense, amount, description } = inputvalue
    const finalData = {
      name,
      category: otherOption ? otherCategory : category,
      dateOfExpense,
      amount: Number(amount),
      description,
      createdBy: user.email,
      updatedAt: Date.now()
    }
    const loadingToast = toast.loading('Loading...!')
    try {

      await addDoc(fibaseDatabase, finalData)
      toast.success('Data save Successfully')
      toast.dismiss(loadingToast)
      fetchData()
      setInputValue({
        name: '',
        category: '',
        dateOfExpense: '',
        amount: '',
        description: '',
      })
      setOtherOption(false)
      setShow(!show)
    } catch (error) {
      toast.error(String(error.code).split("/")[1].replaceAll("-", " "))
      toast.dismiss(loadingToast)
    }
  }

  return (
    <Modal
      show={show ? state : !state}
      onHide={handleModal}
      backdrop="static"
      keyboard={false}
      size='lg'
    // fullscreen={true}
    >
      <Form onSubmit={e => PostData(e)}>
        <Modal.Header closeButton>
          <Modal.Title className='text-primary'>Create an Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={inputvalue.name}
              type="text"
              name='name'
              placeholder="Name"
              autoFocus
              maxLength={140}
              onChange={formInputHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="dateOfExpense">
            <Form.Label>Date of Expense</Form.Label>
            <Form.Control
              value={inputvalue.dateOfExpense}
              type="date"
              name='dateOfExpense'
              onChange={formInputHandler}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={inputvalue.category}
              name='category'
              onChange={categoryHandler}
              required
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
          {
            otherOption ? (
              <Form.Group className="mb-3" controlId="otherCategory">
                <Form.Label>Type your Category</Form.Label>
                <Form.Control
                  value={inputvalue.otherCategory}
                  type="text"
                  name='otherCategory'
                  placeholder="Category"
                  autoFocus
                  maxLength={140}
                  onChange={formInputHandler}
                  required
                />
              </Form.Group>
            ) : ('')
          }
          <Form.Group
            className="mb-3"
            controlId="description"
          >
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3}
              value={inputvalue.description}
              name='description'
              placeholder="Description"
              onChange={formInputHandler}
              required
            />
          </Form.Group>


          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              value={inputvalue.amount}
              type="number"
              name='amount'
              placeholder="Amount"
              onChange={amountFieldHandler}
              required
            />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModal}>
            Cancel
          </Button>
          <Button type='submit' variant="primary">Create</Button>
        </Modal.Footer>
      </Form>

    </Modal>
  )
}

export default CreateExpense