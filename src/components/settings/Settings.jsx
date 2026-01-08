import React, { useEffect } from 'react';
import '../../styles/settings.scss';
import Profle from './Profle';
import Urls from './Urls';
import ChangePassword from './ChangePassword';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logout from './Logout';

const Settings = () => {
    const location = useLocation();
    const hash = location.hash;

    const renderComponent = () => {
        if (hash === '#changepassword') return <ChangePassword />;
        if(hash === '#logout') return <Logout/>
        return <Profle />;
    };


    const navigate = useNavigate('')

    useEffect(() => {
        const checkUserIsLogin = async () => {
            const response = await fetch('http://localhost:3000/api/v1/checkIslogin', {
                method: 'get',
                credentials: 'include'
            })
            const result = await response.json()

            if (!result.success) {
                navigate('/login')
            }
        }
        checkUserIsLogin()
    }, [])

    return (
        <section className='settings'>
            <Urls />

            <AnimatePresence mode="wait">
                <motion.div
                    key={hash}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {renderComponent()}
                </motion.div>
            </AnimatePresence>
        </section>
    );
};

export default Settings;
