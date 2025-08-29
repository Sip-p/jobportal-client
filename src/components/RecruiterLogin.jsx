import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const RecruiterLogin = () => {
  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState()
  const [loading,setLoading]=useState(false)
  const [isTextDataSubmited, setIsTextDataSubmited] = useState(false)
  const { showRecruiterLogin, setShowRecruiterLogin, backendUrl, companyData, setCompanyData, companyToken, setCompanyToken } = useContext(AppContext)
  const navigate = useNavigate()
  React.useEffect(() => {
    if (showRecruiterLogin) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [showRecruiterLogin]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (state === "Sign Up" && !isTextDataSubmited) {
    setIsTextDataSubmited(true);
    return;  // ✅ prevent running API logic
  }

    
    try {
      if (state === 'Login') {
        const { data } = await axios.post(backendUrl + '/api/company/login', { email, password })
        if (data.success) {
          console.log(data)
          setCompanyData(data.company)
          setCompanyToken(data.token)
          setShowRecruiterLogin(false)
          navigate('/dashboard')
          localStorage.setItem('companyToken', data.token)
        }
        else {
          toast.error(data.message)
        }
      }
      else {
const formData=new FormData()
formData.append('name',name)
formData.append('password',password)
formData.append('email',email)
formData.append('image',image);
// console.time("register")
const {data}=await axios.post(backendUrl+'/api/company/register',formData,{ headers: { 'Content-Type': 'multipart/form-data' }})
// console.timeEnd("register")
setLoading(true);
console.log(data)
   if (data.success) {
          console.log("your "+data)
          setCompanyData(data.company)
          setCompanyToken(data.token)
          setShowRecruiterLogin(false)
          navigate('/dashboard')
          localStorage.setItem('companyToken', data.token)
        }
        else{
          console.log('error1')
           toast.error(data.message)
        }
      }
    } catch (error) {
        console.log('error2')
toast.error(error.message)
    }
    finally{
      setLoading(false)
    }
  }
  
  return (
    <div className='absolute top-0 bottom-0 left-0 right-0 z-10 backdrop-blur-sm flex justify-center items-center  h-screen'>
      <form onSubmit={(e) => submitHandler(e)} className='bg-white p-5 m-5 border-3 rounded-lg  relative '>

        <h1 className='text-center text-2xl text-neutral-600 font-medium'>Recruiter  {state}</h1>
        <div className='flex-col '>
          {state === "Sign Up" && isTextDataSubmited ? <>
            <div className='flex-col justify-center  mx-5 my-5'>
              <label htmlFor='image'>
                {image ? <img src={URL.createObjectURL(image)} className='w-16 h-16 object-cover rounded-full' alt='' /> : <img src={assets.upload_area} className='w-16 rounded-full ' alt='' />}
                <input type='file' id='image'   accept='image/*' onChange={e => setImage(e.target.files[0])} required={state==="Sign Up" && isTextDataSubmited}/>
              </label>
              <p>Upload Company <br />Logo</p>
            </div>
          </> : <>
            {state !== 'Login' && <> <p className='flex justify-center m-4'>Welcome Please SignUp to Continue</p><div className='flex gap-3 p-2 m-3 border rounded-lg'>
              <img src={assets.person_icon} alt='' />
              <input type='text' placeholder='company name' required onChange={(e) => setName(e.target.value)} value={name} className='outline-none' />
            </div><div className='flex gap-3 p-2 m-3 border rounded-lg'>
                <img src={assets.email_icon} alt='' />
                <input type='email' placeholder='emailId' required onChange={(e) => setEmail(e.target.value)} value={email} className='outline-none' />
              </div><div className='flex gap-3 p-2 m-3 border rounded-lg'>
                <img src={assets.lock_icon} alt='' />
                <input type='password' placeholder='Password' required onChange={(e) => setPassword(e.target.value)} value={password} className='outline-none' />
              </div>  </>}</>}



          {state === 'Login' && <> <div className='flex gap-3 p-2 m-3 border rounded-lg'>
            <img src={assets.email_icon} alt='' />
            <input type='email' placeholder='emailId' required onChange={(e) => setEmail(e.target.value)} value={email} className='outline-none' />
          </div><div className='flex gap-3 p-2 m-3 border rounded-lg'>
              <img src={assets.lock_icon} alt='' />
              <input type='password' placeholder='Password' required onChange={(e) => setPassword(e.target.value)} value={password} className='outline-none' />
            </div> <a>
              <p className='text-blue-500 m-4 cursor-pointer'>Forgot Password?</p>
            </a></>}
          {/* <div className='flex gap-3 p-2 m-3 border rounded-lg'>
    <img src={assets.email_icon} alt=''/>
    <input type='email' placeholder='emailId' required onChange={(e)=>setEmail(e.target.value)} value={email} className='outline-none'/>
</div>
<div className='flex gap-3 p-2 m-3 border rounded-lg'>
    <img src={assets.lock_icon} alt=''/>
    <input type='password' placeholder='Password' required onChange={(e)=>setPassword(e.target.value)} value={password} className='outline-none'/>
</div>
 <a> 
<p className='text-blue-500 m-4 cursor-pointer'>Forgot Password?</p>
</a>  */}

        </div>

       <div className='flex justify-center'>
  {state === "Sign Up" && !isTextDataSubmited ? (
    <button
      type="button"   // <- Not submit, only action
      onClick={() => setIsTextDataSubmited(true) }
      className='flex bg-blue-400 rounded-lg p-3 text-white'
    >
      Next
    </button>
  ) : (<> 
    <button
      type="submit"   // <- Actual submit
      className='flex bg-blue-400 rounded-lg p-3 text-white'
    >
      {state === 'Login' ? 'Login' : 'Create Account'}
    </button>
    {loading ?<p>Wait</p>:''}
  </>)}
</div>

        {
          state === 'Login' ? <p>Don't Have an Account?<span className='text-blue-600 cursor-pointer' onClick={() => { setState('Sign Up') }}  > Sign Up</span></p> : <p>Already Have An Account ?<span onClick={() => { setState('Login') }} className='cursor-pointer text-blue-600'> LogIn</span></p>
        }
        {
          <img src={assets.cross_icon} className='absolute top-0    right-0 h-6 m-3 p-1' onClick={() => { setShowRecruiterLogin(false) }} />
        }
      </form>
    </div>
  )
}

export default RecruiterLogin