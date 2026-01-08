import React, { useEffect, useState } from 'react';
import Card from '../layout/Card';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { BsCurrencyDollar } from 'react-icons/bs';
import { GrGateway } from 'react-icons/gr';
import { CgShoppingCart } from 'react-icons/cg';
import '../../styles/withdraw.scss';
import InputBox from '../layout/InputBox';
import FeeStructure from '../layout/FeeStructure';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const icons = [
    { icon: <BiMoneyWithdraw />, title: 'Amount', desc: "Specify the amount you'd like to deposit." },
    { icon: <BsCurrencyDollar />, title: 'Currency', desc: 'We accept JazzCash, Easypaisa, Bank, AddCash in PKR & others in USD.' },
    { icon: <GrGateway />, title: 'Gateway', desc: 'Choose a payment gateway for withdrawal.' },
    { icon: <CgShoppingCart />, title: 'Withdraw', desc: "Click 'Withdraw' to complete your transaction." },
];

const Withdraw = () => {
    const navigate = useNavigate();
    const [gateway, setGateway] = useState('');
    const [totalAmount, setTotalAmount] = useState('0');
    const [data, setData] = useState({});
    const [amount, setAmount] = useState('')
    const [account, setAccount] = useState('')
    const [accountHolderName, setAccountHolderName] = useState('')
    const [bankName, setBankName] = useState()


    const handleGatewayChange = (e) => {
        setGateway(e.target.value);
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/v1/dashbord', {
                    method: 'POST',
                    credentials: 'include',
                });

                const data = await res.json();

                if (!res.ok) {
                    toast.error(data.message || 'Unauthorized');
                    navigate('/login');
                    return;
                }

                setData(data);
            } catch (err) {
                console.error(err);
                toast.error('Something went wrong!');
                navigate('/login');
            }
        };

        fetchDashboardData();
    }, [navigate, totalAmount]);

    const calculateWithdrawalFee = (amount) => {
        const debited = 1 + (amount * 2) / 100;
        const total = amount - debited;
        if (amount === 0) return amount;
        return total;
    };



    useEffect(() => {
        const parsed = parseFloat(totalAmount);
        if (!isNaN(parsed)) {
            setAmount(calculateWithdrawalFee(parsed));
        } else {
            setAmount('');
        }
    }, [totalAmount]);


    const showFields = ['payeer', 'JazzCash', 'easypasa', 'AddCash', 'perfactmoney', 'trx', 'Bank', 'dogecoin'].includes(gateway);



    const isPKRGateway = ['JazzCash', 'easypasa', 'Bank', 'AddCash'].includes(gateway);



    const handelWithdraw = async (e) => {
        e.preventDefault()


        const response = await fetch('http://localhost:3000/api/v1/withdraw', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount, account, gateway, totalAmount, bankName, accountHolderName })
        })

        const result = await response.json()

        if (result.success) {
            toast.success(result.message)
            navigate('/')
        }
        else {
            toast.error(result.error)
        }
    }

    return (
        <section className="withdraw">
            <motion.div
                className="left"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 80 }}
            >
                <form onSubmit={handelWithdraw} >
                    <h1>Withdraw Money</h1>
                    <p>Easily withdraw your funds through your chosen gateway.</p>

                    <div className="withdrawInfo">
                        <div className="gatways">
                            <label htmlFor="withdrawMethod" className="lable">Withdraw</label>
                            <select name="withdrawMethod" id="withdrawMethod" required onChange={handleGatewayChange} >
                                <option value="" disabled selected>Select Withdraw Gateway</option>
                                <option value="payeer">Payeer</option>
                                <option value="JazzCash">JazzCash</option>
                                <option value="easypasa">Easypasa</option>
                                <option value="perfactmoney">Perfect Money</option>
                                <option value="trx">TRX (Tron Links)</option>
                                <option value="Bank">Bank</option>
                                <option value="AddCash">AddCash</option>
                                <option value="dogecoin">DogeCoin</option>
                            </select>
                        </div>

                        <div className="wallat">
                            <label className="lable">Wallet</label>
                            <input
                                value={
                                    isPKRGateway
                                        ? `${data?.PkrAmount || 0} PKR`
                                        : `${data?.UsdAmount || 0} USD`
                                }
                                readOnly
                            />
                        </div>
                    </div>

                    <label className='lable' style={{'color':'white'}}>Amount</label>
                    <input
                        name="amount"
                        type="number"
                        placeholder="0.00"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                    />

                    {showFields && (

                        <>

                            <InputBox
                                type="number"
                                placeholder={`${amount || '0.00'} PKR`}
                                name="fee"
                                id={true}
                                label="Will be debited"
                                value={amount}
                                readOnly
                            />
                            <FeeStructure />

                            {gateway === 'payeer' && (
                                <InputBox name="payeer" type="text" placeholder="0392392" id={false} label="Payeer Account Number" value={account} onChange={(e) => setAccount(e.target.value)} />
                            )}
                            {gateway === 'perfactmoney' && (
                                <InputBox name="perfactmoney" type="text" placeholder="0392392" id={false} label="Perfact Money Account Number" value={account} onChange={(e) => setAccount(e.target.value)} />
                            )}

                            {gateway === 'easypasa' && (
                                <>
                                    <InputBox name="easypasa" type="number" placeholder="03312345678" id={false} label="Easypaisa Account Number" value={account} onChange={(e) => setAccount(e.target.value)} />
                                    <InputBox name="easypasa-holder" type="text" placeholder="Shahab" id={false} label="Account Holder Name" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} />
                                </>
                            )}
                            {gateway === 'JazzCash' && (
                                <>
                                    <InputBox name="jazzcash" type="number" placeholder="03312345678" id={false} label="JazzCash Account Number" value={account} onChange={(e) => setAccount(e.target.value)} />
                                    <InputBox name="jazzcash-holder" type="text" placeholder="Shahab" id={false} label="Account Holder Name" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} />
                                </>
                            )}
                            {gateway === 'AddCash' && (
                                <InputBox name="addcash" type="text" placeholder="0392392" id={false} label="AddCash Account Number" value={account} onChange={(e) => setAccount(e.target.value)} />
                            )}
                            {gateway === 'trx' && (
                                <InputBox name="trx" type="text" placeholder="0392392" id={false} label="TRX (Tron) Address" value={account} onChange={(e) => setAccount(e.target.value)} />
                            )}
                            {gateway === 'dogecoin' && (
                                <InputBox name="dogecoin" type="text" placeholder="0392392" id={false} label="DogeCoin Address" value={account} onChange={(e) => setAccount(e.target.value)} />
                            )}
                            {gateway === 'Bank' && (
                                <>
                                    <InputBox name="bank-name" type="text" placeholder="National Bank" id={false} label="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                                    <InputBox name="bank" type="text" placeholder="PKR30230.." id={false} label="Account Number" value={account} onChange={(e) => setAccount(e.target.value)} />
                                    <InputBox name="bank-holder" type="text" placeholder="Shahab" id={false} label="Account Holder Name" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} />
                                </>
                            )}
                        </>
                    )}

                    <motion.button
                        className="btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Withdraw
                    </motion.button>
                </form>
            </motion.div>

            <motion.div
                className="right"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 80 }}
            >
                <h3>How to Withdraw</h3>
                <Card icons={icons} />
            </motion.div>
        </section>
    );
};

export default Withdraw;
