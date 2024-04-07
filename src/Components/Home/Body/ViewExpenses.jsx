import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Form, Button } from 'react-bootstrap'
import Card from '../../UI elements/Card/Card';
import { db } from '../../../firebase/config';
import { toast } from 'sonner'
import { UserAuth } from '../../../auth/AuthContext';
import Table from 'react-bootstrap/Table';
import CreateExpense from './CreateExpense';
import Spinner from 'react-bootstrap/Spinner';

const ViewExpenses = () => {

  const { user } = UserAuth()
  const [isLoading, setIsLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [delModal, setDelModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [dataCollection, setDataCollection] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [filters, setFilters] = useState({
    searchTerm: '',
    dateFilter: ''
  })
  const [object, setObject] = useState({
    id: '',
    email: '',
  })
  const [inputvalue, setInputValue] = useState({
    name: '',
    category: '',
    dateOfExpense: '',
    amount: '',
    description: '',
    id: ''
  });
  const [currentPage, setCurrentPage] = useState(1); // for pagination

  //handle form input
  const formInputHandler = (e) => {
    const { value, name } = e.target

    setInputValue({
      ...inputvalue,
      [name]: value
    })
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

  // PapaHotel-09876@$

  //firebase collection
  const fibaseDatabase = collection(db, 'ExpenseStore')

  //modal handler
  const handleModal = () => {
    setCreateModal(!createModal)
  }


  //modal handler
  const handleEditModal = () => {
    setEditModal(!editModal)
  }

  //fetch data from firebase
  const fetchData = async () => {
    try {
      const q = query(fibaseDatabase, orderBy('updatedAt', 'desc')); // to querry the documents by a updatedAt field in descending order
      const data = await getDocs(q)
      setDataCollection(data.docs.map(doc => (
        {
          id: doc.id,
          ...doc.data()
        }
      )))
      setIsLoading(false)
      console.log(dataCollection)
    } catch (error) {
      console.log(error)
    }
  }

  //function to  Create a Timespan
  const timeAgo = (date) => {
    const now = Date.now();
    const diff = now - date;
    const secondsDiff = Math.floor(diff / 1000);
    const minutesDiff = Math.floor(secondsDiff / 60);
    const hoursDiff = Math.floor(minutesDiff / 60);
    const daysDiff = Math.floor(hoursDiff / 24);

    if (daysDiff > 1) {
      return `${daysDiff} d ago`;
    } else if (daysDiff === 1) {
      return '1 d ago';
    } else if (hoursDiff > 1) {
      return `${hoursDiff} hrs ago`;
    } else if (hoursDiff === 1) {
      return '1 hr ago';
    } else if (minutesDiff > 1) {
      return `${minutesDiff} mis ago`;
    } else if (minutesDiff === 1) {
      return '1 min ago';
    } else {
      return 'just now';
    }
  }

  //delete modal handler
  const handleDelete = (id, email) => {
    setDelModal(!delModal)
    setObject({
      id,
      email
    })
  }

  //to Delete row
  const deleteRow = async (e) => {
    e.preventDefault()
    const { id, email } = object

    if (user.email !== email) {
      toast.error('Unauthorized!')
    }
    else {
      try {
        const deleteData = doc(db, 'ExpenseStore', id)
        await deleteDoc(deleteData)
        setDelModal(false)
        toast.success('Data deleted successfully')
        fetchData()
      } catch (error) {
        toast.error(String(error.code).split("/")[1].replaceAll("-", " "))
      }
    }
  }

  // edit modal handler
  const handleEdit = (id, email) => {
    if (user.email !== email) {
      toast.error('Unauthorized!')
    } else {
      const editData = dataCollection.filter(item => item.id === id)
      const editObject = editData[0]
      setInputValue({
        name: editObject.name,
        category: editObject.category,
        dateOfExpense: editObject.dateOfExpense,
        amount: editObject.amount,
        description: editObject.description,
        id,
      })
      setEditModal(true)
    }
  }

  //edit data
  const editData = async (e) => {
    e.preventDefault()
    const { name, category, dateOfExpense, amount, description, id } = inputvalue

    const updatedData = {
      name,
      category,
      dateOfExpense,
      amount: Number(amount),
      description,
      updatedAt: Date.now()
    }

    try {
      const editData = doc(db, 'ExpenseStore', id)
      await updateDoc(editData, updatedData)
      toast.success('Data updated successfully')
      setEditModal(false)
      fetchData()
    } catch (error) {
      toast.error(String(error.code).split("/")[1].replaceAll("-", " "))
    }
  }


  const datePicker = (e) => {
    const { value } = e.target
    const dataPickedByDate = dataCollection.filter(item => item.dateOfExpense === value)
    setDataCollection(dataPickedByDate)
  }

  const calToatlAmount = () => {
    const myData = dataCollection.filter(item => item.createdBy === user.email)
    const amountArray = myData.map(item => {
      return item.amount
    })
    const sum = amountArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    setTotalAmount(sum)
    console.log(totalAmount)
  }

  useEffect(() => {
    fetchData()
    // calToatlAmount()

  }, [])
  return (
    <>
      <div className=' d-flex flex-column gap-5 justify-content-center align-items-center mt-5 ' style={{ minHeight: ' 80vh ' }}>
        {/* <Card size={10}>
          <div className='h-75'>
            <h6>Hey <span className='text-primary h5'>{user.email}</span>,</h6>
            <h6>your total spending so far: ₹ <span className='text-success'>{totalAmount}</span></h6>
          </div>
        </Card> */}
        <Card size={10}>
          <div className='d-flex justify-content-between '>
            <div className='d-flex col-md-8 gap-3'>
              <Form.Group className="mb-3 col-md-3 " >
                <Form.Control
                  value={filters.searchTerm}
                  type="text"
                  name='searchTerm'
                  placeholder="search by Name"
                  onChange={e => setFilters({ searchTerm: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3 col-md-3" controlId="dateOfExpense">
                <Form.Control
                  value={undefined}
                  type="date"
                  name='dateFilter'
                  onChange={datePicker}
                  required
                />
              </Form.Group>
              <div className='align-items-center'>
                <button onClick={() => fetchData()} className='btn btn-secondary '><i className="fa-solid fa-rotate-right"></i></button>
              </div>
            </div>
            <div>
              <button onClick={handleModal} className='btn btn-primary shadow rounded'>add +</button>
            </div>
          </div>
          {isLoading ? (<div className='d-flex justify-content-center align-items-center' style={{ height: '300px', }}>
            <Spinner animation="border" />
          </div>) : (<Table striped hover>
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Name</th>
                <th>Category</th>
                <th>Date of Expense</th>
                <th>Amount</th>
                <th>Updated At</th>
                <th>Created By</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {
                dataCollection.length === 0 ? (
                  <tr>
                    <td colSpan="9">No data available</td>
                  </tr>
                ) :
                  dataCollection && dataCollection.filter(item => {
                    return filters.searchTerm.toLowerCase() === '' ?
                      item :
                      item.name.toLowerCase().startsWith(filters.searchTerm)
                  }).map((list, index) => (
                    <tr key={list.id}>
                      <td >{index + 1}</td>
                      <td >{list.name}</td>
                      <td >{list.category}</td>
                      <td >{list.dateOfExpense}</td>
                      <td >₹ <span className='text-success'>{list.amount.toLocaleString('en-IN')}</span></td>
                      <td >{timeAgo(list.updatedAt)}</td>
                      <td >{list.createdBy}</td>
                      <td ><button onClick={() => handleEdit(list.id, list.createdBy)} className='btn btn-outline-primary shadow'><i className="fa-solid fa-pen"></i></button></td>
                      <td ><button onClick={() => handleDelete(list.id, list.createdBy)} className='btn btn-outline-danger shadow'><i className="fa-solid fa-trash"></i></button></td>
                    </tr>
                  ))}
            </tbody>
          </Table>)}
        </Card>
      </div >

      {/* Create expense modal */}
      <CreateExpense state={createModal} handleModal={handleModal} fetchData={fetchData} />

      {/* Edit modal */}
      <Modal
        show={editModal}
        onHide={handleEditModal}
        backdrop="static"
        keyboard={false}
        size='lg'
      // fullscreen={true}
      >
        <Form onSubmit={e => editData(e)}>
          <Modal.Header closeButton>
            <Modal.Title className='text-primary'>Edit Exprense</Modal.Title>
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
                onChange={amountFieldHandler}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleEditModal}>
              Cancel
            </Button>
            <Button type='submit' variant="primary">Update</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete modal */}
      <Modal
        show={delModal}
        onHide={handleDelete}
        backdrop="static"
        keyboard={false}
        size='lg'
      >
        <Form onSubmit={e => deleteRow(e)}>
          <Modal.Header closeButton>
            <Modal.Title><span className='text-primary'>Delete Expense</span></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to <span className='text-danger'>Delete?</span></p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleDelete}>
              No
            </Button>
            <Button type='submit' variant="primary">Yes</Button>
          </Modal.Footer>
        </Form>

      </Modal>
    </>
  )
}

export default ViewExpenses