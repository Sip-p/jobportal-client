import React, { useEffect } from 'react';
import { assets, viewApplicationsPageData } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios'
import { useState } from 'react';
const ViewApplications = () => {
  const {companyData,alljobs,setAlljobs,backendUrl,companyToken}=useContext(AppContext)
 const [applicants, setApplicants] = useState([]);
  
 const getApplications = async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
      headers: { token: companyToken },
    });

    if (data.success) {
      setApplicants(data.applicants); // ✅ Save to state
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

//function to update job application status
const updateApplicationStatus=async(id,status)=>{
  try {
    const {data}=await axios.post(backendUrl+'/api/company/change-status',{id,status},{
      headers:{token:companyToken}
    })
    if(data.success){
      toast.success(data.message)
         getApplications()
    }
    else{
      toast.error(data.message)
    }
  }
  catch(error){
    toast.error(error.message)
  }
}
  useEffect(()=>{
    getApplications()
  },[])
  return (
    <div className="m-9 overflow-x-auto">
      <table className="border-2 w-full text-left">
        <thead>
          <tr className=" "> 
            <th className="px-4 py-2 max-sm:hidden bg-gradient-to-r from-purple-800 to-purple-950 text-white">#</th>
            <th className="px-4 py-2 max-sm:hidden bg-gradient-to-r from-purple-800 to-purple-950 text-white">User Name</th>
            <th className="px-4 py-2 bg-gradient-to-r from-purple-800 to-purple-950 text-white">Job Title</th>
            <th className="px-4 py-2 bg-gradient-to-r from-purple-800 to-purple-950 text-white">Location</th>
            <th className="px-4 py-2 bg-gradient-to-r from-purple-800 to-purple-950 text-white">Resume</th>
            <th className="px-4 py-2 bg-gradient-to-r from-purple-800 to-purple-950  text-white">Action</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((item, idx) => (
            <tr key={idx} className="border-b">
              <td className="px-4 py-2   max-sm:hidden">{idx+1}</td>
              <td className="px-4 py-2 flex items-center max-sm:hidden  ">
                {console.log("item is",item)}
                {/* <img src={item.imgSrc} alt="" className="h-10 w-10 rounded-full mr-2 " /> */}
                <span className=''>{item.name}</span>
              </td>
              <td className="px-4 py-2  ">{item.jobTitle}</td>
              <td className="px-4 py-2  ">{item.location}</td>
          <td className="px-4 py-2  ">
  {item.resume ? (
    <a
      href={item.resume}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-blue-700 hover:underline"
    >
      Resume
      <img src={assets.resume_download_icon} alt="Download Icon" />
    </a>
  ) : (
    <span className="text-gray-500">No resume</span>
  )}
</td>
              <td className="px-4 py-2  ">
                {item.status==='pending'?<> <button className="w-full px-4 py-1 text-blue-500 hover:bg-gray-100 bg-green-300 rounded-md" onClick={()=>updateApplicationStatus(item._id,'Accepted')}>
                  Accept
                </button>
                <button className="w-full px-4 py-1 text-red-500 hover:bg-gray-100 bg-red-300 rounded-md mt-2" onClick={()=>updateApplicationStatus(item._id,'Rejected')}>
                  Reject
                </button></>:<div>{item.status}</div>}
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewApplications;