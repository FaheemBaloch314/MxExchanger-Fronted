import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiFillSetting, AiFillDashboard } from 'react-icons/ai'
import { FaExchangeAlt, FaPlus, FaMinus } from 'react-icons/fa'
import { BiMenu, BiSend } from 'react-icons/bi'
import { motion } from 'framer-motion'
import '../../styles/header.scss'
import '../../styles/Header-responsive.scss'
import { MdContacts } from 'react-icons/md'

const Header = () => {
    const [isExpanded, setisExpanded] = useState(false)
    const toggleMenu = () => {
        setisExpanded(!isExpanded)
    }



    return (
        <motion.header
            className={`header ${isExpanded ? `expanded` : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="left"><Link to={'/'}>MsExchanger</Link></div>
            <motion.div
                className="right"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <Link className='btn' to={'/'}> <AiFillDashboard />  Dashboard</Link>
                <Link className='btn' to={'/Deposit'}>  <FaPlus /> Deposit</Link>
                <Link className='btn' to={'/Withdraw'}>  <FaMinus />Withdraw</Link>
                <Link className='btn' to={'/sendmony'}>  <BiSend /> Send Money</Link>
                <Link className='btn' to={'/exchange'}><FaExchangeAlt /> Exchange</Link>
                <Link className='btn' to={'/contact'}><MdContacts />Contact Us</Link>
                <Link className='btn' to={'/settings'}><AiFillSetting />Settings</Link>
            </motion.div>
            <motion.div
                className="m-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className='menu-icon' onClick={toggleMenu}><BiMenu /></div>
            </motion.div>
            {isExpanded && (
                <motion.div
                    className="mobile"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <div>
                        <Link className='btn' onClick={toggleMenu} to={'/'}>MsExchanger</Link>
                        <Link className='btn' onClick={toggleMenu} to={'/'}> <AiFillDashboard />  Dashboard</Link>
                        <Link className='btn' onClick={toggleMenu} to={'/Deposit'}>   <FaPlus />  Deposit</Link>
                        <Link className='btn' onClick={toggleMenu} to={'/Withdraw'}><FaMinus /> Withdraw</Link>
                        <Link className='btn' onClick={toggleMenu} to={'/sendmony'}> <BiSend /> Send Money</Link>
                        <Link className='btn' onClick={toggleMenu} to={'/exchange'}><FaExchangeAlt /> Exchange</Link>
                        <Link className='btn' onClick={toggleMenu} to={'/contact'}><MdContacts /> Contact Us</Link>
                        <Link className='btn' onClick={toggleMenu} to={'/settings'}><AiFillSetting />Settings</Link>
                    </div>
                    <motion.div
                        className='cross-icon'
                        onClick={toggleMenu}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <FaPlus />
                    </motion.div>
                </motion.div>
            )}
        </motion.header>
    )
}

export default Header
