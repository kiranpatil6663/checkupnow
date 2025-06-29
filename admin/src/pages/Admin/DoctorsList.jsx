import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'



const DoctorsList = () => {

  const {doctors,aToken,getAllDoctors,changeAvailability}=useContext(AdminContext)
  useEffect(()=>{
    if(aToken){
      getAllDoctors()
    }
  },[aToken])
  return (   
    <div className='m-5 max-h-[90vh] overflow-y-scroll' >
      <h1 className='text-neutral-800 text-lg font-medium'>All Doctors</h1>
      <div  className='w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-5'>
        {/* {w-full flex flex-wrap gap-4 pt-5 gap-y-6 */
          doctors.map((item,index)=>(
            // border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group
            <div className=' border border-indigo-200 max-w-56    hover:-translate-y-2 hover:shadow-xl transition-all rounded-xl     overflow-hidden cursor-pointer group' key={index}>
               <img className='bg-indigo-50   ' src={item.image} alt="" />{/* group-hover:bg-primary transition-all duration-500 */}
              <div className='p-4'>
               <p className='text-neutral-700 text-lg font-medium'>
                {item.name}
               </p>
               <p className='text-zinc-600 text-sm'>{item.speciality}</p>
               <div className='mt-2 flex items-center gap-1 text-sm'>
                <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} />
                <p>Available</p>
               </div>
              </div>

            </div>
          )

          )
        }
      </div>
    </div>
  )
}

export default DoctorsList
