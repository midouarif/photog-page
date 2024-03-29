import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo5 from '../assets/images/logo5.jpg';

function Header() {
    const { Currentuser } = useSelector(state => state.user);
    console.log(Currentuser);

    return (
        <div className='bg-slate-200'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <div className='flex items-center'>
                    <img src={logo5} alt='logo' className='h-14 w-14 rounded-full object-cover mr-3' />
                    <Link to='/' className='font-bold text-gray-800 hover:text-gray-900 transition-colors'>Ephoto</Link>
                </div>
                <ul className='flex gap-8'>
                    <li><Link to='/' className='px-2 py-1 rounded-lg '>Home</Link></li>
                    <li><Link to='/about' className='px-2 py-1 rounded-lg '>About</Link></li>
                    <li>
                        {Currentuser ? (
                            <img src={Currentuser.user.profilePicture} alt={Currentuser.user.username} className='w-8 h-8 rounded-full object-cover' />
                        ) : (
                            <Link to='/signin' className='px-4 py-2 '>Sign In</Link>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Header;
