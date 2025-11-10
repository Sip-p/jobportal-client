import React from 'react'
import logo from '../assets/logo.svg'
import {assets} from '../assets/assets'
import { useClerk,UserButton,useUser } from '@clerk/clerk-react' 
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useContext } from 'react'
const Navbar = () => {
  const {openSignIn} = useClerk();
  const {user} = useUser();
  const {setShowRecruiterLogin,companyData,companyToken}=useContext(AppContext)
  return (
    <div className='  py-2 shadow-md '> 
        <div className="container flex flex-col sm:flex-row justify-between px-4 2xl:px-20 mx-auto items-center gap-4 sm:gap-0">
  <Link to='/'> 
  <img src={assets.logo} alt="image" className="w-32 sm:w-40"  />
</Link>
  {user ? (
    <div className="flex gap-4 items-center max-sm:text-xs py-2">
      <Link to="/applications">Applied Job</Link>
      <p>|</p>
      <p className="max-sm:hidden">Welcome, {user.firstName + " " + user.lastName}</p>
      <UserButton />
    </div>
  ) : (
    <div className="flex gap-4 items-center max-sm:text-xs">
      <button onClick={()=>setShowRecruiterLogin(true)} className="text-gray-600">Recruiter Login</button>
      <button
        className="bg-blue-600 px-6 sm:px-9 py-2 rounded-full text-white"
        onClick={(e) => openSignIn()}
      >
        Login
      </button>
    </div>
  )}
</div>

    </div>
  )
}

export default Navbar;