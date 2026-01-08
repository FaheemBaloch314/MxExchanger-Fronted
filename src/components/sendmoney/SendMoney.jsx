import React, { useEffect, useState } from 'react';
import '../../styles/SendMoney.scss';
import Card from '../layout/Card';
import { BiMoneyWithdraw, BiSend, BiWorld } from 'react-icons/bi';
import { AiOutlineMail } from 'react-icons/ai';
import { MdDescription } from 'react-icons/md';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SendMoney = () => {
    const icons = [
        { icon: <BiMoneyWithdraw />, title: "Deposit Fund", desc: "You can deposit any amount into your wallet for personal use." },
        { icon: <AiOutlineMail />, title: "Email", desc: "Provide the email address of the person you want to send money to." },
        { icon: <BiWorld />, title: "Amount", desc: "Specify the amount you want to transfer to a friend, customer, or anyone." },
        { icon: <MdDescription />, title: "Description", desc: "Write a description for the payment if you'd like. If you prefer not to, you can skip it." },
        { icon: <BiSend />, title: "Send", desc: "By clicking the send button, the amount will be transferred instantly to the receiver's account and cannot be refunded." },
    ];

    const navigate = useNavigate('')

    useEffect(() => {
        const checkUserIsLogin = async () => {
            const response = await fetch('http://localhost:3000/api/v1/checkIslogin', {
                method: 'get',
                credentials: 'include'
            })
            const result = await response.json()

            if (!result.success) {
                navigate('/login')
            }
        }
        checkUserIsLogin()
    }, [])

    const [amount, setAmount] = useState(null)
    const [account, setAccount] = useState(null)
    const [currancy, setCurrancy] = useState("PKR");
    const [desc, setDesc] = useState('')
    const handelsendmoney = async (e) => {
        e.preventDefault()
        try {
            if (!amount || !account || Number(amount) <= 0) {
                toast.error("Please enter a valid amount and account number.");
                return;
            }
            const response = await fetch('http://localhost:3000/api/v1/sendmony', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, account, currancy, desc }),
                credentials: 'include',
            })

            const result = await response.json()

            if (result.success) {
                toast.success(result.message)
                setTimeout(() => {
                    navigate('/')
                }, 1000);
            } else {
                toast.error(result.message || result.error)

            }
        } catch (error) {
            toast.error("Internal Server Error, please Login Again")

        }

    }
    return (
        <motion.section
            className='sendmoney'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Left Panel Animation */}
            <motion.form
                action={'#'}
                onSubmit={handelsendmoney}
                className="left"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 70 }}
            >
                <h3>Send Money</h3>
                <p>No cost, limitless sending to anyone, anywhere. Send money to family, friends, or colleagues.</p>
                <div className="amount">
                    <input className='input' type="number" placeholder='0.0' required value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <select value={currancy} onChange={(e) => setCurrancy(e.target.value)}>
                        <option value="PKR">PKR</option>
                        <option value="USD">USD</option>
                    </select>

                </div>
                <div className='informations'>
                    <input className='input' type="number" placeholder='Recipient Account Number ' required value={account} onChange={(e) => setAccount(e.target.value)} />
                    <textarea name="desc" placeholder='Description (optional) ' value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>
                    <button className='btn'>Send Money</button>
                </div>
            </motion.form>

            {/* Right Panel Animation */}
            <motion.div
                className="right"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 70 }}
            >
                <h3>How To Send Money</h3>
                <Card icons={icons} />
            </motion.div>
            <ToastContainer position="top-right" autoClose={3000} />
        </motion.section>
    );
};

export default SendMoney;
