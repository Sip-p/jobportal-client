import React from 'react'
import { assets } from '../assets/assets'
import {useContext,useRef} from 'react'
import { AppContext } from '../context/AppContext'
const Hero = () => {

const {setSearchFilter,setIsSearched} = useContext(AppContext);
const titleRef=useRef(null);
const locationRef=useRef(null);

const onSearch=()=>{
setSearchFilter({
    title:titleRef.current.value,
    location:locationRef.current.value
})
setIsSearched(true);
console.log({
    title:titleRef.current.value,
    location:locationRef.current.value
})
}
  return (
    <div className='container 2xl:px-20 mx-auto my-10 max-sm:w-3/4 max-sm:ml-16   '> 
<div className="bg-gradient-to-r from-purple-800 to-purple-950 text-white py-16 text-center mx-2 rounded-xl 
                 mx-sm:w-3/4 mx-sm:ml-2   ">
            <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4'>Over 10,000+ jobs to apply</h2>
            <p className='mb-8 max-w-xl mx-auto text-sm font-light px-5'>Your Next Big Career Move Start Right Here-Explore The Best Jobs</p>
            <div className='flex max-sm:flex-col 2xl:gap-20 gap-10  m-4 justify-center  '>
                <div className='flex bg-white rounded-md text-black  px-2 max-sm:w-2/4'>
                    <img src={assets.search_icon}/>
                    <input type='text'placeholder='Search Your Jobs' className='max-sm:text-sm p-2 rounded outline-none w-full' ref={titleRef}/>
                </div>
                <div className='flex bg-white rounded-md text-black px-2 max-sm:w-2/4'>
                    <img src={assets.location_icon} className=' '/>
                    <input type='text'placeholder='Location' className='max-sm:text-sm p-2 rounded outline-none w-full' ref={locationRef}/>
                </div>
                <div className='bg-blue-600 max-sm:w-2/4  rounded-md text-white font-bold px-2 flex items-center justify-center'>
                     <button onClick={()=>{onSearch()}}>Search</button>
                </div>
            </div>
        </div>
        <div className='flex items-center justify-between my-10 border border-gray-300 shadow-lg p-4 rounded-lg mx-2 mt-5'>
            <div className='flex items-center gap-12 lg:gap-16 flex-wrap'>
                <p>Trusted by</p>

                <img className='h-5' src={assets.microsoft_logo} alt="" />
                <img className='h-5' src= {assets.adobe_logo} alt="" />
                <img className='h-5' src= {assets.accenture_logo} alt="" />
                <img className='h-5' src={assets.samsung_logo} alt="" />
                <img className='h-5' src={assets.walmart_logo} alt="" />
                <img className='h-5' src={assets.amazon_logo} alt="" />
            </div>
        </div>
    </div>
  )
}

export default Hero;