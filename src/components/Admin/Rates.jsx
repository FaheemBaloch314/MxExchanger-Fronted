import React, { useEffect, useState } from 'react';
import '../../styles/admin/rates.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Rates = () => {
    const [buying, setBuying] = useState("");
    const [selling, setSelling] = useState("");


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
        e.preventDefault(); // Prevent page reload

        // Local validation
        if (buying === undefined || selling === undefined || buying === '' || selling === '') {
            toast.error("Both buying and selling values are required.");
            return;
        }

        const buyingNumber = Number(buying);
        const sellingNumber = Number(selling);

        if (isNaN(buyingNumber) || isNaN(sellingNumber)) {
            toast.error("Both values must be valid numbers.");
            return;
        }

        if (buyingNumber < 0 || sellingNumber < 0) {
            toast.error("Negative values are not allowed.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/v1/rates', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ buying: buyingNumber, selling: sellingNumber }),
                credentials: 'include',
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to update rates.");
                return;
            }

            toast.success("Changes saved successfully!");
        } catch (error) {
            console.error("Error submitting rates:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };


    useEffect(() => {
        const fetchRates = async () => {
            const res = await fetch('http://localhost:3000/api/v1/rates', {
                method: 'get',
                credentials: 'include',
            });

            const result = await res.json();
            if (result.success) {
                setBuying(result.data.buying);
                setSelling(result.data.selling);
            }
        };

        fetchRates();
    }, []);

    return (
        <section className='rates'>
            <h3>Dollar Rates</h3>
            <form onSubmit={handleSubmit}>
                <div className="selling">
                    <label>Selling Rate</label>
                    <input
                        type="number"
                        placeholder='218'
                        value={selling}
                        onChange={(e) => setSelling(e.target.value)}
                    />
                </div>
                <div className="buying">
                    <label>Buying Rate</label>
                    <input
                        type="number"
                        placeholder='218'
                        value={buying}
                        onChange={(e) => setBuying(e.target.value)}
                    />
                </div>
                <button type="submit">Save</button>
            </form>

            {/* Flash Message Container */}
            <ToastContainer position="top-right" autoClose={3000} />
        </section>
    );
};

export default Rates;
