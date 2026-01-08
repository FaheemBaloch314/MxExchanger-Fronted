import React, { useEffect, useState } from 'react';
import { Country } from 'country-state-city';
import '../../styles/profile.scss';
import { toast } from 'react-toastify';

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [account, setAccount] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const countryOptions = Country.getAllCountries().map((country) => ({
        label: country.name,
        value: country.iso2,
    }));

    // ✅ Fetch default profile data from backend on mount
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
    }, []); // ← Only run once on component mount

    // ✅ Submit updated data to backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !country) {
            toast.error('Please fill in all fields.');
            return;
        }

        setIsSaving(true);

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
                toast.success(result.message);
            } else {
                toast.error(result.error);

            }
        } catch (error) {
            toast.error('Request failed');
        } finally {
            setIsSaving(false);
        }
    };

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
                    placeholder="Enter your name"
                />

                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="example@example.com"
                />

                <label>Country</label>
                <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                >
                    <option value="">Select Country</option>
                    {countryOptions.map((option) => (
                        <option key={option.value} value={option.label}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <label>Account</label>
                <input
                    type="number"
                    value={account}
                    readOnly
                    disabled
                />

                <button className="btn" type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>

        </section>
    );
};

export default Profile;
