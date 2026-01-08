import React, { useEffect, useState } from 'react';
import '../../styles/ContactForm.scss';
import { FaWhatsapp } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ContactForm = () => {
    const [message, setMessage] = useState()


    const navigate = useNavigate('')

    useEffect(() => {
        const checkUserIsLogin = async () => {
            const response = await fetch('http://localhost:3000/api/v1/checkIslogin', {
                method: 'get',
                credentials: 'include'
            })
            const result = await response.json()

            if (!result.success) {
                toast.error('Unauthorized')

                navigate('/login')
            }
        }
        checkUserIsLogin()
    }, [])



    const handelContactForm = async (e) => {
        e.preventDefault()

        const response = await fetch('http://localhost:3000/api/v1/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
            credentials: 'include',
        })
        const result = await response.json()
        toast.success(result.message)
        toast.error(result.error)

    }

    return (
        <motion.section
            className='contact'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Animate WhatsApp Box */}
            <motion.div
                className="whatsapp"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 70 }}
            >
                <a href="https://wa.me/+923154678364"><FaWhatsapp /> Whatsapp </a>
            </motion.div>

            {/* Animate Form */}
            <motion.form

                action={'#'}
                className="form"
                onSubmit={handelContactForm}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 70 }}

            >
                <div className="text">
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Contact Form
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Describe Your Issue
                    </motion.p>
                </div>

                <div className="inputs">
                    <motion.textarea
                        name="problem"
                        placeholder='Describe The Problem'
                        required
                        autoCorrect="on"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        value={message}
                        onChange={(e) => { setMessage(e.target.value) }}
                    />
                    <motion.button
                        className='btn'
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        Send Message
                    </motion.button>
                    <ToastContainer />
                </div>
            </motion.form>
        </motion.section>
    );
};

export default ContactForm;
