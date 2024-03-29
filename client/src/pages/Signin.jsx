import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { signInStart,signInSuccess,signInFailure } from '../redux/user/userSlice';
import Oath from '../component/Oath';
import logo1 from '../assets/images/logo1.jpg'
import logo2 from '../assets/images/logo2.jpg'
import logo3 from '../assets/images/logo3.jpg'
import logo4 from '../assets/images/logo4.jpg'
import logo5 from '../assets/images/logo5.jpg'




const Signin = () => {
  const [formData, setFormData] = useState({});
  // const [error, setError] = useState(false);
  // const [loading, setLoading] = useState(false);
  const {loading,error} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/server/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) {
        // Handle non-successful responses (e.g., HTTP status code is not in the 2xx range)
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      // If the response is successful, proceed with navigation or other actions
      navigate('/');
    } catch (error) {
      // Handle other types of errors (e.g., network issues, server downtime)
      dispatch(signInFailure(error));
    }
  };
  

  return (
    <>
    <img src={logo5} alt='logo' className='h-28 w-28 mx-auto rounded-full mt-7 object-cover' />
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='text' placeholder='Email' id='email' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
        <input type='password' placeholder='Password' id='password' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
        <button type='submit' disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ?"loading":"Sign In"}</button>
        <Oath/>
      </form>
      <div className='text-center flex gap-2 mt-5'>
        <p className=''>Dont have an account?</p>
        <Link to='/signup'><span className=' font-semibold text-blue-500'>Sign Up</span></Link>
      </div>
      <p className='text-center text-red-500 mt-3 font-semibold'>{error ? error.message || 'An error occurred': ""}</p>
    </div>
    </>
  );
};

export default Signin;
