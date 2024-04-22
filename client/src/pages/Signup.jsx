import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Oath from '../component/Oath';
import logo5 from '../assets/images/logo5.jpg';

const Signup = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch('/server/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      navigate('/signin');

      if (data.success === false) {
        setError(true);
        return;
      }
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <>
      <img src={logo5} alt='logo' className='h-28 w-28 mx-auto rounded-full mt-7 object-cover' />
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <input type='text' placeholder='Full Name' id='fullname' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
          <input type='text' placeholder='Username' id='username' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
          <input type='text' placeholder='Email' id='email' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
          <input type='text' placeholder='Location' id='location' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
          <input type='password' placeholder='Password' id='password' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange} />
          <button type='submit' disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? "loading" : "Sign Up"}</button>
          <Oath />
        </form>
        <div className='text-center flex gap-2 mt-5'>
          <p className=''>Already have an account?</p>
          <Link to='/signin'><span className=' font-semibold text-blue-500'>Sign In</span></Link>
        </div>
        <p className='text-center text-red-500 mt-3 font-semibold'>{error && 'An error occurred'}</p>
      </div>
    </>
  );
};

export default Signup;
