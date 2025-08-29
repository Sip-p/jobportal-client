import React, { useEffect, useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Jobdetails = ({ id }) => {
  const { backendUrl,userData,setUserData,appliedJobs,setAppliedJobs } = useContext(AppContext)
  const [jobsData, setJobsData] = useState([])   // ✅ state to store jobs
  const [job, setJob] = useState(null)           // ✅ state to store selected job
  const navigate=useNavigate()
  const getAllJobs=async()=>{
  try {
     const {data}=await axios.get(backendUrl+'/api/jobs')
  // console.log(data)

  setJobsData(data.jobs)
  // console.log("all jobs are",jobsData)
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
  } catch (error) {
    toast.error(error.message)
  }
}

  const getjobsData = async () => {
    try {
 const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`)
 
      // console.log("Your detail data is",data)
    if(data.success){
        setJob(data.JobbyId)
    //   const selectedJob = data.find((j) => j._id === id)

    }                        
    //    setJob(selectedJob)                       
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
   
    getAllJobs()
  }, [id]) // re-fetch when id changes
useEffect(()=>{
  getjobsData()
},[jobsData])
  if (!job) {
    return <p className="text-center p-10">Loading job details...</p>
  }

  const similarjobs = jobsData.filter(
    (item) => item.companyId._id === job.companyId._id && item._id !== id
  )

  // const handleApply = async (e) => {
  //   e.preventDefault()
  //   console.log("Apply clicked for", job.title)
  //   // your apply logic here
  // }

  return (
    <div className="grid grid-cols-[2fr_1fr] p-4 rounded-lg shadow-lg m-10 max-sm:flex-col">
      <div className="p-4 rounded-lg">
        <h2>Job Description</h2>
        <p
          dangerouslySetInnerHTML={{ __html: job.description }}
          className="text-sm text-gray-600 max-sm:hidden"
        ></p>

        {/* <button className="bg-blue-800 p-3 m-4 rounded-lg mt-7" onClick={applyHandler}>
          {console.log("applied jobs are",job)}
          Apply**
         </button> */}
      </div>

      <div className="p-4 m-4 rounded-lg flex flex-col items-center">
        {similarjobs.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            className="border border-gray-500 shadow-2xl p-4 rounded-lg w-full hover:shadow-xl transition-all duration-300 ease-in-out mx-sm:h-1/2 mr-4 mb-4"
          >
            
            <img src={item.companyId.image} />
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.companyId.name}</p>
            <p className="text-sm text-gray-600">{item.location}</p>
            <Link to={`/apply-job/${item._id}`}>
              <button
                className="bg-blue-500 rounded-2xl p-2 m-2 text-white"
               onClick={applyHandler}
              >
                {appliedJobs.includes(item._id) ? "Applied" : "Apply Now"}
              </button>
              
   <button className="bg-gray-300 rounded-2xl p-2 m-2">
    Learn More
  </button>
</Link>

          </div>
        ))}
      </div>

      <Footer />
    </div>
  )
}

export default Jobdetails
