
import { jobsData } from '../assets/assets';
import { AppContext } from './AppContext';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { data } from 'react-router-dom';
const AppContextProvider = ({ children }) => {
  const [searchFilter, setSearchFilter] = useState({
    title: '',
    location: ''
  });
  const [isSearched, setIsSearched] = useState(true);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)
  const [islogin, setIsLogin] = useState(false)
  const [logout, setLogout] = useState(false)
  const [companyData, setCompanyData] = useState(null)
const [companyToken, setCompanyToken] = useState(() => {
  return localStorage.getItem('companyToken') || null;
});  const [alljobs, setAlljobs] = useState([])
  const [userApplications, setUserApplications] = useState([])
  const [userData,setUserData]=useState(null)
const [appliedJobs, setAppliedJobs] = useState(() => {
  const stored = localStorage.getItem('appliedJobs');
  return stored ? JSON.parse(stored) : [];
});  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { user } = useUser()
  // console.log(user)
  const { getToken } = useAuth()
  // console.log("getToken= ",getToken)
   
 
   
   
   




 

const saveUserToDB = async () => {
  if (!user) {
    console.log("user not found");
    return;
  }

  try {
    const token = await getToken(); // Clerk JWT

    const response = await axios.post(
      backendUrl + "/api/users/save",
      {
        clerkId: user.id,
        name: user.username,
        email: user.primaryEmailAddress?.emailAddress,
        image: "",
        resume: ""
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // console.log("Saved data=>>", response);

    if (response.status === 200) {
      setUserData(response.data); // ✅ correct property
      // console.log("usedata is ..", response.data);
      // console.log(userData)
    } else {
      console.log("Something went wrong, data is not saved");
    }

  } catch (error) {
    console.error("Error saving user to DB:", error.message);
  }
};


const fetchUserData = async () => {
  try {
    const token = await getToken(); // Clerk JWT
    const { data } = await axios.get(`${backendUrl}/api/users/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

 

    if (data.success) {
      setUserData(data.user);
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch user");
  }
};


  const fetchJobs = async () => {
    try {

      const { jobsData } = await axios.get(backendUrl + '/api/jobs')
      // console.log(".."+jobsData)
    } catch (error) {

    }

  }
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/company/company', { headers: { token: companyToken } })
      if (data.success) {
        // console.log("company details",data)
        setCompanyData(data.company)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
 useEffect(() => {
  if (!showRecruiterLogin && user) {
    fetchUserData();
    saveUserToDB();
  }
}, [user, showRecruiterLogin]);
useEffect(()=>{
  if(companyToken){
    fetchCompanyData()
  }
},[companyToken])
useEffect(() => {
  if (companyToken) {
    localStorage.setItem('companyToken', companyToken);
  } else {
    localStorage.removeItem('companyToken');
  }
}, [companyToken]);
const value = {
    setSearchFilter,
    searchFilter,
    isSearched,
    setIsSearched,
    showRecruiterLogin, setShowRecruiterLogin, companyData, setCompanyData, companyToken, setCompanyToken
    , backendUrl, alljobs, setAlljobs, userApplications, setUserApplications,userData,setUserData,fetchUserData,appliedJobs, setAppliedJobs
  }
 
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;