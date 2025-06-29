import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
   const navigate=useNavigate();
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/*----left section--*/}
            <div>
            <p  onClick={()=>{navigate('/');scrollTo(0,0);} } className="text-primary text-xl font-bold  cursor-pointer mb-5 w-40" >CheckUpNow</p>
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium, quia! Libero cum, ab consectetur fugiat harum dolorem rerum sint repellendus repellat recusandae tempora saepe obcaecati, corrupti modi autem. Ullam, beatae.</p>
            </div>
            {/*----mid section--*/}
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            {/*----right section--*/}
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+1-234-456-789</li>
                    <li>checkupnow@gmail.com</li>
                </ul>

            </div>
        </div>
        
            {/*----CopyRight--*/}
        <div>
        <hr></hr>
        <p className='py-5 text-sm text-center'>copyright 2025@ checkupnow -All Right Reserved.</p>
        </div>
      
    </div>
  )
}

export default Footer
