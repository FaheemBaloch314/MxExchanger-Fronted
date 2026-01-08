import React, { useEffect, useState } from 'react';
import '../../styles/admin/accounts.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Accounts = () => {
    const [formData, setFormData] = useState({
        payneer: '',
        TRX: '',
        USDT: '',
        perfactMoney: '',
        easypasa: '',
        easypasaHolderName: '',
        jazzcash: '',
        jazzcashHolderName: '',
        bank: '',
        bankHolderName: ''
    });

    // ✅ GET account data from backend
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/v1/admin/accounts', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    // ✅ set form data safely
                    setFormData({
                        payneer: data.payneer || '',
                        TRX: data.TRX || '',
                        USDT: data.USDT || '',
                        perfactMoney: data.perfactMoney || '',
                        easypasa: data.easypasa || '',
                        easypasaHolderName: data.easypasaHolderName || '',
                        jazzcash: data.jazzcash || '',
                        jazzcashHolderName: data.jazzcashHolderName || '',
                        bank: data.bank || '',
                        bankHolderName: data.bankHolderName || ''
                    });
                } else {
                    toast.error(data.message || 'Failed to fetch account data');
                }
            } catch (error) {
                toast.error('Network error while fetching account data');
            }
        };

        fetchAccounts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const accountsHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/v1/admin/opration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            console.log(data)

            if (res.ok) {
                toast.success('Account details updated successfully!');
            } else {
                toast.error(data.message || 'Failed to update account details');
            }
        } catch (err) {
            toast.error('Network error while saving account data');
        }
    };

    return (
        <div className="accounts">
            <form className="account-form" onSubmit={accountsHandler}>
                <h3>Account Details</h3>
                <div className="form-grid">
                    {[
                        { label: 'Payoneer', name: 'payneer' },
                        { label: 'TRX (Tron Links)', name: 'TRX' },
                        { label: 'USDT (TRC20)', name: 'USDT' },
                        { label: 'Perfect Money', name: 'perfactMoney' },
                        { label: 'EasyPaisa', name: 'easypasa' },
                        { label: 'Holder Name (EasyPaisa)', name: 'easypasaHolderName' },
                        { label: 'JazzCash', name: 'jazzcash' },
                        { label: 'Holder Name (JazzCash)', name: 'jazzcashHolderName' },
                        { label: 'Bank Account', name: 'bank' },
                        { label: 'Holder Name (Bank)', name: 'bankHolderName' }
                    ].map((field) => (
                        <div className="form-group" key={field.name}>
                            <label>{field.label}</label>
                            <input
                                type="text"
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default Accounts;
