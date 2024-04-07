import 'bootstrap/dist/css/bootstrap.min.css';
import Authentication from './Components/Signup/Authentication';
import { Route, Routes } from 'react-router-dom'
import Home from './Components/Home/Home';
import UserRoute from './routes/UserRoute';
import { Toaster } from 'sonner'
import PrivateRoutes from './routes/PrivateRoutes';



function App() {

  return (
    <>
      <Routes>
        <Route
          path='/'
          element={
            <PrivateRoutes>
              <Home />
            </PrivateRoutes>
          }
        />
        <Route
          path='/auth'
          element={
            <UserRoute>
              <Authentication />
            </UserRoute>
          }
        />
      </Routes>
      <Toaster richColors position='bottom-right' />
    </>
  )
}

export default App
