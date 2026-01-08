import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/urls.scss'
const Urls = () => {
    return <div className='links'>
        <Link className='btn' to={'/settings/#profile'}>Profile</Link>
        <Link className='btn' to={'/settings/#changepassword'}>Change Password</Link>
        <Link className='btn ' to={'/settings/#logout'} >Logout</Link>
    </div>
}

export default Urls