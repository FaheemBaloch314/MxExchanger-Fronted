import React, { useEffect, useState } from 'react';
import '../../styles/changePassword.scss';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {



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


    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const toggleCurrentPasswordVisibility = () => {
        setCurrentPasswordVisible(prev => !prev);
    };

    const toggleNewPasswordVisibility = () => {
        setNewPasswordVisible(prev => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(prev => !prev);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return toast.error('Confirm Password and New Password do not match');
        }

        try {
            const response = await fetch('http://localhost:3000/api/v1/profile/passwordchange', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(result.error || 'Failed to change password');
            }
        } catch (error) {
            console.error(error);
            toast.error('Internal Server Error');
        }
    };

    return (
        <section className="changePassword">
            <h1>Change Password</h1>
            <form className="first" onSubmit={handleChangePassword}>
                {/* Current Password */}
                <label>Current Password</label>
                <div className="password-input">
                    <input
                        type={currentPasswordVisible ? "text" : "password"}
                        placeholder="Current Password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    {currentPasswordVisible ? (
                        <BsEyeSlashFill className="eye-icon" onClick={toggleCurrentPasswordVisibility} />
                    ) : (
                        <BsEyeFill className="eye-icon" onClick={toggleCurrentPasswordVisibility} />
                    )}
                </div>

                {/* New Password */}
                <label>New Password</label>
                <div className="password-input">
                    <input
                        type={newPasswordVisible ? "text" : "password"}
                        placeholder="New Password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {newPasswordVisible ? (
                        <BsEyeSlashFill className="eye-icon" onClick={toggleNewPasswordVisibility} />
                    ) : (
                        <BsEyeFill className="eye-icon" onClick={toggleNewPasswordVisibility} />
                    )}
                </div>

                {/* Confirm Password */}
                <label>Confirm Password</label>
                <div className="password-input">
                    <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        placeholder="Confirm Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {confirmPasswordVisible ? (
                        <BsEyeSlashFill className="eye-icon" onClick={toggleConfirmPasswordVisibility} />
                    ) : (
                        <BsEyeFill className="eye-icon" onClick={toggleConfirmPasswordVisibility} />
                    )}
                </div>

                {/* Save Button */}
                <button className="btn" type="submit">Save Changes</button>
            </form>
        </section>
    );
};

export default ChangePassword;
