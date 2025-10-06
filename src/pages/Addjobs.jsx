// import React, { useEffect, useState,useRef } from 'react'
//  import Quill from 'quill'
// import { JobCategories, JobLocations  } from '../assets/assets';
// import axios from 'axios'
// import { useContext } from 'react';
// import { AppContext } from '../context/AppContext';
// import { toast } from 'react-toastify';
// const Addjobs = () => {
//     const [title,setTitle]=useState('');
//     const [location,setLocation]=useState('Bangalore');
//     const [category,setCategory]=useState('Programming');
//     const [level,setLevel]=useState('Beginner Level')
//     const [salary,setSalary]=useState(0);
//     const editorRef=useRef(null);
//     const quillRef=useRef(null);
// const {backendUrl,companyToken}=useContext(AppContext)
//     useEffect(()=>{
// //Inititate quill only once
// if(!quillRef.current && editorRef.current){
//     quillRef.current=new Quill(editorRef.current,{
//         theme:'snow'
//     })
// }
//     },[])
// const addHandler=async(e)=>{
//     e.preventDefault()
//    if(!title || !location ||! level||!salary ||!category ){
// toast.error("Missing credentials") 
// return;  }
//    try {
//      const {data}=await axios.post(backendUrl+'/api/company/post-job',{title,location,category,level,salary,description:quillRef.current.root.innerHTML},{headers:{token:companyToken}})
//    if(data.success){
//     toast.success("Job added successfully!")
//     setTitle('')
//     setLocation('Bangalore');
//   setCategory('Programming');
//   setLevel('Beginner Level');
//   setSalary(0);
//   quillRef.current.root.innerHTML = "";

//     console.log(data)
//    }
//    else{
// toast.error(data.message)
//    }
//    } catch (error) {
// toast.error(error.message)   }

//     }
//   return (
//     <div className='m-4'> 
//         <form className='container flex-col m-3' onSubmit={addHandler}>
//           <div className='my-2 py-3'>
// <p>Job Title</p>
// <input type='text' placeholder='Type here' onChange={(e)=>{setTitle(e.target.value)}} value={title} required/>
//             </div>

//              <div className='my-2 py-3'>
//         <p>Job Description</p>
//         <div ref={editorRef}>

//         </div>
//     </div>
//     <div className='flex gap-9'>
//         {/* //1 */}
//         <div className='my-4 py-4'>
//             <p className=''>Job Category</p>
//             <select value={category} onChange={e=>setCategory(e.target.value)} className='bg-gray-300 rounded-md p-1 mt-2'>
//                 {JobCategories.map((category,idx)=>{
//                     return <option key={idx}>{category}</option>
//                 })}
//             </select>
//         </div>
// {/* 2 */}
//   <div className='my-4 py-4'>
//             <p>Job Location</p>
//             <select value={location} onChange={e=>setLocation(e.target.value)}  className='bg-gray-300 rounded-md p-1 mt-2'>
//                 {JobLocations.map((location,idx)=>{
//                     return <option key={idx}>{location}</option>
//                 })}
//             </select>
//         </div>


//    <div className='my-4 py-4'>
//             <p>Job Level</p>
//             <select value={level} onChange={e=>setLevel(e.target.value)}  className='bg-gray-300 rounded-md p-1 mt-2'>
//                 <option value=" Beginer level"> Beginer level</option>
//                  <option value="Intermediate level">Intermediate level</option>
//                  <option value="Senior level">Senior level</option>
//             </select>
//         </div>

       
//     </div>
//       <div className='my-4 py-4'>
//             <p>Salary</p>
//                  <input type='Number'   className='bg-gray-300 rounded-md p-1 mt-2'
//                value={salary}  onChange={e=>{const value=Math.max(0,e.target.value);
//                     setSalary(value);
//                  }} placeholder='0'/>
          
//         </div>
//     <button className='bg-gray-700 py-3 px-4 rounded text-white ' type='submit' >Add</button>
//         </form>
//     </div>

    
//   )
// }

// export default Addjobs


import React, { useEffect, useState, useRef, useContext } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { JobCategories, JobLocations } from '../assets/assets';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddJobs = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Bangalore');
  const [category, setCategory] = useState('Programming');
  const [level, setLevel] = useState('Beginner Level');
  const [salary, setSalary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    // Initialize Quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['link'],
            ['clean']
          ]
        },
        placeholder: 'Enter job description...'
      });
    }
  }, []);

  const validateForm = () => {
    if (!title.trim()) {
      toast.error('Job title is required');
      return false;
    }

    const description = quillRef.current.root.innerHTML;
    const textContent = quillRef.current.getText().trim();
    if (!textContent || textContent.length < 50) {
      toast.error('Job description must be at least 50 characters');
      return false;
    }

    if (!salary || salary <= 0) {
      toast.error('Please enter a valid salary');
      return false;
    }

    return true;
  };

  const addHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const description = quillRef.current.root.innerHTML;

      const { data } = await axios.post(
        `${backendUrl}/api/company/post-job`,
        {
          title: title.trim(),
          location,
          category,
          level,
          salary: Number(salary),
          description
        },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success('Job posted successfully!');
        
        // Reset form
        setTitle('');
        setLocation('Bangalore');
        setCategory('Programming');
        setLevel('Beginner Level');
        setSalary('');
        quillRef.current.root.innerHTML = '';

        // Navigate to manage jobs after 1 second
        setTimeout(() => {
          navigate('/dashboard/managejobs');
        }, 1000);
      } else {
        toast.error(data.message || 'Failed to post job');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container mx-auto p-4 max-w-4xl'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Post a New Job</h1>
        <p className='text-gray-600'>Fill in the details to create a job posting</p>
      </div>

      <form onSubmit={addHandler} className='bg-white rounded-lg shadow p-6 space-y-6'>
        {/* Job Title */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>
            Job Title <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            placeholder='e.g. Senior Frontend Developer'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>

        {/* Job Description */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>
            Job Description <span className='text-red-500'>*</span>
          </label>
          <div className='border border-gray-300 rounded-lg overflow-hidden'>
            <div ref={editorRef} className='min-h-[250px]' />
          </div>
          <p className='text-xs text-gray-500 mt-1'>
            Minimum 50 characters. Include responsibilities, requirements, and benefits.
          </p>
        </div>

        {/* Grid Layout for Dropdowns */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Category */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Job Category <span className='text-red-500'>*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            >
              {JobCategories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Job Location <span className='text-red-500'>*</span>
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            >
              {JobLocations.map((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Experience Level <span className='text-red-500'>*</span>
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            >
              <option value='Beginner Level'>Beginner Level</option>
              <option value='Intermediate Level'>Intermediate Level</option>
              <option value='Senior Level'>Senior Level</option>
            </select>
          </div>
        </div>

        {/* Salary */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>
            Annual Salary (₹) <span className='text-red-500'>*</span>
          </label>
          <input
            type='number'
            min='0'
            step='1000'
            placeholder='e.g. 800000'
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
          <p className='text-xs text-gray-500 mt-1'>
            {salary && Number(salary) > 0 && (
              <span>
                ₹{Number(salary).toLocaleString('en-IN')} per year
                (₹{Math.round(Number(salary) / 12).toLocaleString('en-IN')} per month)
              </span>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-4 pt-4 border-t'>
          <button
            type='submit'
            disabled={isSubmitting}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </button>
          <button
            type='button'
            onClick={() => navigate('/dashboard/managejobs')}
            className='px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJobs;