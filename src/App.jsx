import 'bootstrap/dist/css/bootstrap.min.css';
import Authentication from './Components/Signup/Authentication';
import { Route, Routes } from 'react-router-dom'
import Home from './Components/Home/Home';
import UserRoute from './routes/UserRoute';


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/auth'
          element={
            <UserRoute>
              <Authentication />
            </UserRoute>
          }
        />
      </Routes>

    </>
  )
}

export default App
