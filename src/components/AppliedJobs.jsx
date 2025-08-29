import React, { useEffect, useContext } from 'react';
import moment from 'moment';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useAuth } from '@clerk/clerk-react';

const AppliedJobs = () => {
  const { backendUrl, userApplications, setUserApplications } = useContext(AppContext);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
console.log("Fetched applications data:", data);
        if (data.success) {

          setUserApplications(data.applications); // ✅ Store full application data
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error("Error fetching applications:", error.message);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className='flex justify-center'>
      <div className='p-4 w-full max-w-4xl'>
        <h2 className='text-2xl font-semibold mb-4'>Applied Jobs</h2>
        {userApplications.length === 0 ? (
          <p className='text-center text-gray-500'>You haven’t applied to any jobs yet.</p>
        ) : (
          <table className='min-w-full border'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='p-2 text-left'>Company</th>
                <th className='p-2 text-left'>Job Title</th>
                <th className='p-2 text-left'>Location</th>
                <th className='p-2 text-left'>Date</th>
                <th className='p-2 text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {userApplications.map((application, idx) => (
                <tr key={idx} className='border-b'>
                  <td className='p-2 flex items-center gap-2'>
                    <img
                      src={application.companyId?.image}
                      alt='Company Logo'
                      className='w-8 h-8 object-contain rounded-full'
                    />
                    {application.companyId?.name}
                  </td>
                  <td className='p-2'>{application.jobId?.title}</td>
                  <td className='p-2'>{application.jobId?.location}</td>
                  <td className='p-2'>{moment(application.date).format('ll')}</td>
                  <td className='p-2'>
                    <span
                      className={`px-2 py-1 rounded ${
                        application.status === 'Accepted'
                          ? 'bg-green-500 text-white'
                          : application.status === 'Rejected'
                          ? 'bg-red-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {application.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;