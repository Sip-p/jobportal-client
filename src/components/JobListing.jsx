import {AppContext} from '../context/AppContext';
import {useContext,useEffect,useState} from 'react';
import {assets,JobCategories,JobLocations,jobsData} from '../assets/assets';
import { Link } from 'react-router-dom';
import axios  from 'axios'
import { toast } from 'react-toastify';
const JobListing=()=>{
    const {searchFilter,isSearched,setSearchFilter}=useContext(AppContext);
// let content = jobsData.length % 6;
let arr = Array.from({ length:Math.ceil(jobsData.length/6)}).fill(0);
const [alljob,setAlljob]=useState([])
const [currentPage,setCurrentPage] = useState(0);
const hasTitle = searchFilter.title.trim() !== "";
const hasLocation = searchFilter.location.trim() !== "";
const [categoryFilter, setCategoryFilter] = useState([]);
const [locationFilter, setLocationFilter] = useState([]);
const {backendUrl,appliedJobs,setAppliedJobs,userData}=useContext(AppContext)
const getAllJobs=async()=>{
  const {data}=await axios.get(backendUrl+'/api/jobs')
  console.log(data)

  const updatedJobs=[...alljob,...data.jobs]
  setAlljob(updatedJobs)
  console.log("all jobs are",alljob)
}

const applyHandler=async()=>{
  try {
    if(!userData){
      return toast.error('Login to apply for job')
    }
    if(!userData.resume){
       navigate('/applications')
      return toast.error("Upload resume to apply")
    }
  } catch (error) {
    toast.error(error.message)
  }
}

useEffect(()=>{
getAllJobs()
},[])

const handleCategoryChange = (category) => {
  if(!categoryFilter.includes(category)) {
    setCategoryFilter([...categoryFilter, category]);
  }
  else {
    setCategoryFilter(categoryFilter.filter(item => item !== category));
  }
};
const handleLocationChange = (location) => {
  if(!locationFilter.includes(location)) {
    setLocationFilter([...locationFilter, location]);
  }
  else {
    setLocationFilter(locationFilter.filter(item => item !== location));
  }
};
const chekedbox=true;
const setClear = () => {
  setSearchFilter({title: '', location: ''});
  setCategoryFilter([]);
  setLocationFilter([]);
  setCurrentPage(0);
   
};

const filteredJobs = isSearched && (hasTitle || hasLocation || categoryFilter.length > 0 || locationFilter.length > 0)
  ? alljob.filter(item => {
      const titleMatch = hasTitle
        ? item.title.toLowerCase().includes(searchFilter.title.toLowerCase())
        : true;

      const locationMatch = hasLocation
        ? item.location.toLowerCase().includes(searchFilter.location.toLowerCase())
        : true;
const categoryFilterMatch = categoryFilter.length > 0
        ? categoryFilter.includes(item.category)
        : true;
const locationFilterMatch = locationFilter.length > 0
    ? locationFilter.includes(item.location)
    : true;
      return titleMatch && locationMatch && categoryFilterMatch && locationFilterMatch;
    })
  : alljob;

const paginatedJobs = filteredJobs.slice(currentPage * 6, currentPage * 6 + 6);

    return (
        <div className='container 2xl:px-20 mx-auto my-10 px-12  grid grid-cols-[1fr_3fr] max-sm:grid-cols-1     '>
             
 <div className='flex flex-col gap-4    shadow-lg p-2 rounded-lg    bg-gray-100   '> 
            <div className='w-full flex my-5 lg:w-1/4   px-4'>
{
    isSearched && (searchFilter.title !==""|| searchFilter.location !=="") &&
    <div className='flex flex-col'>
    <h3 className='  h-8 px-3 w-36 ml-4 pt-1 bg-gradient-to-r from-purple-800 to-purple-950 text-white'>Current Search</h3>
    <div className=' mt-5  ml-6 w-26  '>
        {searchFilter.title && (
          <div className='flex'> <span className=' p-2   flex gap-3 w-full items-center mb-2 bg-purple-400'>
{searchFilter.title}
<img src={assets.cross_icon} alt="cross" className=' h-5 w-5 ml-2 cursor-pointer bg-white  ' onClick={()=>{setSearchFilter({...searchFilter,title:''})}}/>
            </span></div>
            
        )}
        
        {searchFilter.location && (
            <div className='flex'>
            <span className='  p-2 flex items-center mb-2 bg-purple-400'>
                {searchFilter.location}
                {searchFilter.location?<img src={assets.cross_icon} alt="cross" className='h-5 w-5 ml-2 cursor-pointer bg-white ' onClick={()=>{setSearchFilter({...searchFilter,location:''})}}/>:""
}
            </span>
            </div>
        )}
    </div>
    </div>

        
}
            </div  >
        <div className="px-3   ">
          <button onClick={()=>{setClear()}} className='bg-gradient-to-r from-purple-800 to-purple-950 p-2 rounded-lg text-white ml-4'>Clear Filter</button>
  <div className="     m-3 p-3 rounded-lg md:w-full">
    <h4 className="text-3xl"> Categories</h4>
    <ul>
      {JobCategories.map((category, idx) => (
        <li key={idx} className="flex items-center gap-3 my-5 w-full">
          <input type="checkbox" id={category} className='h-6 w-6' onChange={()=>{handleCategoryChange(category)}} checked={categoryFilter.includes(category)}/>
          <label htmlFor={category} className='text-lg'>{category}</label>
        </li>
      ))}
    </ul>
  </div>

  <div className="     m-3 p-3 rounded-lg md:w-full">
    <h4 className="text-3xl"> Locations</h4>
    <ul>
         
        
 
      {JobLocations.map((Location, idx) => (
        <li key={idx} className="flex items-center gap-3 my-5 w-full">
          <input type="checkbox" id={Location} className='h-6 w-6' onChange={( )=>{handleLocationChange(Location)}} checked={locationFilter.includes(Location)}/>
          <label htmlFor={Location}className='text-lg'>{Location}</label>
        </li>
      ))}
    </ul>
  </div>
</div>

 </div>

 {/* {list} */}
  <div> 
 <h1 className='flex justify-center text-3xl font-bold shadow-xl p-4 m-4 bg-gradient-to-r from-purple-800 to-purple-950 mt-0 rounded-lg text-white '>Latest Jobs</h1>   
        <div id='joblist' className='grid   gap-3 m-4 w-full max-sm:grid-cols-1 max-sm:m-3 max-sm:p-2  md:grid-cols-2'> 
     
  
        {
             paginatedJobs.map(( item,idx)=>{
                 
                return (
                     
<div key={idx} className='border border-gray-500 shadow-2xl p-4 rounded-lg h-64 w-full ml-4 hover:shadow-xl transition-all duration-300 ease-in-out max-lg:flex-col'>                    
                        <img className="h-16 w-16" src={item.companyId.image}/>
                        <h3 className='text-lg font-semibold'>{item.title}</h3>
                        <p className='text-sm text-gray-600'>{item.companyId.name}</p>
                        <p className='text-sm text-gray-600'>{item.location}</p>
 {/* <p   dangerouslySetInnerHTML={{__html:item.description.slice(0,150)} } className='text-sm text-gray-600 max-sm:hidden'></p> */}
 <Link to={`/apply-job/${item._id}`}> 
 <button className='bg-blue-500 rounded-2xl p-2 m-2 text-white' onClick={applyHandler}> {appliedJobs.includes(item._id)?"Applied":"Apply Now"}</button>
  
 <button className='bg-gray-300 rounded-2xl p-2 m-2'>Learn More</button></Link>
  
                    </div>
                )
            })
        }
    
       
        </div>
       {
        jobsData.length>0 &&(
            <div className='flex justify-center items-center my-5'>
                {currentPage >=0 &&
                <a href='#joblist'>
                    <img src={assets.left_arrow_icon} alt='' onClick={()=>{setCurrentPage(currentPage-1)}}/>
                </a>
}
                {
                    arr.map((item,idx)=>{
                        return (
                           <div key={idx}
  onClick={() => setCurrentPage(idx)}
  className={`w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mx-2 cursor-pointer 
              hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out 
              ${currentPage === idx ? 'bg-blue-500 text-white' : ''}`}
>
  {idx }
</div>

                        )
                    } )
                }
                {currentPage < Math.ceil(jobsData.length/6)-1 &&
                 <a href='#joblist'>
                     <img src={assets.right_arrow_icon} alt='' onClick={()=>{setCurrentPage(currentPage+1)}}/>

                </a>
}
                </div>
        )
       }
        </div>
        </div>
    )
}
export default JobListing;