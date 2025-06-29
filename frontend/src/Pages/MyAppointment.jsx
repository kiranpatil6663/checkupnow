import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

import axios from "axios";



function MyAppointment() {
  const { backendUrl,token,getDoctorsData } = useContext(AppContext);

  const [appointments,setAppointments]=useState([])
  const months =["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const slotDateFormat =(slotDate)=>{
    const dateArray=slotDate.split('_')
    return dateArray[0]+" "+months[Number(dateArray[1])]+" "+dateArray[2]
  }
const getUserAppointments =async ()=>{
  try {
    const {data}=await axios.get(backendUrl+'/api/user/MyAppointment',{headers:{token}})
    if (data.success) {
      setAppointments(data.appointments.reverse())
      console.log(data.appointments)
      
    }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
    
  }
}
const cancelAppointment =async(appointmentId)=>{
  try {
  const {data} =await axios.post(backendUrl + '/api/user/cancel-appointment',{appointmentId},{headers:{token}})
  if (data.success) {
    toast.success(data.message)
    getUserAppointments()
    getDoctorsData()

    
  } else {
    toast.error(data.message)
    
  }
    
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}
//payment handler

const markPaid = async (appointmentId) => {
  try {
    const { data } = await axios.post(
      backendUrl + '/api/user/mark-paid',
      { appointmentId },
      { headers: { token } }
    );

    if (data.success) {
      toast.success("payment Done!");
      getUserAppointments();  // fetch latest data
      getDoctorsData();       // optional: if you need doctor status refreshed too
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};


useEffect(()=>{
  if(token){
    getUserAppointments()
  }
},[token])

  return (
  <div>
    <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My appointments</p>
    {appointments.map((item, index) => (
      <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={index}>
        <div>
          <img className="w-32 bg-indigo-50" src={item.docData.image} alt="" />
        </div>
        <div className="flex-1 text-sm text-zinc-600">
          <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
          <p>{item.docData.speciality}</p>
          <p className="text-zinc-700 font-medium mt-1">Address:</p>
          <p className="text-xs">{item.docData.address.line1}</p>
          <p className="text-xs">{item.docData.address.line2}</p>
          <p className="text-xs mt-1">
            <span className="text-sm text-neutral-700 font-medium">Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}
          </p>
        </div>
        <div className="flex flex-col gap-2 justify-end">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Payment section */}
           {/* PAY ONLINE / PAID status */}
{!item.payment && !item.cancelled ? (
  <button
    onClick={() => markPaid(item._id)}
    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300"
  >
    Pay Online
  </button>
) : item.payment ? (
  <span className="text-green-600 font-semibold sm:min-w-48 py-2 border border-green-600 text-center">
    Payment Done
  </span>
) : null}

{/* CANCEL APPOINTMENT / CANCELLED status */}
{!item.cancelled && !item.payment ? (
  <button
    onClick={() => cancelAppointment(item._id)}
    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300"
  >
    Cancel Appointment
  </button>
) : item.cancelled ? (
  <button
    className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500 text-center"
    disabled
  >
    Appointment Cancelled
  </button>
) : null}
          </div>
        </div>
      </div>
    ))}
  </div>
)
}
export default MyAppointment;
