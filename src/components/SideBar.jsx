import React from 'react'

const SideBar = () => {
  return (
    <div className='border   border-gray-300 shadow-lg p-4 rounded-lg w-full lg:w-1/4'> 
 <input type='text' placeholder='Search by Category' className='w-full p-2 rounded mb-4 outline-none text-black' />
 <div className='flex flex-col gap-2 '>
    <span className='flex gap-2'> 
    <input type='checkbox' id='Programming' className=' ' />
    <label htmlFor='Programming'>Programming</label>
</span>
 <span className='flex gap-2'>
    <input type='checkbox' id='Data Science' className=' ' />
    <label htmlFor='Data Science'>Data Science</label>
</span>
 <span className='flex gap-2'>
    <input type='checkbox' id='Designing' className=' ' />
    <label htmlFor='Designing'>Designing</label>
</span>
 <span className='flex gap-2'>
    <input type='checkbox' id='Networking' className=' ' />
    <label htmlFor='Networking'>Networking</label>
</span>
 <span className='flex gap-2'>
    <input type='checkbox' id='Management' className=' ' />
    <label htmlFor='Management'>Management</label>
</span>
 <span className='flex gap-2'>
    <input type='checkbox' id='Marketing' className=' ' />
    <label htmlFor='Marketing'>Marketing</label>
</span>
 <span className='flex gap-2'>
    <input type='checkbox' id='CyberSecurity' className=' ' />
    <label htmlFor='CyberSecurity'>CyberSecurity</label>
    </span>
 </div>
    </div>
  )
}

export default SideBar