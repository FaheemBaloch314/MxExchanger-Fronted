import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/urls.scss'
import toast from 'react-hot-toast'

const Urls = () => {

    const navigate = useNavigate('')

    useEffect(() => {
        const checkUserIsLogin = async () => {
            const response = await fetch('http://localhost:3000/api/v1/isAdmin', {
                method: 'get',
                credentials: 'include'
            })
            const result = await response.json()

            if (!result.success) {
                toast.error(result.error)
                navigate('/')
            }
        }
        checkUserIsLogin()
    }, [])

    return <div className='links'>
        <Link className='btn' to={'/admin/settings/#adminprofile'}>Profile</Link>
        <Link className='btn' to={'/admin/settings/#adminpassword'}>Change Password</Link>
    </div>
}

export default Urls