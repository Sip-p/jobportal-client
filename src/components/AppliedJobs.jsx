// import React, { useEffect, useContext } from 'react';
// import moment from 'moment';
// import axios from 'axios';
// import { AppContext } from '../context/AppContext';
// import { useAuth } from '@clerk/clerk-react';

// const AppliedJobs = () => {
//   const { backendUrl, userApplications, setUserApplications } = useContext(AppContext);
//   const { getToken } = useAuth();

//   useEffect(() => {
//     const fetchApplications = async () => {
//       try {
//         const token = await getToken();
//         const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
// console.log("Fetched applications data:", data);
//         if (data.success) {

//           setUserApplications(data.applications); // ✅ Store full application data
//         } else {
//           console.log(data.message);
//         }
//       } catch (error) {
//         console.error("Error fetching applications:", error.message);
//       }
//     };

//     fetchApplications();
//   }, []);

//   return (
//     <div className='flex justify-center'>
//       <div className='p-4 w-full max-w-4xl'>
//         <h2 className='text-2xl font-semibold mb-4'>Applied Jobs</h2>
//         {userApplications.length === 0 ? (
//           <p className='text-center text-gray-500'>You haven’t applied to any jobs yet.</p>
//         ) : (
//           <table className='min-w-full border'>
//             <thead>
//               <tr className='bg-gray-100'>
//                 <th className='p-2 text-left'>Company</th>
//                 <th className='p-2 text-left'>Job Title</th>
//                 <th className='p-2 text-left'>Location</th>
//                 <th className='p-2 text-left'>Date</th>
//                 <th className='p-2 text-left'>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {userApplications.map((application, idx) => (
//                 <tr key={idx} className='border-b'>
//                   <td className='p-2 flex items-center gap-2'>
//                     <img
//                       src={application.companyId?.image}
//                       alt='Company Logo'
//                       className='w-8 h-8 object-contain rounded-full'
//                     />
//                     {application.companyId?.name}
//                   </td>
//                   <td className='p-2'>{application.jobId?.title}</td>
//                   <td className='p-2'>{application.jobId?.location}</td>
//                   <td className='p-2'>{moment(application.date).format('ll')}</td>
//                   <td className='p-2'>
//                     <span
//                       className={`px-2 py-1 rounded ${
//                         application.status === 'Accepted'
//                           ? 'bg-green-500 text-white'
//                           : application.status === 'Rejected'
//                           ? 'bg-red-500 text-white'
//                           : 'bg-blue-500 text-white'
//                       }`}
//                     >
//                       {application.status || 'Pending'}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AppliedJobs;


