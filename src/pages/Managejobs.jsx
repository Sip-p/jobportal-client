// import React, { useEffect, useState } from 'react'
// import { assets, manageJobsData } from '../assets/assets'
// import moment from 'moment'
// import { useNavigate } from 'react-router-dom'
// import { NavLink } from 'react-router-dom'
// import { useContext } from 'react'
// import { AppContext } from '../context/AppContext'
// import { toast } from 'react-toastify'

// import axios from 'axios'
// const Managejobs = () => {
//   const [alljobs,setAlljobs]=useState([])
//   const {backendUrl,companyToken, }=useContext(AppContext)
//   const [applicants,setApplicants]=useState(0)
//   const getDetails=async(e)=>
// {
//  try {
//   const {data}=await axios.get(backendUrl+'/api/company/list-jobs',{headers:{token:companyToken}})
// console.log(data)
// if (data.success) {
//   setAlljobs(data.jobsData || []); // ✅ correct key
// } else {
//   toast.error('Missing credentials');
// }

// } catch (error) {
//   toast.error(error.message)
//   console.log(error.message)
// }
// }
// const changeJobVisibility=async(id)=>{
//   try {
//     const {data}=await axios.post(backendUrl+'/api/company/change-visibility',{id},{headers:{token:companyToken}})
     
//  if(data.success){
//   toast.success(data.message)
//   setAlljobs(prevJobs => prevJobs.map(job => job._id === id ? { ...job, visible: !job.visible } : job));
//  }
//   } catch (error) {
    
//   }
// }

// // const noOfApplicants=async()=>{
// //   try {
// //     console.log("current job is",alljobs[0])
// //     const id=alljobs[0]?._id
// //     const {data}=await axios.post(backendUrl+'/api/company/no-of-applicants',{id}, {headers:{token:companyToken}})
// //     if(data.success){
// //       console.log(data)
// //       setApplicants(data.noOfApplicants)
// //     }
// //   } catch (error) {
// //     toast.error(error.message)
// //   }
// // }



// useEffect(()=>{
//    getDetails()
  
// },[])
 
//   return (
//     <div className='container p-4 max-w-5xl'>
//       <div className='overflow-x-auto overflow-hidden '>
//         <table className='min-w-full bg-white border-gray-200 max-sm:text-sm'>
//           <thead>
//             <tr>
//               <th className='py-2 px-4 border-b text-left max-sm:hidden'>#</th>
//               <th className='py-2 px-4 border-b text-left'>Job Title</th>
//               <th className='py-2 px-4 border-b text-left max-sm:hidden'>Date</th>
//               <th className='py-2 px-4 border-b text-left max-sm:hidden'>Location</th>
//               <th className='py-2 px-4 border-b text-left'>Applicants</th>
//               <th className='py-2 px-4 border-b text-left'>Visible</th>
//             </tr>
//           </thead>
//           <tbody className=' '>
//             {
//               (alljobs || []).map((job, idx) => {
//                 return <tr key={idx} className='text-gray-700'>
//                   <td className='py-2 px-4 border-b max-sm:hidden'>{idx+1}</td>
//                   <td className='py-2 px-4 border-b'>{job.title}</td>
//                   <td className='py-2 px-4 border-b max-sm:hidden'>{moment(job.date).format('ll')}</td>
//                   <td className='py-2 px-4 border-b max-sm:hidden'>{job.location}</td>
//                   <td className='py-2 px-4 border-b'> {job.applicants}</td>
//                   <td className='py-2 px-4 border-b scale-125 text-center'>
//                     <input type='checkbox' checked={job.visible} onChange={()=>changeJobVisibility(job._id)}  />
//                   </td>
//                 </tr>
//               })
//             }
//           </tbody>
//         </table>
//       </div>
//       <div className='flex justify-end m-2'>
//         <NavLink to={'/dashboard/add-job'} >

