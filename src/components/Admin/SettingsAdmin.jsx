import React, { useEffect } from 'react'
import '../../styles/admin/settings.scss'
import { Link, useNavigate } from 'react-router-dom';
import Urls from './Urls.jsx'
import '../../styles/settings.scss';

import { useLocation } from 'react-router-dom';
import Profile from './Profile.jsx';
import ChangePassword from './ChangePassword.jsx';
import toast from 'react-hot-toast';


const SettingsAdmin = () => {
    const location = useLocation();
    const hash = location.hash; // Get the hash value from the URL

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

    return (
        <section className='settings'>
            <Urls />

            {hash === '#adminprofile' && <Profile />}
            {hash === '#adminpassword' && <ChangePassword />}
            {hash === '' && <Profile />}
        </section>
    );
};

export default SettingsAdmin;