// import React, { useEffect } from 'react';
// import { assets, viewApplicationsPageData } from '../assets/assets';
// import { AppContext } from '../context/AppContext';
// import { useContext } from 'react';
// import { toast } from 'react-toastify';
// import axios from 'axios'
// import { useState } from 'react';
// const ViewApplications = () => {
//   const {companyData,alljobs,setAlljobs,backendUrl,companyToken}=useContext(AppContext)
//  const [applicants, setApplicants] = useState([]);
  
//  const getApplications = async () => {
//   try {
//     const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
//       headers: { token: companyToken },
//     });

//     if (data.success) {
//       setApplicants(data.applicants); // ✅ Save to state
//     } else {
//       toast.error(data.message);
//     }
//   } catch (error) {
//     toast.error(error.message);
//   }
// };

// //function to update job application status
// const updateApplicationStatus=async(id,status)=>{
//   try {
//     const {data}=await axios.post(backendUrl+'/api/company/change-status',{id,status},{
//       headers:{token:companyToken}
//     })
//     if(data.success){
//       toast.success(data.message)
//          getApplications()
//     }
//     else{
//       toast.error(data.message)
//     }
//   }
//   catch(error){
//     toast.error(error.message)
//   }
// }
//   useEffect(()=>{
//     getApplications()
//   },[])
//   return (
//     <div className="m-9 overflow-x-auto">
//       <table className="border-2 w-full text-left">
//         <thead>
//           <tr className=" "> 
//             <th className="px-4 py-2 max-sm:hidden bg-gradient-to-r from-purple-800 to-purple-950 text-white">#</th>
//             <th className="px-4 py-2 max-sm:hidden bg-gradient-to-r from-purple-800 to-purple-950 text-white">User Name</th>
//             <th className="px-4 py-2 bg-gradient-to-r from-purple-800 to-purple-950 text-white">Job Title</th>
//             <th className="px-4 py-2 bg-gradient-to-r from-purple-800 to-purple-950 text-white">Location</th>
//             <th className="px-4 py-2 bg-gradient-to-r from-purple-800 to-purple-950 text-white">Resume</th>
//             <th className="px-4 py-2 bg-gradient-to-r from-purple-800 to-purple-950  text-white">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {applicants.map((item, idx) => (
//             <tr key={idx} className="border-b">
//               <td className="px-4 py-2   max-sm:hidden">{idx+1}</td>
//               <td className="px-4 py-2 flex items-center max-sm:hidden  ">
//                 {console.log("item is",item)}
//                 {/* <img src={item.imgSrc} alt="" className="h-10 w-10 rounded-full mr-2 " /> */}
//                 <span className=''>{item.name}</span>
//               </td>
//               <td className="px-4 py-2  ">{item.jobTitle}</td>
//               <td className="px-4 py-2  ">{item.location}</td>
//           <td className="px-4 py-2  ">
//   {item.resume ? (
//     <a
//       href={item.resume}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="flex items-center gap-2 text-blue-700 hover:underline"
//     >
//       Resume
//       <img src={assets.resume_download_icon} alt="Download Icon" />
//     </a>
//   ) : (
//     <span className="text-gray-500">No resume</span>
//   )}
// </td>
//               <td className="px-4 py-2  ">
//                 {item.status==='pending'?<> <button className="w-full px-4 py-1 text-blue-500 hover:bg-gray-100 bg-green-300 rounded-md" onClick={()=>updateApplicationStatus(item._id,'Accepted')}>
//                   Accept
//                 </button>
//                 <button className="w-full px-4 py-1 text-red-500 hover:bg-gray-100 bg-red-300 rounded-md mt-2" onClick={()=>updateApplicationStatus(item._id,'Rejected')}>
//                   Reject
//                 </button></>:<div>{item.status}</div>}
                
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ViewApplications;


