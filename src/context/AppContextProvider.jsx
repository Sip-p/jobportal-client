
// import { jobsData } from '../assets/assets';
// import { AppContext } from './AppContext';
// import { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import { useUser, useAuth } from '@clerk/clerk-react';
// import axios from 'axios';
// import { data } from 'react-router-dom';
// const AppContextProvider = ({ children }) => {
//   const [searchFilter, setSearchFilter] = useState({
//     title: '',
//     location: ''
//   });
//   const [isSearched, setIsSearched] = useState(true);
//   const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)
//   const [islogin, setIsLogin] = useState(false)
//   const [logout, setLogout] = useState(false)
//   const [companyData, setCompanyData] = useState(null)
// const [companyToken, setCompanyToken] = useState(() => {
//   return localStorage.getItem('companyToken') || null;
// });  const [alljobs, setAlljobs] = useState([])
//   const [userApplications, setUserApplications] = useState([])
//   const [userData,setUserData]=useState(null)
// const [appliedJobs, setAppliedJobs] = useState(() => {
//   const stored = localStorage.getItem('appliedJobs');
//   return stored ? JSON.parse(stored) : [];
// });  const backendUrl = import.meta.env.VITE_BACKEND_URL

//   const { user } = useUser()
//   // console.log(user)
//   const { getToken } = useAuth()
//   // console.log("getToken= ",getToken)
   
 
   
   
   




 

// const saveUserToDB = async () => {
//   if (!user) {
//     console.log("user not found");
//     return;
//   }

//   try {
//     const token = await getToken(); // Clerk JWT

//     const response = await axios.post(
//       backendUrl + "/api/users/save",
//       {
//         clerkId: user.id,
//         name: user.username,
//         email: user.primaryEmailAddress?.emailAddress,
//         image: "",
//         resume: ""
//       },
//       {
//         headers: { Authorization: `Bearer ${token}` }
//       }
//     );

//     // console.log("Saved data=>>", response);

//     if (response.status === 200) {
//       setUserData(response.data); // ✅ correct property
//       // console.log("usedata is ..", response.data);
//       // console.log(userData)
//     } else {
//       console.log("Something went wrong, data is not saved");
//     }

//   } catch (error) {
//     console.error("Error saving user to DB:", error.message);
//   }
// };


// const fetchUserData = async () => {
//   try {
//     const token = await getToken(); // Clerk JWT
//     const { data } = await axios.get(`${backendUrl}/api/users/user`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

 

//     if (data.success) {
//       setUserData(data.user);
//     } else {
//       toast.error(data.message);
//     }
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to fetch user");
//   }
// };


//   const fetchJobs = async () => {
//     try {

//       const { jobsData } = await axios.get(backendUrl + '/api/jobs')
//       // console.log(".."+jobsData)
//     } catch (error) {

//     }

//   }
//   const fetchCompanyData = async () => {
//     try {
//       const { data } = await axios.get(backendUrl + '/api/company/company', { headers: { token: companyToken } })
//       if (data.success) {
//         // console.log("company details",data)
//         setCompanyData(data.company)
//       }
//       else {
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }
//  useEffect(() => {
//   if (!showRecruiterLogin && user) {
//     fetchUserData();
//     saveUserToDB();
//   }
// }, [user, showRecruiterLogin]);
// useEffect(()=>{
//   if(companyToken){
//     fetchCompanyData()
//   }
// },[companyToken])
// useEffect(() => {
//   if (companyToken) {
//     localStorage.setItem('companyToken', companyToken);
//   } else {
//     localStorage.removeItem('companyToken');
//   }
// }, [companyToken]);
// const value = {
//     setSearchFilter,
//     searchFilter,
//     isSearched,
//     setIsSearched,
//     showRecruiterLogin, setShowRecruiterLogin, companyData, setCompanyData, companyToken, setCompanyToken
//     , backendUrl, alljobs, setAlljobs, userApplications, setUserApplications,userData,setUserData,fetchUserData,appliedJobs, setAppliedJobs
//   }
 
//   return (
//     <AppContext.Provider value={value}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export default AppContextProvider;



import { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { AppContext } from './AppContext';

const AppContextProvider = ({ children }) => {
  const [searchFilter, setSearchFilter] = useState({
    title: '',
    location: ''
  });
  const [isSearched, setIsSearched] = useState(true);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [companyToken, setCompanyToken] = useState(() => {
    return localStorage.getItem('companyToken') || null;
  });
  const [alljobs, setAlljobs] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [userData, setUserData] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(() => {
    const stored = localStorage.getItem('appliedJobs');
    return stored ? JSON.parse(stored) : [];
  });

  // ✅ FIX: Remove trailing slash if exists
  const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || '';

  const { user } = useUser();
  const { getToken } = useAuth();

  // ✅ Save user to database
  const saveUserToDB = async () => {
    if (!user) return;

    try {
      const token = await getToken();

      const response = await axios.post(
        `${backendUrl}/api/users/save`, // ✅ Fixed: Template literal, no double slash
        {
          clerkId: user.id,
          name: user.username || user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          image: user.imageUrl || "",
          resume: ""
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setUserData(response.data.user);
        toast.success("User saved successfully");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user");
    }
  };

  // ✅ Fetch user data
  const fetchUserData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/users/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      // Don't show error toast on mount, only on explicit actions
    }
  };

  // ✅ Fetch all jobs
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      if (data.success) {
        setAlljobs(data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs");
    }
  };

  // ✅ Fetch company data
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: { token: companyToken }
      });

      if (data.success) {
        setCompanyData(data.company);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching company:", error);
      toast.error("Failed to fetch company data");
    }
  };

  // ✅ Fetch user applications
  const fetchUserApplications = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setUserApplications(data.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  // ✅ Effect: Handle user login
  useEffect(() => {
    if (!showRecruiterLogin && user) {
      fetchUserData();
      saveUserToDB();
    }
  }, [user, showRecruiterLogin]);

  // ✅ Effect: Handle company token
  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
      localStorage.setItem('companyToken', companyToken);
    } else {
      localStorage.removeItem('companyToken');
    }
  }, [companyToken]);

  // ✅ Effect: Sync appliedJobs to localStorage
  useEffect(() => {
    localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyData,
    setCompanyData,
    companyToken,
    setCompanyToken,
    backendUrl,
    alljobs,
    setAlljobs,
    userApplications,
    setUserApplications,
    userData,
    setUserData,
    fetchUserData,
    fetchJobs,
    fetchUserApplications,
    appliedJobs,
    setAppliedJobs
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;