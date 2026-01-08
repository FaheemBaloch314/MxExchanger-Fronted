import React, { useState, useEffect } from 'react';
import { Country } from 'country-state-city';
import '../../styles/profile.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [account, setAccount] = useState('');

    const countryOptions = Country.getAllCountries().map((country) => ({
        label: country.name,
        value: country.name, // Using country name here instead of ISO2
    }));


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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !country) {
            toast.error('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/v1/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name, email, country }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success(result.message || "Changes are saved");
            } else {
                toast.error(result.error || "Failed to update profile");
            }
        } catch (error) {
            toast.error('Request failed');
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/v1/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                const result = await response.json();

                setName(result.name || '');
                setEmail(result.email || '');
                setCountry(result.country || '');
                setAccount(result.account || '');
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                toast.error('Failed to load profile');
            }
        };

        fetchProfile();
    }, []);

    return (
        <section className="profile">
            <h1>Profile</h1>
            <form className="first" onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>Country</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)}>
                    {countryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <label>Account</label>
                <input type="number" value={account} readOnly disabled />

                <button className="btn" type="submit">Save Changes</button>
                <ToastContainer />
            </form>
        </section>
    );
};

export default Profile;
