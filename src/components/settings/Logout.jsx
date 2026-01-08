import React from 'react'
import '../../styles/logout.scss'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Logout = () => {

    const navigate = useNavigate('')
    const logoutme = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/logout', {
                method: 'GET',
                credentials: 'include',
            });

            const result = await response.json();
            if (result.success) {
                toast.success(result.message);
                navigate('/login')
                localStorage.removeItem('isLoggedIn')
            } else {
                toast.error(result.error);

            }
        } catch (error) {
            toast.error('Request failed');
        }
    }
    return (
        <div className='logout'>
            <button onClick={logoutme}>Logout me</button>
        </div>
    )
}

export default Logout