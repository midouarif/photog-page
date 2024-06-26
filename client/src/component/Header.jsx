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
                    <p className='font-bold text-gray-800 hover:text-gray-900 transition-colors'>Ephoto</p>
                </div>
                <div className="flex items-center gap-8">
                    <ul className='flex gap-8'>
                        <li><Link to='/'>
                        {Currentuser ? (
                            <span>Home</span>
                        ) : (
                            <span></span>
                        )}
                        </Link></li>
                        <li><Link to='/about' className='px-2 py-1 rounded-lg'>About</Link></li>
                    </ul>
                    <div>
                        <Link to='/profile'>
                        {Currentuser ? (
                            <img src={Currentuser.profilePicture} alt={Currentuser.username} className='w-10 h-10 rounded-full object-cover' />
                        ) : (
                            <span>Sign In</span>
                        )}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
