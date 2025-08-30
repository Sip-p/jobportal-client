import React, { useEffect, useState } from 'react'

const Loading = () => {
    const arr = new Array(5).fill(0)
    const [currentstar, setCurrentStar] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStar(prev => (prev + 1) % arr.length)
        }, 1000)
        return () => clearInterval(interval)
    }, [arr.length])

    return (
        <div className='flex p-14 gap-4 bg-black h-screen place-items-center justify-center'>
            {arr.map((item, idx) => (
                <div
                    className={`  w-4 h-4 rounded-full border ${currentstar === idx ? 'bg-white' : 'bg-gray-700'}`}
                    key={idx}
                />
            ))}
        </div>
    )
}

export default Loading