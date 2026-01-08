import React, { useEffect, useState } from 'react';
import '../../styles/admin/admin.scss';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, ArcElement, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

ChartJS.register(Tooltip, ArcElement, Legend);

const Admin = () => {

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
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        totalDeposits: 0,
        totalWithdraws: 0,
        pkrTotal: 0,
        usdTotal: 0,
    });




    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/v1/admin/', {
                    method: 'GET',
                    credentials: 'include',
                });

                const result = await response.json();

                if (result.success) {
                    setDashboardData({
                        totalUsers: result.totalUsers,
                        totalDeposits: result.totalDeposits,
                        totalWithdraws: result.totalWithdraws,
                        pkrTotal: result.pkrTotal,
                        usdTotal: result.usdTotal,
                    });
                } else {
                    console.error("Failed to fetch dashboard data");
                }
            } catch (error) {
                console.error("Error fetching admin dashboard:", error);
            }
        };

        fetchData();
    }, []);

    const displayData = [
        { value: dashboardData.totalUsers, label: "Total Users" },
        { value: dashboardData.totalDeposits, label: "Deposits" },
        { value: dashboardData.totalWithdraws, label: "Withdraws" },
        { value: dashboardData.pkrTotal, label: "PKR Reserved" },
        { value: dashboardData.usdTotal, label: "USD Reserved" },
    ];

    const chartData = {
        labels: ["Pending", "Reject", "Completed"],
        datasets: [
            {
                label: "# of Orders",
                data: [2, 3, 8], // You can later fetch this too
                backgroundColor: ["#FFC107", "#DC3545", "#28A745"],
                borderColor: ["#FFB300", "#C82333", "#218838"],
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 16,
                    },
                    color: "#333",
                },
            },
        },
    };

    return (
        <motion.section
            className="admin-panel"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {displayData.map((item, index) => (
                <motion.div
                    className="circles"
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                    <h3>{item.value}</h3>
                    <p>{item.label}</p>
                </motion.div>
            ))}

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {/* <Doughnut data={chartData} options={chartOptions} /> */}
            </motion.div>
        </motion.section>
    );
};

export default Admin;
