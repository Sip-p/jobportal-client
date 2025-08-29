import React, { useEffect, useState } from 'react'

const Loading = () => {
    const row = 20;
    const col = 20;
const [activerow,setActiverow]=useState([])
    // Create a flat array with row * col elements
    const arr = Array.from({ length: row * col });
useEffect(()=>{
let interval=setInterval(()=>{
setActiverow(prev=>(prev+1)%row);
},100)
return ()=>{clearInterval(interval)}
},[row])
    return (
        <div className='h-screen w-screen flex items-center justify-center bg-black'>
            <div className=' container grid grid-cols-16 grid-rows-16 gap-1  h-screen w-screen '>
                {
                    arr.map((_, idx) => (
                        <div key={idx} className={`activerow===(idx+1)?spin:" "bg-green-500 border-2 w-5 h-5 flex items-center justify-center text-xs`}> </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Loading