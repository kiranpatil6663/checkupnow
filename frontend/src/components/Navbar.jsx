import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();

  const {token,setToken,userData}=useContext(AppContext)

  const [showMenu, setShowMenu] = useState();
 
  const logout = () =>{
    setToken(false)
    localStorage.removeItem('token')
  }
  return (
    <div className=" bg-primary text-white flex items-center justify-between text-sm py-4 mb-5 border-b border-b-blue-400">
      <p
        className="text-xl font-bold px-4 cursor-pointer"
        onClick={() => navigate("/")}
      >
        CheckUpNow
      </p>
      <div>
        <ul className="hidden md:flex item-start gap-5 font-medium">
          <NavLink to="/">
            <li>Home</li>
            <hr className="border-none outline-none bg-white h-0.5 w-4/5 m-auto hidden  " />
          </NavLink>
          <NavLink to="/doctors">
            <li>Doctors</li>
            <hr className="border-none outline-none bg-white h-0.5 w-4/5 m-auto hidden  " />
          </NavLink>
          <NavLink to="/about">
            <li>About</li>
            <hr className="border-none outline-none bg-white h-0.5 w-4/5 m-auto hidden  " />
          </NavLink>
          <NavLink to="/contact">
            <li>Contact</li>
            <hr className="border-none outline-none bg-white h-0.5 w-4/5 m-auto hidden  " />
          </NavLink>
        </ul>
      </div>
      {token && userData ? (
        <div className="flex item-center gap-2 cursor-pointer group relative">
          <img className="w-8 rounded-full" src={userData.image} />
          <img className="w-2.5" src={assets.dropdown_icon} />

          <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
            <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
              <p
                onClick={() => {
                  navigate("/MyProfile");
                }}
                className="hover:text-black cursor-pointer"
              >
                My Profile
              </p>
              <p
                onClick={() => {
                  navigate("/MyAppointment");
                }}
                className="hover:text-black cursor-pointer"
              >
                My Appointments
              </p>
              <p
                onClick={logout}
                className="hover:text-black cursor-pointer"
              >
                Logout
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white font-medium border-2 border-white text-cyan-600 py-2 px-4 mr-4 rounded hover:bg-cyan-600 hover:text-white ">
          <button
            onClick={() => {
              navigate("/login");
            }}
          >
            Sign In
          </button>
        </div>
      )}
     
      {/* mobile menu */}
       <img className="w-6 md:hidden " onClick={()=>setShowMenu(true)}  src={assets.menu_icon} alt="" />
      <div className={`${showMenu ? 'fixed w-full h-screen':'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
        <div className="flex items-center justify-between px-5 py-6">
          <p
        className="text-primary text-xl w-36 font-bold px-4 cursor-pointer"
        onClick={() => navigate("/")}
      >
        CheckUpNow
      </p>
          <img className="w-7" onClick={()=>setShowMenu(false)} src={assets.cross_icon} alt="" />
        </div>
        <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg text-black font-medium">
         <NavLink  onClick={()=>setShowMenu(false)} to="/"><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
         <NavLink  onClick={()=>setShowMenu(false)} to="/doctors"><p className='px-4 py-2 rounded inline-block'>All Doctors</p></NavLink>
         <NavLink  onClick={()=>setShowMenu(false)} to="/about"><p className='px-4 py-2 rounded inline-block'>About</p></NavLink>
         <NavLink  onClick={()=>setShowMenu(false)} to="/contact"><p className='px-4 py-2 rounded inline-block'>Contact</p></NavLink>
        </ul>
      </div>
      

    </div>
  );
};

export default Navbar;
