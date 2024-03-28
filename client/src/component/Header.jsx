import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';

function Header() {
    const {Currentuser} = useSelector(state => state.user);
    console.log(Currentuser);
  return (
    <div className='bg-slate-200'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to='/'><h1 className='font-bold'>Ephoto</h1></Link>
            <ul className='flex gap-5'>
    <Link to='/'><li>Home</li></Link>
    <Link to='/about'><li>About</li></Link>
    <Link to='/signup'>
        {Currentuser ? (
            <li><img src={Currentuser.rest.profilePicture} alt={Currentuser.rest.username} className='w-8 h-8 rounded-full object-cover' /></li>
            
        ) : (
            <li>Sign Up</li>
        )}
    </Link>
</ul>

        </div>
    </div>
    )
}
export default Header;