import React, { useEffect, useContext, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AppliedJobs = () => {
  const { backendUrl, userApplications, setUserApplications, userData } = useContext(AppContext);
  const { getToken } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched applications:", data);

      if (data.success) {
        setUserApplications(data.applications || []);
      } else {
        toast.error(data.message || "Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  // Filter applications based on status
  const filteredApplications = filter === 'all' 
    ? userApplications 
    : userApplications.filter(app => 
        app.status?.toLowerCase() === filter.toLowerCase()
      );

  // Loading state
  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Applied Jobs</h1>
          <p className='text-gray-600'>
            Total Applications: <span className='font-semibold'>{userApplications.length}</span>
          </p>
        </div>

        {/* Filter Tabs */}
        <div className='flex gap-2 mb-6 border-b pb-2 overflow-x-auto'>
          {['all', 'pending', 'accepted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-t-lg font-medium capitalize transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
              {status !== 'all' && (
                <span className='ml-2 text-xs bg-white text-gray-800 px-2 py-0.5 rounded-full'>
                  {userApplications.filter(app => 
                    app.status?.toLowerCase() === status
                  ).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className='text-center py-12 bg-gray-50 rounded-lg'>
            <div className='text-6xl mb-4'>📋</div>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              {filter === 'all' 
                ? "No Applications Yet" 
                : `No ${filter} Applications`}
            </h3>
            <p className='text-gray-500 mb-6'>
              {filter === 'all'
                ? "Start applying to jobs to see them here"
                : `You don't have any ${filter} applications`}
            </p>
            <Link to='/'>
              <button className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition'>
                Browse Jobs
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop View - Table */}
            <div className='hidden md:block overflow-x-auto bg-white rounded-lg shadow'>
              <table className='min-w-full'>
                <thead>
                  <tr className='bg-gray-100 border-b'>
                    <th className='p-4 text-left font-semibold text-gray-700'>Company</th>
                    <th className='p-4 text-left font-semibold text-gray-700'>Job Title</th>
                    <th className='p-4 text-left font-semibold text-gray-700'>Location</th>
                    <th className='p-4 text-left font-semibold text-gray-700'>Applied Date</th>
                    <th className='p-4 text-left font-semibold text-gray-700'>Status</th>
                    <th className='p-4 text-left font-semibold text-gray-700'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application, idx) => (
                    <tr key={application._id || idx} className='border-b hover:bg-gray-50 transition'>
                      <td className='p-4'>
                        <div className='flex items-center gap-3'>
                          {application.companyId?.image ? (
                            <img
                              src={application.companyId.image}
                              alt={application.companyId?.name}
                              className='w-10 h-10 object-contain rounded-full bg-gray-100 p-1'
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40';
                              }}
                            />
                          ) : (
                            <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                              <span className='text-gray-500 text-xs'>N/A</span>
                            </div>
                          )}
                          <span className='font-medium text-gray-800'>
                            {application.companyId?.name || 'Company Name'}
                          </span>
                        </div>
                      </td>
                      <td className='p-4 text-gray-700'>
                        {application.jobId?.title || 'Job Title'}
                      </td>
                      <td className='p-4 text-gray-600'>
                        {application.jobId?.location || 'Location'}
                      </td>
                      <td className='p-4 text-gray-600'>
                        {application.date 
                          ? moment(application.date).format('MMM DD, YYYY')
                          : 'N/A'}
                      </td>
                      <td className='p-4'>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            application.status === 'Accepted' || application.status === 'accepted'
                              ? 'bg-green-100 text-green-700'
                              : application.status === 'Rejected' || application.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {application.status || 'Pending'}
                        </span>
                      </td>
                      <td className='p-4'>
                        {application.jobId?._id && (
                          <Link to={`/apply-job/${application.jobId._id}`}>
                            <button className='text-blue-600 hover:text-blue-800 font-medium transition'>
                              View Job
                            </button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Cards */}
            <div className='md:hidden space-y-4'>
              {filteredApplications.map((application, idx) => (
                <div
                  key={application._id || idx}
                  className='bg-white rounded-lg shadow p-4 border border-gray-200'
                >
                  <div className='flex items-start gap-3 mb-3'>
                    {application.companyId?.image ? (
                      <img
                        src={application.companyId.image}
                        alt={application.companyId?.name}
                        className='w-12 h-12 object-contain rounded-full bg-gray-100 p-1'
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/48';
                        }}
                      />
                    ) : (
                      <div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center'>
                        <span className='text-gray-500'>N/A</span>
                      </div>
                    )}
                    <div className='flex-1'>
                      <h3 className='font-semibold text-gray-800'>
                        {application.jobId?.title || 'Job Title'}
                      </h3>
                      <p className='text-sm text-gray-600'>
                        {application.companyId?.name || 'Company Name'}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.status === 'Accepted' || application.status === 'accepted'
                          ? 'bg-green-100 text-green-700'
                          : application.status === 'Rejected' || application.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {application.status || 'Pending'}
                    </span>
                  </div>
                  
                  <div className='space-y-1 mb-3 text-sm'>
                    <p className='text-gray-600'>
                      <span className='font-medium'>Location:</span> {application.jobId?.location || 'N/A'}
                    </p>
                    <p className='text-gray-600'>
                      <span className='font-medium'>Applied:</span>{' '}
                      {application.date ? moment(application.date).format('MMM DD, YYYY') : 'N/A'}
                    </p>
                  </div>

                  {application.jobId?._id && (
                    <Link to={`/apply-job/${application.jobId._id}`}>
                      <button className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'>
                        View Job Details
                      </button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Summary Stats */}
        {userApplications.length > 0 && (
          <div className='grid grid-cols-3 gap-4 mt-8'>
            <div className='bg-blue-50 rounded-lg p-4 text-center'>
              <p className='text-2xl font-bold text-blue-600'>
                {userApplications.filter(app => 
                  !app.status || app.status.toLowerCase() === 'pending'
                ).length}
              </p>
              <p className='text-sm text-gray-600'>Pending</p>
            </div>
            <div className='bg-green-50 rounded-lg p-4 text-center'>
              <p className='text-2xl font-bold text-green-600'>
                {userApplications.filter(app => 
                  app.status?.toLowerCase() === 'accepted'
                ).length}
              </p>
              <p className='text-sm text-gray-600'>Accepted</p>
            </div>
            <div className='bg-red-50 rounded-lg p-4 text-center'>
              <p className='text-2xl font-bold text-red-600'>
                {userApplications.filter(app => 
                  app.status?.toLowerCase() === 'rejected'
                ).length}
              </p>
              <p className='text-sm text-gray-600'>Rejected</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;