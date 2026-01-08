import React, { useEffect, useState } from 'react';
import US from 'country-flag-icons/react/3x2/US';
import PK from 'country-flag-icons/react/3x2/PK';
import '../../styles/dashbord.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const cardVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, delay: 0.2 } }
};

const tableContainerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.06,
            delayChildren: 0.4
        }
    }
};

const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            damping: 20,
            stiffness: 100
        }
    }
};

const Dashbord = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [activities, setActivities] = useState([]);
    const [selected, setSelected] = useState(null);



    useEffect(() => {


        const fetchDashboardData = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/v1/dashbord', {
                    method: 'POST',
                    credentials: 'include',
                });

                const data = await res.json();

                if (!res.ok) {
                    toast.error(data.message || "Unauthorized");
                    navigate('/login');
                    return;
                }

                setData(data);
                localStorage.setItem('isLoggedIn', true)
            } catch (err) {
                console.error(err);
                toast.error("Something went wrong!");
                navigate('/login');
            }
        };

        fetchDashboardData();
    }, [navigate]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/v1/activity', {
                    method: 'GET',
                    credentials: 'include',
                });

                const result = await res.json();

                if (!res.ok) {
                    toast.error("Failed to fetch activities");
                    return;
                }

                const formatted = result
                    .filter(item => item.date) // ensure valid dates
                    .sort((a, b) => new Date(b.date) - new Date(a.date)) // latest first
                    .map(item => ({
                        date: new Date(item.date).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        }),
                        activity_type: item.ActivityType,
                        amount: item.Amount,
                        status: item.status || 'pending',
                    }));

                setActivities(formatted);
            } catch (err) {
                console.error(err);
                toast.error("Error loading activity data");
            }
        };

        fetchActivities();
    }, []);

    return (
        <motion.section className='dashbord' initial="hidden" animate="visible">
            <motion.div className="uper" variants={cardVariants}>
                <div className="first">
                    <motion.div
                        className="left card"
                        whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <div>
                            <h1>PKR Balance</h1>
                            <p>&#8377; {data.PkrAmount}</p>
                        </div>
                        <PK title="Pakistan" className='flag' />
                    </motion.div>

                    <motion.div
                        className="right card"
                        whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <div>
                            <h1>US Dollar Balance</h1>
                            <p>$ {data.UsdAmount}</p>
                        </div>
                        <US title="United States" className='flag' />
                    </motion.div>
                </div>

                <motion.div className="sencond" variants={cardVariants}>
                    <h3>Account : {data.AccountMumber}</h3>
                </motion.div>
            </motion.div>

            <motion.div className="lower" variants={tableContainerVariants}>
                <h3>Recent Activity</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Activity Type</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.slice(0, 8).map((item, index) => (
                            <motion.tr key={index} variants={rowVariants}>
                                <td>{item.date}</td>
                                <td>{item.activity_type}</td>
                                <td>{item.amount}</td>
                                <td>{item.status}</td>
                                <td>
                                    <button onClick={() => setSelected(item)}>View</button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            <AnimatePresence>
                {selected && (
                    <motion.div
                        className="info-box"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h4>Activity Detail</h4>
                        <p><strong>Date:</strong> {selected.date}</p>
                        <p><strong>Type:</strong> {selected.activity_type}</p>
                        <p><strong>Amount:</strong> {selected.amount}</p>
                        <p><strong>Status:</strong> {selected.status}</p>
                        <button onClick={() => setSelected(null)}>Close</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
};

export default Dashbord;
