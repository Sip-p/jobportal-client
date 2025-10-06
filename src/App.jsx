 import React, { useContext } from 'react'
 import {Routes,Route} from 'react-router-dom'
 import Home from './pages/Home'
import Applyjob from './pages/Applyjob'
import Applications from './pages/Applications'
import Loading from './components/Loading'
import { useEffect,useState } from 'react'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import DashBoard from './pages/DashBoard'
import Managejobs from './pages/Managejobs'
import ViewApplications from './pages/ViewApplications'
import Addjobs from './pages/Addjobs'
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import ChatBot from './components/ChatBot'
// import {ScrollTrigger} from "gsap/ScrollTrigger"
// gsap.registerPlugin(ScrollTrigger)
 const App = () => {
  const [loading,setLoading]=useState(true);
  const {showRecruiterLogin,companyToken}=useContext(AppContext)
  
useEffect(()=>{
const timer=setTimeout(()=>
  {setLoading(false)
 },3000)
 return ()=>{clearTimeout(timer)}

},[])
if(loading){return <Loading/>}
   return (
      <div>
        {showRecruiterLogin && <RecruiterLogin/>}
             <ToastContainer/>
        <Routes>

          <Route path='/' element={<Home/>}/> 
          <Route path='/apply-job/:id' element={<Applyjob/>}/> 
          <Route path='/applications' element={<Applications/>}/> 
           <Route path='/dashboard' element={<DashBoard/>}>
          {companyToken ?<>
          <Route path='managejobs' element={<Managejobs/>}/>
<Route path='view-applications' element={<ViewApplications/>}/>
<Route path='add-job' element={<Addjobs/>}/></>:null}
 
          </Route>
         </Routes>
       <ChatBot/>
      </div>
   )
 }
 
 export default App