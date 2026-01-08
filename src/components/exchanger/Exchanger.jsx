import React, { useState, useEffect } from 'react';
import InputBox from '../layout/InputBox';
import '../../styles/exchange.scss';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Exchanger = () => {
    const [fromCurrency, setFromCurrency] = useState('');
    const [toCurrency, setToCurrency] = useState('');

    const [haveCurrency, setHaveCurrency] = useState('PKR');
    const [wantCurrency, setWantCurrency] = useState('USD');

    const [haveAmount, setHaveAmount] = useState('');
    const [wantAmount, setWantAmount] = useState('');

    const [exchangeRates, setExchangeRates] = useState({});
    const [amount, setAmount] = useState('');

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

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await fetch('https://www.floatrates.com/daily/usd.json');
                const data = await response.json();

                const usdToPkr = data['pkr']?.rate;

                if (usdToPkr) {
                    setExchangeRates({
                        USD_TO_PKR: parseFloat(usdToPkr.toFixed(3)),
                        PKR_TO_USD: parseFloat((1 / usdToPkr).toFixed(3))
                    });
                } else {
                    console.error('PKR rate not found');
                }
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
            }
        };

        fetchExchangeRates();
    }, []);

    const handleFromChange = (e) => {
        const value = e.target.value;
        setFromCurrency(value);
        setToCurrency(value === 'USD' ? 'PKR' : value === 'PKR' ? 'USD' : '');
    };

    const handleHaveChange = (e) => {
        const value = e.target.value;
        setHaveCurrency(value);
        setWantCurrency(value === 'USD' ? 'PKR' : value === 'PKR' ? 'USD' : '');
        setHaveAmount('');
        setWantAmount('');
    };

    const handleHaveAmountChange = (e) => {
        const value = e.target.value;
        setHaveAmount(value);

        if (exchangeRates.USD_TO_PKR && exchangeRates.PKR_TO_USD) {
            if (haveCurrency === 'USD') {
                setWantAmount((value * exchangeRates.USD_TO_PKR).toFixed(3));
            } else if (haveCurrency === 'PKR') {
                setWantAmount((value * exchangeRates.PKR_TO_USD).toFixed(3));
            }
        }
    };

    const handelExchange = async (e) => {
        e.preventDefault();

        if (!fromCurrency || !toCurrency || !amount) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/v1/exchange', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fromCurrency, toCurrency, amount }),
                credentials: 'include',
            });

            const result = await response.json();

            if (result.success === false) {
                toast.error(result.error || result.message || 'Something went wrong');

            } else {
                toast.success(result.message);
                navigate('/')
            }
        } catch (error) {
            toast.error("Exchange request failed");
            console.error("Exchange Error:", error);
        }
    };

    return (
        <section className='Exchaner'>
            <motion.form
                className="left"
                action={'#'}
                onSubmit={handelExchange}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="information">
                    <h3>Currency Converter</h3>
                    <p>Quickly exchange multiple currencies in real time.</p>
                </div>

                <div className="currancys">
                    <motion.div className="first" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <label>From</label>
                        <select value={fromCurrency} onChange={handleFromChange}>
                            <option value="">Select Currency</option>
                            <option value="PKR">PKR</option>
                            <option value="USD">USD</option>
                        </select>
                    </motion.div>

                    <motion.div className="sencond" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <label>To</label>
                        <select value={toCurrency} readOnly>
                            <option value="">Select Currency</option>
                            <option value="PKR">PKR</option>
                            <option value="USD">USD</option>
                        </select>
                    </motion.div>
                </div>

                <InputBox
                    type='number'
                    placeholder='0.00'
                    label='Amount'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <br /><br />
                <motion.button
                    type='submit'
                    className='btn'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Convert
                </motion.button>
                <p>*A percentage fee applies to the received amount</p>
            </motion.form>

            <motion.div
                className="right"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="uper">
                    <motion.div className="uper-left" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <p>I Have</p>
                        <select value={haveCurrency} onChange={handleHaveChange}>
                            <option value="PKR">PKR</option>
                            <option value="USD">USD</option>
                        </select>
                    </motion.div>

                    <motion.div className="uper-right" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <input
                            type="number"
                            placeholder="0.0"
                            value={haveAmount}
                            onChange={handleHaveAmountChange}
                        />
                    </motion.div>
                </div>

                <div className="lower">
                    <motion.div className="lower-left" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <p>I Want</p>
                        <select value={wantCurrency} readOnly>
                            <option value="PKR">PKR</option>
                            <option value="USD">USD</option>
                        </select>
                    </motion.div>

                    <motion.div className="lower-right" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <input
                            type="number"
                            placeholder="0.0"
                            value={wantAmount}
                            readOnly
                        />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default Exchanger;
