// import React, { useEffect, useState, useContext } from 'react'
// import { assets } from '../assets/assets'
// import { Link, useNavigate } from 'react-router-dom'
// import Footer from './Footer'
// import axios from 'axios'
// import { AppContext } from '../context/AppContext'
// import { toast } from 'react-toastify'

// const Jobdetails = ({ id }) => {
//   const { backendUrl,userData,setUserData,appliedJobs,setAppliedJobs } = useContext(AppContext)
//   const [jobsData, setJobsData] = useState([])   // ✅ state to store jobs
//   const [job, setJob] = useState(null)           // ✅ state to store selected job
//   const navigate=useNavigate()
//   const getAllJobs=async()=>{
//   try {
//      const {data}=await axios.get(backendUrl+'/api/jobs')
//   // console.log(data)

//   setJobsData(data.jobs)
//   // console.log("all jobs are",jobsData)
//   } catch (error) {
//     toast.error(error.message)
//   }
// }

// const applyHandler=async()=>{
//   try {
//     if(!userData){
//       return toast.error('Login to apply for job')
//     }
//     if(!userData.resume){
//       navigate('/applications')
//       return toast.error("Upload resume to apply")
//     }
//   } catch (error) {
//     toast.error(error.message)
//   }
// }

//   const getjobsData = async () => {
//     try {
//  const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`)
 
//       // console.log("Your detail data is",data)
//     if(data.success){
//         setJob(data.JobbyId)
//     //   const selectedJob = data.find((j) => j._id === id)

