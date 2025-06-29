
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Error from './components/Error'
import AllTodos from './pages/AllTodos'
import Login from './pages/Login'
import { Toaster } from 'react-hot-toast'
import CreateTodo from './pages/CreateTodo'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Toaster/>
    <Navbar />
    <Routes>  
      <Route path="/" element={<App />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path='all-todos' element={<AllTodos/>} />
      <Route path='create' element={<CreateTodo/>}/>
   
      <Route path="*" element={<Error />} />
    </Routes>
  </BrowserRouter>
)
