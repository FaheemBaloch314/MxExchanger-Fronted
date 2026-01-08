import React, { useEffect, useState } from 'react';
import '../../styles/admin/deposit.scss';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Depositadmin = () => {
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
                const response = await fetch('http://localhost:3000/api/v1/admin/deposits', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const result = await response.json();
                setAllData(result); // ✅ Save fetched data in state
            } catch (error) {
                toast.error("Internal Server Error. Contact Faheem.");
            }
        };

        getAllData();
    }, []);


    const acceptRequest = async (id, AccountMumber, amount, currancy) => {
        
        try {
            const response = await fetch(`http://localhost:3000/api/v1/admin/deposits/${id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
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


    const cancalRequest = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/admin/deposits/${id}`, {
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


    return (
        <section className='deposit'>
            <h3>Deposits Requests</h3>
            <div className="contant">
                {allData.length > 0 ? (
                    allData.map((item, index) => (
                        <div className="card" key={item._id || index}>
                            <p><strong>Name:</strong> {item.name}</p>
                            <p><strong>Email:</strong> {item.email}</p>
                            <p><strong>Transaction ID:</strong> {item.transitionId}</p>
                            <p><strong>Amount:</strong> {item.amount}</p>
                            <p><strong>Payment Via:</strong> {item.paymentMethod}</p>
                            <div className="btns">
                                <button onClick={() => cancalRequest(item._id)}>Cancel</button>
                                <button onClick={() => acceptRequest(item._id, item.AccountMumber, item.amount, item.currancy)}>Accept</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No deposit requests found.</p>
                )}
            </div>
        </section>
    );
};

export default Depositadmin;
