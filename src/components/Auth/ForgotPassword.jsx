import React, { useState } from 'react';
import '../../styles/forgotpassword.scss';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfimPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            if (!otpSent) {
                const res = await fetch('http://localhost:3000/api/v1/forgotpassword', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const data = await res.json();
                if (data.success) {
                    setOtpSent(true);
                    toast.success('OTP sent to your email.');
                } else {
                    toast.error(data.error || 'Failed to send OTP');
                }
            } else {
                if (newPassword !== confirmPassword) {
                    toast.error('Passwords do not match.');
                    return;
                }

                const res = await fetch('http://localhost:3000/api/v1/verifyOtpForgot', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        otp,
                        newPassword
                    })
                });

                const data = await res.json();
                if (data.success) {
                    toast.success(data.message || 'Password changed successfully.');
                    setTimeout(() => {
                        navigate('/')
                    }, 1000);
                } else {
                    toast.error(data.error || 'Failed to verify OTP');
                }
            }
        } catch (err) {
            console.log(err)
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.section
            className="forgot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <motion.form
                onSubmit={handleSubmit}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 80 }}
            >
                <motion.h3>Forgot Password</motion.h3>

                <div className="inputs">
                    <motion.input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={otpSent}
                    />

                    {otpSent && (
                        <>
                            <motion.input
                                type="number"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />

                            <div className="password-input">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <span onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>

                            <div className="password-input">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Enter Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfimPassword(e.target.value)}
                                    required
                                />
                                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                <Link to="/login">Back to Login</Link>

                <motion.button className="btn" type="submit" disabled={loading}>
                    {loading ? 'Processing...' : otpSent ? 'Verify OTP' : 'Send OTP'}
                </motion.button>
            </motion.form>
        </motion.section>
    );
};

export default ForgotPassword;
