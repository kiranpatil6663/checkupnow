import React from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Navbar from './components/Navbar'
import Doctors from './Pages/Doctors'
import Contact from './Pages/Contact'
import About from './Pages/About'
import Appointment from './Pages/Appointment'
import Footer from './components/Footer'
import Login from './Pages/Login'
import MyProfile from './Pages/MyProfile'
import MyAppointment from './Pages/MyAppointment'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


function App() {
  return (
   
    <div > 
      <ToastContainer/>
    <Navbar/>
   
      <Routes>
        <Route  path="/" element={<Home/>}></Route>
        <Route  path="/doctors" element={<Doctors/>}></Route>
        <Route  path="/doctors/:speciality" element={<Doctors/>}/>
        <Route  path="/contact" element={<Contact/>}></Route>
        <Route  path="/about" element={<About/>}></Route>
        <Route  path="/login" element={<Login/>}></Route>
        <Route  path="/MyProfile" element={<MyProfile/>}></Route>
        <Route  path="/MyAppointment" element={<MyAppointment/>}></Route>
        <Route  path='/appointment/:docId' element={<Appointment/>}></Route>
       

        
      </Routes>
      <Footer/>
      </div>
     
  )
}

export default App