//     }                        
//     //    setJob(selectedJob)                       
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   useEffect(() => {
   
//     getAllJobs()
//   }, [id]) // re-fetch when id changes
// useEffect(()=>{
//   getjobsData()
// },[jobsData])
//   if (!job) {
//     return <p className="text-center p-10">Loading job details...</p>
//   }

//   const similarjobs = jobsData.filter(
//     (item) => item.companyId._id === job.companyId._id && item._id !== id
//   )

//   // const handleApply = async (e) => {
//   //   e.preventDefault()
//   //   console.log("Apply clicked for", job.title)
//   //   // your apply logic here
//   // }

//   return (
//     <div className="grid grid-cols-[2fr_1fr] p-4 rounded-lg shadow-lg m-10 max-sm:flex-col">
//       <div className="p-4 rounded-lg">
//         <h2>Job Description</h2>
//         <p
//           dangerouslySetInnerHTML={{ __html: job.description }}
//           className="text-sm text-gray-600 max-sm:hidden"
//         ></p>

//         {/* <button className="bg-blue-800 p-3 m-4 rounded-lg mt-7" onClick={applyHandler}>
//           {console.log("applied jobs are",job)}
//           Apply**
//          </button> */}
//       </div>

//       <div className="p-4 m-4 rounded-lg flex flex-col items-center">
//         {similarjobs.slice(0, 3).map((item, idx) => (
//           <div
//             key={idx}
//             className="border border-gray-500 shadow-2xl p-4 rounded-lg w-full hover:shadow-xl transition-all duration-300 ease-in-out mx-sm:h-1/2 mr-4 mb-4"
//           >
            
//             <img src={item.companyId.image} />
//             <h3 className="text-lg font-semibold">{item.title}</h3>
//             <p className="text-sm text-gray-600">{item.companyId.name}</p>
//             <p className="text-sm text-gray-600">{item.location}</p>
//             <Link to={`/apply-job/${item._id}`}>
//               <button
//                 className="bg-blue-500 rounded-2xl p-2 m-2 text-white"
//                onClick={applyHandler}
//               >
//                 {appliedJobs.includes(item._id) ? "Applied" : "Apply Now"}
//               </button>
              
//    <button className="bg-gray-300 rounded-2xl p-2 m-2">
//     Learn More
//   </button>
// </Link>

//           </div>
//         ))}
//       </div>

//       <Footer />
//     </div>
//   )
// }

// export default Jobdetails
import React, { useEffect, useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from './Footer';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useAuth } from '@clerk/clerk-react';

const JobDetails = () => {
  const { id } = useParams(); // ✅ Get job ID from URL
  const { backendUrl, userData, appliedJobs, setAppliedJobs } = useContext(AppContext);
  const { getToken } = useAuth();
  
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  
  const navigate = useNavigate();

  // ✅ Fetch single job details
  const getJobDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      
      if (data.success) {
        setJob(data.JobbyId);
        // Fetch similar jobs after getting job details
        fetchSimilarJobs(data.JobbyId.companyId._id);
      } else {
        toast.error("Job not found");
        navigate('/');
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("Failed to load job details");
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch similar jobs from same company
  const fetchSimilarJobs = async (companyId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      
      if (data.success) {
        const filtered = data.jobs.filter(
          (item) => item.companyId._id === companyId && item._id !== id
        );
        setSimilarJobs(filtered.slice(0, 3)); // ✅ Show max 3 similar jobs
      }
    } catch (error) {
      console.error("Error fetching similar jobs:", error);
    }
  };

  // ✅ Apply to job handler
  const applyToJob = async (jobId) => {
    // Validation checks
    if (!userData) {
      toast.error('Please login to apply for jobs');
      return;
    }
    
    if (!userData.resume) {
      toast.error("Please upload your resume first");
      navigate('/applications');
      return;
    }

    // Check if already applied
    if (appliedJobs.includes(jobId)) {
      toast.info("You have already applied to this job");
      return;
    }

    try {
      setApplying(true);
      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setAppliedJobs(prev => [...prev, jobId]);
        toast.success("Application submitted successfully!");
      } else {
        toast.error(data.message || "Failed to apply");
      }
    } catch (error) {
      console.error("Error applying to job:", error);
      
      if (error.response?.status === 409) {
        toast.error("You have already applied to this job");
      } else if (error.response?.status === 401) {
        toast.error("Please login to apply");
      } else {
        toast.error("Failed to submit application");
      }
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    if (id) {
      getJobDetails();
    }
  }, [id]);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  // ✅ Job not found state
  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Job not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-8">
        {/* Left Column - Job Details */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Company Header */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <img
              src={job.companyId.image}
              alt={job.companyId.name}
              className="h-16 w-16 object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
              <p className="text-lg text-gray-600">{job.companyId.name}</p>
            </div>
          </div>

          {/* Job Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 pb-6 border-b">
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold text-gray-800">{job.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Job Type</p>
              <p className="font-semibold text-gray-800">{job.level || 'Full-time'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Salary</p>
              <p className="font-semibold text-gray-800">
                {job.salary ? `₹${job.salary}` : 'Not disclosed'}
              </p>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Job Description</h2>
            <div
              dangerouslySetInnerHTML={{ __html: job.description }}
              className="text-gray-700 leading-relaxed prose max-w-none"
            />
          </div>

          {/* Apply Button */}
          <button
            onClick={() => applyToJob(job._id)}
            disabled={applying || appliedJobs.includes(job._id)}
            className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-white transition-all ${
              appliedJobs.includes(job._id)
                ? 'bg-green-500 cursor-not-allowed'
                : applying
                ? 'bg-blue-400 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            {applying
              ? 'Applying...'
              : appliedJobs.includes(job._id)
              ? '✓ Applied'
              : 'Apply Now'}
          </button>
        </div>

        {/* Right Column - Similar Jobs */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Similar Jobs</h3>
          
          {similarJobs.length > 0 ? (
            similarJobs.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 shadow-md rounded-lg p-4 hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={item.companyId.image}
                  alt={item.companyId.name}
                  className="h-12 w-12 object-contain mb-3"
                />
                <h4 className="text-lg font-semibold text-gray-800 mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 mb-1">{item.companyId.name}</p>
                <p className="text-sm text-gray-500 mb-4">{item.location}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => applyToJob(item._id)}
                    disabled={appliedJobs.includes(item._id)}
                    className={`flex-1 px-4 py-2 rounded-full text-white font-medium transition ${
                      appliedJobs.includes(item._id)
                        ? 'bg-green-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {appliedJobs.includes(item._id) ? 'Applied ✓' : 'Apply'}
                  </button>
                  
                  <Link to={`/apply-job/${item._id}`}>
                    <button className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition">
                      View
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600">No similar jobs found</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetails;