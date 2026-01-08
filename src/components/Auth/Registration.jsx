import React, { useEffect, useState } from 'react';
import { Country } from 'country-state-city';
import '../../styles/registration.scss';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Registration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (password !== confirmpassword) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/v1/signup", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, country, password }),
      });
      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Failed to send OTP");
      } else {
        setStep(2);
        toast.success("Account Registered. Please check your email for OTP.");
      }
    } catch (err) {
      toast.error("Network error while sending OTP");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/v1/verifyOtp", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, enteredOtp: otp }),
        credentials: 'include',
      });
      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Invalid OTP");
      } else {
        toast.success("Account verified and created!");
        localStorage.setItem('isLoggedIn', true)
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      toast.error("Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section className='signup'>
      <motion.form onSubmit={step === 1 ? handleSendOtp : handleVerifyAndRegister}>
        <h3>{step === 1 ? "Signup Form" : "Verify OTP"}</h3>
        <div className="inputs">
          {step === 1 ? (
            <>
              <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                required
              >
                <option value="">Select Country</option>
                {countries.map(c => (
                  <option key={c.isoCode} value={c.name}>{c.name}</option>
                ))}
              </select>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmpassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </>
          ) : (
            <>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                disabled
              />
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
            </>
          )}
        </div>

        {step === 1 && (
          <Link to="/login">Already have an account?</Link>
        )}

        <button type="submit" className='btn' disabled={loading}>
          {loading
            ? "Please wait..."
            : step === 1
              ? "Register Account"
              : "Verify & Register"}
        </button>
      </motion.form>
      <ToastContainer />
    </motion.section>
  );
};

export default Registration;
