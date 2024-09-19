import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from "./Home"

// User
import Signup from "./user/Signup"
import Login from "./user/Login"
import User_page from "./user/User_page";

// Admin
import Admin_login from "./admin/Admin_login"
import Admin_Signup from './admin/Admin_Signup'
import Admin_Page from "./admin/Admin_Page"

import ProtectedRoute from './ProtectedRoute'


function App() {

  return (
    <BrowserRouter>
      <Toaster toastOptions={{
        className: 'font-bold border-[2px] wittgenstein-login',
        success: {
          duration: 2500,
          iconTheme: {
            primary: 'green',
            secondary: 'black',
          },
          style: {
            color: '#047857',
            borderColor: '#059669',
          },
        },
        error: {
          duration: 2500,
          iconTheme: {
            primary: '#ff4b4b',
            secondary: '#FFFAEE'
          },
          style: {
            color: '#f52f2f',
            borderColor: '#EF4444',
          },
        }
      }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/user/login" element={<Login />} />
        <Route path='/user/profile' element={
          <ProtectedRoute allowedRole='user'>
            <User_page />
          </ProtectedRoute>
        }
        />
        {/* <Route path='/user/profile' element={<User_page />} /> */}

        <Route path='/admin/signup' element={<Admin_Signup />} />
        <Route path="/admin/login" element={<Admin_login />} />
        <Route path='/admin/profile' element={
          <ProtectedRoute allowedRole='admin'>
            <Admin_Page />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App