//           <button className='bg-black px-3 py-2 text-white hover:bg-gray-700'>Add new jobs</button></NavLink></div>
//     </div>
//   )
// }

// export default Managejobs


import React, { useEffect, useState, useContext } from 'react';
import { assets } from '../assets/assets';
import moment from 'moment';
import { useNavigate, NavLink } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ManageJobs = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisible, setFilterVisible] = useState('all'); // all, visible, hidden

  // ✅ Fetch company jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
        headers: { token: companyToken }
      });

      if (data.success) {
        setAllJobs(data.jobsData || []);
      } else {
        toast.error(data.message || 'Failed to fetch jobs');
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error(error.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle job visibility
  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { id },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message || 'Visibility updated');
        // ✅ Update local state
        setAllJobs(prevJobs =>
          prevJobs.map(job =>
            job._id === id ? { ...job, visible: !job.visible } : job
          )
        );
      } else {
        toast.error(data.message || 'Failed to update visibility');
      }
    } catch (error) {
      console.error("Error changing visibility:", error);
      toast.error(error.response?.data?.message || 'Failed to update visibility');
    }
  };

  // ✅ Delete job
  const deleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      const { data } = await axios.delete(`${backendUrl}/api/company/delete-job/${id}`, {
        headers: { token: companyToken }
      });

      if (data.success) {
        toast.success('Job deleted successfully');
        setAllJobs(prevJobs => prevJobs.filter(job => job._id !== id));
      } else {
        toast.error(data.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchJobs();
    } else {
      navigate('/');
    }
  }, [companyToken]);

  // ✅ Filter jobs based on search and visibility
  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVisibility = filterVisible === 'all' ||
                             (filterVisible === 'visible' && job.visible) ||
                             (filterVisible === 'hidden' && !job.visible);
    
    return matchesSearch && matchesVisibility;
  });

  // ✅ Calculate statistics
  const stats = {
    total: allJobs.length,
    visible: allJobs.filter(job => job.visible).length,
    hidden: allJobs.filter(job => !job.visible).length,
    totalApplicants: allJobs.reduce((sum, job) => sum + (job.applicants || 0), 0)
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 max-w-7xl'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Manage Jobs</h1>
        <p className='text-gray-600'>View and manage all your job postings</p>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
        <div className='bg-white rounded-lg shadow p-4 border-l-4 border-blue-500'>
          <p className='text-sm text-gray-600'>Total Jobs</p>
          <p className='text-2xl font-bold text-gray-800'>{stats.total}</p>
        </div>
        <div className='bg-white rounded-lg shadow p-4 border-l-4 border-green-500'>
          <p className='text-sm text-gray-600'>Active</p>
          <p className='text-2xl font-bold text-gray-800'>{stats.visible}</p>
        </div>
        <div className='bg-white rounded-lg shadow p-4 border-l-4 border-red-500'>
          <p className='text-sm text-gray-600'>Hidden</p>
          <p className='text-2xl font-bold text-gray-800'>{stats.hidden}</p>
        </div>
        <div className='bg-white rounded-lg shadow p-4 border-l-4 border-purple-500'>
          <p className='text-sm text-gray-600'>Total Applicants</p>
          <p className='text-2xl font-bold text-gray-800'>{stats.totalApplicants}</p>
        </div>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-lg shadow p-4 mb-6'>
        <div className='flex flex-col md:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1'>
            <input
              type='text'
              placeholder='Search by job title or location...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Visibility Filter */}
          <select
            value={filterVisible}
            onChange={(e) => setFilterVisible(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='all'>All Jobs</option>
            <option value='visible'>Active Only</option>
            <option value='hidden'>Hidden Only</option>
          </select>

          {/* Add Job Button */}
          <NavLink to='/dashboard/add-job'>
            <button className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap'>
              + Add New Job
            </button>
          </NavLink>
        </div>
      </div>

      {/* Jobs Table/Cards */}
      {filteredJobs.length === 0 ? (
        <div className='bg-white rounded-lg shadow p-12 text-center'>
          <div className='text-6xl mb-4'>📋</div>
          <h3 className='text-xl font-semibold text-gray-700 mb-2'>No Jobs Found</h3>
          <p className='text-gray-500 mb-6'>
            {searchTerm || filterVisible !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by posting your first job'}
          </p>
          {!searchTerm && filterVisible === 'all' && (
            <NavLink to='/dashboard/add-job'>
              <button className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'>
                Post a Job
              </button>
            </NavLink>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className='hidden md:block bg-white rounded-lg shadow overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead className='bg-gray-50 border-b'>
                  <tr>
                    <th className='py-3 px-4 text-left text-sm font-semibold text-gray-700'>#</th>
                    <th className='py-3 px-4 text-left text-sm font-semibold text-gray-700'>Job Title</th>
                    <th className='py-3 px-4 text-left text-sm font-semibold text-gray-700'>Location</th>
                    <th className='py-3 px-4 text-left text-sm font-semibold text-gray-700'>Posted Date</th>
                    <th className='py-3 px-4 text-left text-sm font-semibold text-gray-700'>Applicants</th>
                    <th className='py-3 px-4 text-center text-sm font-semibold text-gray-700'>Status</th>
                    <th className='py-3 px-4 text-center text-sm font-semibold text-gray-700'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job, idx) => (
                    <tr key={job._id} className='border-b hover:bg-gray-50 transition'>
                      <td className='py-3 px-4 text-gray-700'>{idx + 1}</td>
                      <td className='py-3 px-4'>
                        <div>
                          <p className='font-medium text-gray-800'>{job.title}</p>
                          <p className='text-sm text-gray-500'>{job.category || 'N/A'}</p>
                        </div>
                      </td>
                      <td className='py-3 px-4 text-gray-700'>{job.location}</td>
                      <td className='py-3 px-4 text-gray-600'>
                        {moment(job.date).format('MMM DD, YYYY')}
                      </td>
                      <td className='py-3 px-4'>
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
                          {job.applicants || 0}
                        </span>
                      </td>
                      <td className='py-3 px-4 text-center'>
                        <label className='relative inline-flex items-center cursor-pointer'>
                          <input
                            type='checkbox'
                            checked={job.visible}
                            onChange={() => changeJobVisibility(job._id)}
                            className='sr-only peer'
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </td>
                      <td className='py-3 px-4'>
                        <div className='flex items-center justify-center gap-2'>
                          <NavLink to={`/dashboard/view-applications?jobId=${job._id}`}>
                            <button className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition' title='View Applications'>
                              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                              </svg>
                            </button>
                          </NavLink>
                          <button
                            onClick={() => deleteJob(job._id)}
                            className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition'
                            title='Delete Job'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className='md:hidden space-y-4'>
            {filteredJobs.map((job, idx) => (
              <div key={job._id} className='bg-white rounded-lg shadow p-4 border border-gray-200'>
                <div className='flex justify-between items-start mb-3'>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-gray-800 mb-1'>{job.title}</h3>
                    <p className='text-sm text-gray-600'>{job.location}</p>
                    <p className='text-xs text-gray-500 mt-1'>
                      Posted: {moment(job.date).format('MMM DD, YYYY')}
                    </p>
                  </div>
                  <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                    {job.applicants || 0} applicants
                  </span>
                </div>
                
                <div className='flex items-center justify-between pt-3 border-t'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-600'>Status:</span>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={job.visible}
                        onChange={() => changeJobVisibility(job._id)}
                        className='sr-only peer'
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className='flex gap-2'>
                    <NavLink to={`/dashboard/view-applications?jobId=${job._id}`}>
                      <button className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg'>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                        </svg>
                      </button>
                    </NavLink>
                    <button
                      onClick={() => deleteJob(job._id)}
                      className='p-2 text-red-600 hover:bg-red-50 rounded-lg'
                    >
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageJobs;