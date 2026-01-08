import React, { useEffect, useState } from 'react';
import '../../styles/admin/WithdrawAdmin.scss';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const WithdrawAdmin = () => {
    const [allData, setAllData] = useState([]);

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


    useEffect(() => {
        const getAllData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/v1/admin/withdraw', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) throw new Error("Failed to fetch withdraws");

                const result = await response.json();
                setAllData(result || []); // Ensure .data exists
            } catch (error) {
                toast.error("Internal Server Error. Contact Faheem.");
                console.error(error);
            }
        };

        getAllData();
    }, []);


    const cancalRequest = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/admin/withdraw/${id}`, {
                method: 'PUT', // Or DELETE, depending on your API
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message);

                // ✅ Remove the cancelled item from the state
                setAllData((prevData) => prevData.filter((item) => item._id !== id));
            } else {
                toast.error(result.error || 'Something went wrong');
            }
        } catch (error) {
            toast.error('Internal Server Error');
        }
    };

    const acceptRequest = async (id) => {

        try {
            const response = await fetch(`http://localhost:3000/api/v1/admin/withdraw/${id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || "Something went wrong");
            }

            // ✅ Show success toast
            toast.success(result.message || 'Request accepted successfully');

            // ✅ Remove accepted item from the state
            setAllData(prev => prev.filter(item => item._id !== id));

        } catch (error) {
            console.error("Accept Request Error:", error);
            toast.error(error.message || 'Internal Server Error');
        }
    };


    return (
        <section className='withdraw'>
            <h3>Withdraw Requests</h3>

            <div className="contant">
                {allData.length === 0 ? (
                    <p>No withdrawal requests found.</p>
                ) : (
                    allData.map((item, index) => (
                        <div key={item._id || index} className="card">
                            <p><strong>Name:</strong> {item.name}</p>
                            <p><strong>Email:</strong> {item.email}</p>
                            <p><strong>Account Number:</strong> {item.account}</p>
                            <p><strong>Amount:</strong> {item.amount} </p>
                            <p><strong>Total Amount:</strong> {item.totalAmount} </p>
                            <p><strong>PKR Amount:</strong> {item.PkrAmount} PKR</p>
                            <p><strong>USD Amount:</strong> {item.UsdAmount} USD</p>
                            <p><strong>Payment Via:</strong> {item.gateway}</p>
                            {item.accountHolderName && (
                                <p><strong>Account Holder Name:</strong> {item.accountHolderName}</p>
                            )}
                            {item.bankName && (
                                <p><strong>Bank Name:</strong> {item.bankName}</p>
                            )}

                            <div className="btns">
                                <button className='cancel-btn' onClick={() => cancalRequest(item._id)}>Cancel</button>
                                <button className='accept-btn' onClick={() => acceptRequest(item._id)}>Accept</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default WithdrawAdmin;
