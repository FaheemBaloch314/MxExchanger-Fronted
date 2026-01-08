import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../styles/notFound.scss';

const NotFound = () => {
    return (
        <section className='notFound'>
            <motion.h1 initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }}>404</motion.h1>
            <motion.h4 initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }}>Page Not Found</motion.h4>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 30, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <Link to={'/'}>Back To Dashboard</Link>
            </motion.div>
        </section>
    );
};

export default NotFound;
