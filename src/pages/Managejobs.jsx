import React, { useEffect, useState } from 'react'
import { assets, manageJobsData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

import axios from 'axios'
const Managejobs = () => {
  const [alljobs,setAlljobs]=useState([])
  const {backendUrl,companyToken, }=useContext(AppContext)
  const [applicants,setApplicants]=useState(0)
  const getDetails=async(e)=>
{
 try {
  const {data}=await axios.get(backendUrl+'/api/company/list-jobs',{headers:{token:companyToken}})
console.log(data)
if (data.success) {
  setAlljobs(data.jobsData || []); // ✅ correct key
} else {
  toast.error('Missing credentials');
}

} catch (error) {
  toast.error(error.message)
  console.log(error.message)
}
}
const changeJobVisibility=async(id)=>{
  try {
    const {data}=await axios.post(backendUrl+'/api/company/change-visibility',{id},{headers:{token:companyToken}})
     
 if(data.success){
  toast.success(data.message)
  setAlljobs(prevJobs => prevJobs.map(job => job._id === id ? { ...job, visible: !job.visible } : job));
 }
  } catch (error) {
    
  }
}

// const noOfApplicants=async()=>{
//   try {
//     console.log("current job is",alljobs[0])
//     const id=alljobs[0]?._id
//     const {data}=await axios.post(backendUrl+'/api/company/no-of-applicants',{id}, {headers:{token:companyToken}})
//     if(data.success){
//       console.log(data)
//       setApplicants(data.noOfApplicants)
//     }
//   } catch (error) {
//     toast.error(error.message)
//   }
// }



useEffect(()=>{
   getDetails()
  
},[])
 
  return (
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto overflow-hidden '>
        <table className='min-w-full bg-white border-gray-200 max-sm:text-sm'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>#</th>
              <th className='py-2 px-4 border-b text-left'>Job Title</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Date</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 border-b text-left'>Applicants</th>
              <th className='py-2 px-4 border-b text-left'>Visible</th>
            </tr>
          </thead>
          <tbody className=' '>
            {
              (alljobs || []).map((job, idx) => {
                return <tr key={idx} className='text-gray-700'>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{idx+1}</td>
                  <td className='py-2 px-4 border-b'>{job.title}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{moment(job.date).format('ll')}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{job.location}</td>
                  <td className='py-2 px-4 border-b'> {job.applicants}</td>
                  <td className='py-2 px-4 border-b scale-125 text-center'>
                    <input type='checkbox' checked={job.visible} onChange={()=>changeJobVisibility(job._id)}  />
                  </td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
      <div className='flex justify-end m-2'>
        <NavLink to={'/dashboard/add-job'} >

          <button className='bg-black px-3 py-2 text-white hover:bg-gray-700'>Add new jobs</button></NavLink></div>
    </div>
  )
}

export default Managejobs