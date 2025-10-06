// import React from 'react'
// import { NavLink, Outlet, useNavigate } from 'react-router-dom'
// import { assets } from '../assets/assets'
// import { useContext } from 'react'
// import { AppContext } from '../context/AppContext' 
// const DashBoard = () => {
//   const navigate = useNavigate();
//   const {companyData,companyToken,setCompanyToken}=useContext(AppContext)
//  const handelLogOut = () => {
//   setCompanyToken(null)
//   localStorage.removeItem("companyToken")
//    // ✅ remove from localStorage
//   navigate( "/")
// }

//   return (
//     <div>
//       <div className='flex justify-between my-3 shadow-md px-4'>
//         <div>
//           <img src={assets.logo} onClick={e => navigate('/')} className='cursor-pointer' />
//         </div>
//         {companyData && <div className='flex justify-between gap-4 '>
//           <span>Welcome, {companyData.name}</span>
//           <div className='relative group'>
//             <img src={companyData.image} className='w-8 h-8 border rounded-full cursor-pointer dp' />
//             <div className='absolute hidden group-hover:block  top-10 right-0 '>
//               <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm'>
//                 <li className='  py-1 px-2 cursor-pointer pr-10 ' onClick={handelLogOut}>Logout</li>
//               </ul>
//             </div>
//           </div>
//         </div>}
         
//       </div>

//       <div className=' flex flex-start  '>
//         {/* Left side Bar */}
//         <div className='border-2 h-screen mr-3 p-3'>
//           <ul className=''>

//             <NavLink to={'/dashboard/managejobs'} className={({ isActive }) => `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`}>
//               <img src={assets.home_icon} />
//               <p className='max-sm:hidden'>Manage job</p>
//             </NavLink>

//             <NavLink to={'/dashboard/add-job'} className={({ isActive }) => `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`}>
//               <img src={assets.add_icon} />
//               <p className='max-sm:hidden'>Add job</p>
//             </NavLink>
//             <NavLink to={'/dashboard/view-applications'} className={({ isActive }) => `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`}>
//               <img src={assets.person_tick_icon} />
//               <p className='max-sm:hidden'>View Applications</p>
//             </NavLink>
//           </ul>

//         </div>
//         {/* Outlet */}
//         <div className='bg-purple-400'>
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DashBoard


import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const { companyData, companyToken, setCompanyToken, setCompanyData } = useContext(AppContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ Redirect to home if not logged in
  useEffect(() => {
    if (!companyToken) {
      navigate('/');
      toast.error("Please login as recruiter");
    }
  }, [companyToken, navigate]);

  // ✅ Handle logout
  const handleLogout = () => {
    setCompanyToken(null);
    setCompanyData(null);
    localStorage.removeItem('companyToken');
    toast.success("Logged out successfully");
    navigate('/');
  };

  // ✅ Toggle mobile sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-md sticky top-0 z-50'>
        <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
          {/* Logo */}
          <img
            src={assets.logo}
            alt='Logo'
            onClick={() => navigate('/')}
            className='h-10 cursor-pointer'
          />

          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className='lg:hidden p-2 rounded-lg hover:bg-gray-100'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          </button>

          {/* User Info */}
          {companyData && (
            <div className='hidden lg:flex items-center gap-4'>
              <div className='text-right'>
                <p className='text-sm font-semibold text-gray-800'>{companyData.name}</p>
                <p className='text-xs text-gray-500'>{companyData.email}</p>
              </div>
              
              {/* Profile Dropdown */}
              <div className='relative group'>
                <img
                  src={companyData.image || 'https://via.placeholder.com/40'}
                  alt='Profile'
                  className='w-10 h-10 rounded-full cursor-pointer border-2 border-gray-200 hover:border-blue-500 transition object-cover'
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/40';
                  }}
                />
                
                {/* Dropdown Menu */}
                <div className='absolute right-0 top-12 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200'>
                  <div className='bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px]'>
                    <div className='px-4 py-2 border-b'>
                      <p className='font-semibold text-sm'>{companyData.name}</p>
                      <p className='text-xs text-gray-500'>{companyData.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className='w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 font-medium flex items-center gap-2'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className='flex'>
        {/* Sidebar - Desktop */}
        <aside className='hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen sticky top-16'>
          <nav className='p-4'>
            <ul className='space-y-2'>
              <li>
                <NavLink
                  to='/dashboard/managejobs'
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <img src={assets.home_icon} alt='' className='w-5 h-5' />
                  <span className='font-medium'>Manage Jobs</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to='/dashboard/add-job'
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <img src={assets.add_icon} alt='' className='w-5 h-5' />
                  <span className='font-medium'>Add Job</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to='/dashboard/view-applications'
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <img src={assets.person_tick_icon} alt='' className='w-5 h-5' />
                  <span className='font-medium'>View Applications</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className='lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40'
            onClick={toggleSidebar}
          >
            <aside
              className='fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Header */}
              <div className='p-4 border-b flex justify-between items-center'>
                <h2 className='font-semibold text-lg'>Menu</h2>
                <button onClick={toggleSidebar} className='p-2 hover:bg-gray-100 rounded-lg'>
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>

              {/* Mobile User Info */}
              {companyData && (
                <div className='p-4 border-b flex items-center gap-3'>
                  <img
                    src={companyData.image || 'https://via.placeholder.com/40'}
                    alt='Profile'
                    className='w-12 h-12 rounded-full border-2 border-gray-200 object-cover'
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/40';
                    }}
                  />
                  <div>
                    <p className='font-semibold text-sm'>{companyData.name}</p>
                    <p className='text-xs text-gray-500'>{companyData.email}</p>
                  </div>
                </div>
              )}

              {/* Mobile Navigation */}
              <nav className='p-4'>
                <ul className='space-y-2'>
                  <li>
                    <NavLink
                      to='/dashboard/managejobs'
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                    >
                      <img src={assets.home_icon} alt='' className='w-5 h-5' />
                      <span className='font-medium'>Manage Jobs</span>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to='/dashboard/add-job'
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                    >
                      <img src={assets.add_icon} alt='' className='w-5 h-5' />
                      <span className='font-medium'>Add Job</span>
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to='/dashboard/view-applications'
                      onClick={toggleSidebar}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                    >
                      <img src={assets.person_tick_icon} alt='' className='w-5 h-5' />
                      <span className='font-medium'>View Applications</span>
                    </NavLink>
                  </li>
                </ul>

                {/* Mobile Logout */}
                <button
                  onClick={() => {
                    handleLogout();
                    toggleSidebar();
                  }}
                  className='w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                  </svg>
                  Logout
                </button>
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className='flex-1 p-4 lg:p-8 bg-gray-50'>
          <div className='max-w-7xl mx-auto'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;