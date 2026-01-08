import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/admin/header.scss';
import { BiMenu } from 'react-icons/bi';
import toast from 'react-hot-toast';

const AdminHeader = () => {


    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

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
        <section className={`adminHeader ${isOpen ? 'open' : ''}`}>
            <BiMenu className="menu-icon" onClick={toggleMenu} />

            <nav className={`nav-links ${isOpen ? 'show' : ''}`}>
                <Link className='btn' to={'/admin'}>MxExchanger</Link>
                <Link className='btn' to={'/admin/deposits'}>Deposits requests</Link>
                <Link className='btn' to={'/admin/withdraws'}>Withdraws requests</Link>
                <Link className='btn' to={'/admin/rates'}>Rates</Link>
                <Link className='btn' to={'/admin/accounts'}>Accounts</Link>
                <Link className='btn' to={'/admin/users'}>Users</Link>
                <Link className='btn' to={'/admin/all/deposits'}>All Deposits</Link>
                <Link className='btn' to={'/admin/all/withdraws'}>All Withdraws</Link>
                <Link className='btn' to={'/admin/helps'}>Messages</Link>
                <Link className='btn' to={'/admin/settings'}>Settings</Link>

            </nav>
        </section>
    );
};

export default AdminHeader;
