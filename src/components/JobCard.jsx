import React, { useEffect, useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { useParams } from 'react-router-dom'
import Jobdetails from './Jobdetails'
import kconvert from 'k-convert'
import moment from 'moment'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
const JobCard = () => {
  const navigate=useNavigate()
  const { getToken } = useAuth()
  const [selectJob, setSelectJob] = useState(null)
  const { backendUrl ,userData,setUserData,appliedJobs,setAppliedJobs,userApplications, setUserApplications} = useContext(AppContext)
  const { id } = useParams()
// console.log("userData is ",userData)



 const findselectedjob = async () => {
   
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`)
     console.log("Job card data is",data )
     
      setSelectJob(data)
      console.log("Selected job is",selectJob)
      toast.success('fetched selected data')
    } catch (error) {
      toast.error(error.message)
    }
  }


const applyHandler=async()=>{
  try {
    if(!userData){
      return toast.error('Login to apply for job')
    }
    if(!userData.resume){
       navigate('/applications')
      return toast.error("Upload resume to apply")
    }
    const token=await getToken()
    console.log(selectJob)
    console.log(selectJob.JobbyId._id)
    const {data}=await axios.post(backendUrl+'/api/users/apply',{jobId:selectJob.JobbyId._id},{
      headers:{Authorization:`Bearer ${token}`},
    })
    if(data.success){
    const updatedJobs = [...appliedJobs, selectJob.JobbyId._id];
setAppliedJobs(updatedJobs);
localStorage.setItem('appliedJobs', JSON.stringify(updatedJobs));
setUserApplications(prev => [...prev, selectJob]);
console.log("user applications are",userApplications)
    toast.success(data.message)
      return
    }
    else{
      return toast.error(data.message)
    }
    console.log("applied data is",data)
  } catch (error) {
    toast.error(error.message)
  }
}


  

  useEffect(() => {
    if (id) findselectedjob()
  }, [id])

  // ⛑ Prevent crash
  if (!selectJob) {
    return <p className="text-center my-10">Loading...</p>
  }

  return (
    <>
      <div className='flex justify-between p-4 rounded-lg shadow-lg m-10 max-sm:flex-col border-2 border-blue-500 bg-blue-200'>
        <div className='bg-blue-300 flex gap-5 p-5 max-sm:px-3 rounded-lg'>
          <img src={selectJob?.JobbyId?.companyId?.image} className='    h-12 w-12  rounded-2xl bg-purple-800 p-1' alt="company logo"/>
          <div>
            <h2>{selectJob?.title}</h2>
            <div className='flex justify-center gap-5 max-sm:flex-col max-sm:gap-2'>
              <span className='flex gap-2 mt-3'>
                <img src={assets.suitcase_icon} className='h-5 w-5'/>
                <h2>{selectJob?.JobbyId?.companyId?.name}</h2>
              </span>
              <span className='flex gap-2 mt-3'>
                <img src={assets.location_icon}/>
                <h2>{selectJob?.JobbyId?.location}</h2>
              </span>
              <span className='flex gap-2 mt-3'>
                <img src={assets.person_icon}/>
                <h2>{selectJob?.JobbyId?.level}</h2>
              </span>
              <span className='flex gap-2 mt-3'>
                <img src={assets.money_icon}/>
                <h2>${kconvert.convertTo(selectJob?.JobbyId?.salary)}</h2>
              </span>
            </div>
          </div>
        </div>
        <div>
          
          <button className='bg-blue-800 rounded-lg p-4 text-white' onClick={applyHandler}>{appliedJobs.includes(selectJob.JobbyId._id) ? "Applied" : "Apply Now"}</button>
          <p>Posted {moment(selectJob?.date).fromNow()}</p>
        </div>
      </div>
      <Jobdetails id={id}/>
    </>
  )
}

export default JobCard