import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import moment from 'moment';

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId'); // ✅ Get jobId from URL

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, accepted, rejected
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Fetch applications
  const getApplications = async () => {
    try {
      setLoading(true);
      const url = jobId
        ? `${backendUrl}/api/company/applicants?jobId=${jobId}`
        : `${backendUrl}/api/company/applicants`;

      const { data } = await axios.get(url, {
        headers: { token: companyToken },
      });

      if (data.success) {
        setApplicants(data.applicants || []);
      } else {
        toast.error(data.message || 'Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update application status
  const updateApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { id, status },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message || `Application ${status.toLowerCase()}`);
        // ✅ Update local state instead of refetching
        setApplicants(prevApplicants =>
          prevApplicants.map(app =>
            app._id === id ? { ...app, status } : app
          )
        );
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  useEffect(() => {
    getApplications();
  }, [jobId]);

  // ✅ Filter applications
  const filteredApplicants = applicants.filter(app => {
    const matchesSearch =
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      app.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // ✅ Statistics
  const stats = {
    total: applicants.length,
    pending: applicants.filter(app => app.status?.toLowerCase() === 'pending').length,
    accepted: applicants.filter(app => app.status?.toLowerCase() === 'accepted').length,
    rejected: applicants.filter(app => app.status?.toLowerCase() === 'rejected').length,
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 max-w-7xl'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>
          {jobId ? 'Job Applications' : 'All Applications'}
        </h1>
        <p className='text-gray-600'>Review and manage candidate applications</p>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
        <div className='bg-white rounded-lg shadow p-4 border-l-4 border-blue-500'>
          <p className='text-sm text-gray-600'>Total</p>
          <p className='text-2xl font-bold text-gray-800'>{stats.total}</p>
        </div>
        <div className='bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500'>
          <p className='text-sm text-gray-600'>Pending</p>
          <p className='text-2xl font-bold text-gray-800'>{stats.pending}</p>
        </div>
        <div className='bg-white rounded-lg shadow p-4 border-l-4 border-green-500'>
          <p className='text-sm text-gray-600'>Accepted</p>
          <p className='text-2xl font-bold text-gray-800'>{stats.accepted}</p>
        </div>
        <div className='bg-white rounded-lg shadow p-4 border-l-4 border-red-500'>
          <p className='text-sm text-gray-600'>Rejected</p>
          <p className='text-2xl font-bold text-gray-800'>{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-lg shadow p-4 mb-6'>
        <div className='flex flex-col md:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1'>
            <input
              type='text'
              placeholder='Search by name or job title...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='all'>All Status</option>
            <option value='pending'>Pending</option>
            <option value='accepted'>Accepted</option>
            <option value='rejected'>Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplicants.length === 0 ? (
        <div className='bg-white rounded-lg shadow p-12 text-center'>
          <div className='text-6xl mb-4'>📋</div>
          <h3 className='text-xl font-semibold text-gray-700 mb-2'>No Applications Found</h3>
          <p className='text-gray-500'>
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'No applications have been received yet'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className='hidden md:block bg-white rounded-lg shadow overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead className='bg-gradient-to-r from-purple-800 to-purple-950 text-white'>
                  <tr>
                    <th className='py-3 px-4 text-left text-sm font-semibold'>#</th>
                    <th className='py-3 px-4 text-left text-sm font-semibold'>Candidate</th>
                    <th className='py-3 px-4 text-left text-sm font-semibold'>Job Title</th>
                    <th className='py-3 px-4 text-left text-sm font-semibold'>Location</th>
                    <th className='py-3 px-4 text-left text-sm font-semibold'>Applied Date</th>
                    <th className='py-3 px-4 text-left text-sm font-semibold'>Resume</th>
                    <th className='py-3 px-4 text-center text-sm font-semibold'>Status</th>
                    <th className='py-3 px-4 text-center text-sm font-semibold'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.map((item, idx) => (
                    <tr key={item._id} className='border-b hover:bg-gray-50 transition'>
                      <td className='py-3 px-4 text-gray-700'>{idx + 1}</td>
                      <td className='py-3 px-4'>
                        <div className='flex items-center gap-3'>
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className='w-10 h-10 rounded-full object-cover border-2 border-gray-200'
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40';
                              }}
                            />
                          ) : (
                            <div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold'>
                              {item.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className='font-medium text-gray-800'>{item.name || 'N/A'}</p>
                            <p className='text-sm text-gray-500'>{item.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className='py-3 px-4 text-gray-700'>{item.jobTitle || 'N/A'}</td>
                      <td className='py-3 px-4 text-gray-600'>{item.location || 'N/A'}</td>
                      <td className='py-3 px-4 text-gray-600'>
                        {item.date ? moment(item.date).format('MMM DD, YYYY') : 'N/A'}
                      </td>
                      <td className='py-3 px-4'>
                        {item.resume ? (
                          <a
                            href={item.resume}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                            </svg>
                            View
                          </a>
                        ) : (
                          <span className='text-gray-400 text-sm'>No resume</span>
                        )}
                      </td>
                      <td className='py-3 px-4 text-center'>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            item.status?.toLowerCase() === 'accepted'
                              ? 'bg-green-100 text-green-700'
                              : item.status?.toLowerCase() === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {item.status || 'Pending'}
                        </span>
                      </td>
                      <td className='py-3 px-4'>
                        {item.status?.toLowerCase() === 'pending' ? (
                          <div className='flex items-center justify-center gap-2'>
                            <button
                              onClick={() => updateApplicationStatus(item._id, 'Accepted')}
                              className='px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium'
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(item._id, 'Rejected')}
                              className='px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium'
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className='text-center text-gray-500 text-sm'>
                            {item.status === 'Accepted' ? '✓ Processed' : '✗ Processed'}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className='md:hidden space-y-4'>
            {filteredApplicants.map((item, idx) => (
              <div key={item._id} className='bg-white rounded-lg shadow p-4 border border-gray-200'>
                <div className='flex items-start gap-3 mb-3'>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-12 h-12 rounded-full object-cover border-2 border-gray-200'
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/48';
                      }}
                    />
                  ) : (
                    <div className='w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-lg'>
                      {item.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className='flex-1'>
                    <h3 className='font-semibold text-gray-800'>{item.name || 'N/A'}</h3>
                    <p className='text-sm text-gray-600'>{item.jobTitle || 'N/A'}</p>
                    <p className='text-xs text-gray-500 mt-1'>
                      {item.date ? moment(item.date).format('MMM DD, YYYY') : 'N/A'}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status?.toLowerCase() === 'accepted'
                        ? 'bg-green-100 text-green-700'
                        : item.status?.toLowerCase() === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {item.status || 'Pending'}
                  </span>
                </div>

                <div className='space-y-2 mb-3 text-sm'>
                  <p className='text-gray-600'>
                    <span className='font-medium'>Location:</span> {item.location || 'N/A'}
                  </p>
                  {item.resume && (
                    <a
                      href={item.resume}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                      </svg>
                      View Resume
                    </a>
                  )}
                </div>

                {item.status?.toLowerCase() === 'pending' && (
                  <div className='flex gap-2 pt-3 border-t'>
                    <button
                      onClick={() => updateApplicationStatus(item._id, 'Accepted')}
                      className='flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium'
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(item._id, 'Rejected')}
                      className='flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium'
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewApplications;