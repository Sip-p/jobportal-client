 



import React, { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import { assets } from '../assets/assets';
import AppliedJobs from '../components/AppliedJobs';
import { AppContext } from '../context/AppContext';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Applications = () => {
  const { backendUrl, userData, fetchUserData } = useContext(AppContext);
  const { getToken } = useAuth();
  const { user } = useUser();

  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const updateResume = async (resume) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('resume', resume);

      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + '/api/users/update-resume',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Resume update response', data);

      if (data.success) {
        toast.success(data.message);
        await fetchUserData(); // reloads userData with new resume URL
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container 2xl:px-20 mx-auto my-10 px-12 flex flex-col">
        <h2>Your Resume</h2>
        <div className="flex mt-4 gap-4 items-center">
          {/* Button reflects backend state */}
          <button className="bg-sky-200 text-sky-800 p-1 rounded-lg">
            {uploading
              ? 'Uploading...'
              : userData?.resume
              ? 'uploaded'
              : 'No Resume Uploaded'}
          </button>

          {/* Upload input */}

{
  !userData?.resume && ( <label className="cursor-pointer flex items-center gap-2">
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  updateResume(file);
                }
              }}
            />
            <img src={assets.profile_upload_icon} alt="upload" />
          </label>)
}








          

          {/* If resume exists, show a link */}
         {userData?.resume && !isEditing && (
    <>
      <a
        href={userData.resume}
        target="_blank"
        rel="noopener noreferrer"
        className="py-1 px-2 bg-green-500 rounded-lg text-white"
      >
        View Resume
      </a>
      <button
        className="py-1 px-2 bg-sky-500 rounded-lg text-white"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </button>
    </>
  )}
    {/* Edit mode: file input again */}
  {isEditing && (
    <label className="cursor-pointer flex items-center gap-2">
      <input
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            updateResume(file);
            setIsEditing(false); // exit edit mode after uploading
          }
        }}
      />
      <span className="py-1 px-2 bg-orange-500 rounded-lg text-white">
        Choose New Resume
      </span>
    </label>
  )}
        </div>
      </div>
      <AppliedJobs />
    </div>
  );
};

export default Applications;
