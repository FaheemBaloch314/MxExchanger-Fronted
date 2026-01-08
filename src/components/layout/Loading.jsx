import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/loading.scss';

const Loading = () => {
    return (
        <motion.section
            className='loading'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <motion.div
                className="loader"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'linear'
                }}
            />
            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                Loading...
            </motion.h1>
        </motion.section>
    );
};

export default Loading;
