import React, { useState, useEffect } from 'react';
import '../../styles/sendMoney-deposit.scss';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SendMoney = ({ currancy, paymentMethod, amount, setIsDeposited, onCancel }) => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState({});
    const [transitionId, setTransitionId] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('http://localhost:3000/api/v1/admin/accounts', {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await res.json();
                if (res.ok) {
                    setAccounts(Array.isArray(data) ? data[0] : data);
                } else {
                    toast.error(data.message || 'Failed to load account data');
                }
            } catch (error) {
                toast.error('Network error while loading accounts');
            }
        })();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:3000/api/v1/deposit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ currancy, paymentMethod, amount, transitionId }),
            });

            const result = await res.json();
            if (res.ok) {
                toast.success(result.message || 'Deposit successful!');
                setIsDeposited(false);
                navigate('/');
            } else {
                toast.error(result.message || 'Deposit failed');
            }
        } catch {
            toast.error('Internal Server Error');
        }
    };

    const getAccountNumber = () => {
        const map = {
            easypasa: accounts.easypasa,
            jazzcash: accounts.jazzcash,
            payeer: accounts.payneer,
            trx: accounts.TRX,
            perfectmoney: accounts.perfactMoney,
            usdt: accounts.USDT,
            bank: accounts.bank,
        };
        return map[paymentMethod] || 'N/A';
    };

    const getHolderName = () => {
        const map = {
            easypasa: accounts.easypasaHolderName,
            jazzcash: accounts.jazzcashHolderName,
            bank: accounts.bankHolderName,
        };
        return map[paymentMethod] || null;
    };

    return (
        <form className="left-transtion" onSubmit={handleSubmit}>
            <h2>Deposit Money</h2>
            <p>Add Funds: Choose a payment method that suits you best.</p>

            <div className="text">
                <p className="transtions">
                    Please send {currancy} to the below account and submit your transaction ID.
                </p>

                <div className="accountNumber info">
                    <h4>{paymentMethod.toUpperCase()}</h4>
                    <h3>{getAccountNumber()}</h3>
                </div>

                {getHolderName() && (
                    <div className="refrance info">
                        <h4>Account Holder Name</h4>
                        <h4>{getHolderName()}</h4>
                    </div>
                )}

                {currancy === 'PKR' && paymentMethod === 'bank' && (
                    <div className="refrance info">
                        <h4>Bank Name</h4>
                        <h4>{accounts.bank || 'N/A'}</h4>
                    </div>
                )}

                <div className="amount info">
                    <h4>Amount</h4>
                    <h4>{amount} {currancy}</h4>
                </div>

                <div className="refrance info">
                    <h4>Reference Number</h4>
                    <h4>USDF8D5D7EB83</h4>
                </div>

                <div className="transtionId">
                    <label>Enter Transaction ID</label>
                    <input
                        type="text"
                        placeholder="Transaction ID"
                        required
                        value={transitionId}
                        onChange={(e) => setTransitionId(e.target.value)}
                    />
                </div>

                <div className="buttons">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </form>
    );
};

export default SendMoney;
