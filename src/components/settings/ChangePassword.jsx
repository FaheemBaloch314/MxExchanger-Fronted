import React, { useState } from 'react'
import '../../styles/changePassword.scss'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import { toast } from 'react-toastify';

const ChangePassword = () => {
    // States to toggle visibility of each password field
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const [oldPassword, setOldPassword] = useState()
    const [confrimPassword, setConfirmPassword] = useState()
    const [newPassword, setNewPassword] = useState()


    const toggleCurrentPasswordVisibility = () => {
        setCurrentPasswordVisible(prevState => !prevState);
    };

    const toggleNewPasswordVisibility = () => {
        setNewPasswordVisible(prevState => !prevState);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(prevState => !prevState);
    };

    const hendalChangePassword = async (e) => {
        e.preventDefault()

        if (newPassword !== confrimPassword) {
            return toast.error('Confrim Password and New Password Is not Match')
        }
        try {
            const resposne = await fetch('http://localhost:3000/api/v1/profile/passwordchange', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ oldPassword, newPassword }),
            })

            const result = await resposne.json()

            if (result.success) {
                return toast.success(result.message)
            }
            else {
                return toast.error(result.error)
            }
        } catch (error) {
            toast.error('Internal Server Error')
        }


    }


    return (
        <form className="changePassword" action={'#'} onSubmit={hendalChangePassword}>
            <h1>Change Password</h1>
            <div className="first">
                {/* Current Password */}
                <label>Current Password</label>
                <div className="password-input">
                    <input
                        type={currentPasswordVisible ? "text" : "password"}
                        placeholder='Current Password'
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}

                    />
                    <BsEyeFill
                        className="eye-icon"
                        onClick={toggleCurrentPasswordVisibility}
                    />
                </div>

                {/* New Password */}
                <label>New Password</label>
                <div className="password-input">
                    <input
                        type={newPasswordVisible ? "text" : "password"}
                        placeholder='New Password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required

                    />
                    <BsEyeFill
                        className="eye-icon"
                        onClick={toggleNewPasswordVisibility}
                    />
                </div>

                {/* Confirm Password */}
                <label>Confirm Password</label>
                <div className="password-input">
                    <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        placeholder='Confirm Password'
                        value={confrimPassword}
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <BsEyeFill
                        className="eye-icon"
                        onClick={toggleConfirmPasswordVisibility}
                    />
                </div>

                {/* Save Button */}
                <button className="btn">Save Changes</button>
            </div>
        </form>
    );
}

export default ChangePassword;
