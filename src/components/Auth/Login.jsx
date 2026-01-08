import React, { useState } from 'react';
import '../../styles/login.scss';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.warn("Please enter both email and password");
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/login', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!result.success) {
        return toast.error(result.error || 'Invalid email or password');
      }

      toast.success("Login successful");
      localStorage.setItem('isLoggedIn', true);

      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error) {
      console.error(error);
      toast.error("Network error. Please try again later.");
    }
  };

  return (
    <motion.section
      className='login'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.form
        onSubmit={handleLogin}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80 }}
      >
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Login Form
        </motion.h3>

        <div className="inputs">
          <motion.input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          />
          <motion.input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          />
        </div>

        <Link to="/signup">Create New Account?</Link>
        <Link to="/forgot-password">Forgot Password?</Link>

        <motion.button
          className="btn"
          type="submit"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Login
        </motion.button>
      </motion.form>
    </motion.section>
  );
};

export default Login;
