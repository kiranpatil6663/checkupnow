import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from "react-router-dom";
import { DoctorContext } from '../context/DoctorContext';

const Navbar = () => {
  const {aToken,setAToken} =useContext(AdminContext)
  const {dToken,setDToken}=useContext(DoctorContext)
  const navigate=useNavigate()
  const logout=()=>{
    navigate('/')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
  }
  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
   <div className="text-left  cursor-pointer leading-none  cursor-pointer">
  <p className="text-2xl w-36 sm:w-40 font-bold text-primary m-0 p-0">CheckUpNow</p>
  <span className=" text-gray-600 block m-0 pl-2">DashboardPanel</span>
</div>
      <p className='border px-2.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Doctor' }</p>
      </div>
      <button onClick={logout} className='bg-primary font-bold text-white text-sm px-10 py-2 rounded-full'>Logout</button>
      
    </div>
  )
}

export default Navbar
