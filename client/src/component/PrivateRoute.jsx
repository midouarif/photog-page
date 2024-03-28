import React from 'react'
import {useSelector} from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';



const PrivateRoute = () => {
    const {Currentuser} = useSelector(state => state.user);
  return (
    <>
        {Currentuser ? (
            <Outlet />
        ) : (
            <Navigate to='/signin' />
        )}
    </>
  )
}

export default PrivateRoute