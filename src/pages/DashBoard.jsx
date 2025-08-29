import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext' 
const DashBoard = () => {
  const navigate = useNavigate();
  const {companyData,companyToken,setCompanyToken}=useContext(AppContext)
 const handelLogOut = () => {
  setCompanyToken(null)
  localStorage.removeItem("companyToken")
   // ✅ remove from localStorage
  navigate( "/")
}

  return (
    <div>
      <div className='flex justify-between my-3 shadow-md px-4'>
        <div>
          <img src={assets.logo} onClick={e => navigate('/')} className='cursor-pointer' />
        </div>
        {companyData && <div className='flex justify-between gap-4 '>
          <span>Welcome, {companyData.name}</span>
          <div className='relative group'>
            <img src={companyData.image} className='w-8 h-8 border rounded-full cursor-pointer dp' />
            <div className='absolute hidden group-hover:block  top-10 right-0 '>
              <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm'>
                <li className='  py-1 px-2 cursor-pointer pr-10 ' onClick={handelLogOut}>Logout</li>
              </ul>
            </div>
          </div>
        </div>}
         
      </div>

      <div className=' flex flex-start  '>
        {/* Left side Bar */}
        <div className='border-2 h-screen mr-3 p-3'>
          <ul className=''>

            <NavLink to={'/dashboard/managejobs'} className={({ isActive }) => `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`}>
              <img src={assets.home_icon} />
              <p className='max-sm:hidden'>Manage job</p>
            </NavLink>

            <NavLink to={'/dashboard/add-job'} className={({ isActive }) => `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`}>
              <img src={assets.add_icon} />
              <p className='max-sm:hidden'>Add job</p>
            </NavLink>
            <NavLink to={'/dashboard/view-applications'} className={({ isActive }) => `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`}>
              <img src={assets.person_tick_icon} />
              <p className='max-sm:hidden'>View Applications</p>
            </NavLink>
          </ul>

        </div>
        {/* Outlet */}
        <div className='bg-purple-400'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashBoard