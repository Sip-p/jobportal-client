import React from 'react'
import { assets } from '../assets/assets'

const AppDownLoad = () => {
  return (
    <div className='flex justify-center m-4'> 
        <div className=' flex flex-col   justify-center '>
            <h1>DownLoad Mobile App For Better Experience</h1>
            <div className='flex flex-col'>
                <a href=''>
                    <img src={assets.play_store} alt=''/>
                </a>
                <a href=''>
                    <img src={assets.app_store} alt=''/>
                </a> 
            </div>
        </div>
        <div>
            <img src={assets.app_main_img} alt=''/>
        </div>
    </div>
  )
}

export default AppDownLoad