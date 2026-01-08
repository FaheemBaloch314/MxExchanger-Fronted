import React, { useEffect, useState } from 'react';
import '../../styles/deposit.scss';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { BsCurrencyDollar } from 'react-icons/bs';
import { GrGateway } from 'react-icons/gr';
import { CgShoppingCart } from 'react-icons/cg';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Card from '../layout/Card';
import SendMoney from './SendMoney';

const Deposit = () => {
  const navigate = useNavigate();
  
  const [currencies] = useState([
    { label: 'TRX (Tron Links)', value: 'trx', type: 'USD' },
    { label: 'USDT (TRC20)', value: 'usdt', type: 'USD' },
    { label: 'Payeer', value: 'payeer', type: 'USD' },
    { label: 'Perfect Money', value: 'perfectmoney', type: 'USD' },
    { label: 'Jazzcash', value: 'jazzcash', type: 'PKR' },
    { label: 'Easypasa', value: 'easypasa', type: 'PKR' },
  ]);

  const [selectedCurrency, setSelectedCurrency] = useState('PKR');
  const [isDeposited, setIsDeposited] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/checkIslogin', {
          method: 'GET',
          credentials: 'include',
        });

        const result = await response.json();
        if (!result.success) navigate('/login');
      } catch (error) {
        toast.error('Failed to check login status');
      }
    };

    checkLogin();
  }, [navigate]);

  const handleCurrencyChange = (e) => setSelectedCurrency(e.target.value);
  const filteredMethods = currencies.filter(item => item.type === selectedCurrency);

  const handleDeposit = () => {
    if (amount.trim() && selectedPaymentMethod) {
      setIsDeposited(true);
    } else {
      toast.warn('Please enter an amount and select a payment method');
    }
  };

  const handleCancel = () => {
    setAmount('');
    setSelectedPaymentMethod('');
    setSelectedCurrency('PKR');
    setIsDeposited(false);
  };

  const instructions = [
    { icon: <BiMoneyWithdraw />, title: 'Amount', desc: "Specify the amount you'd like to deposit." },
    { icon: <BsCurrencyDollar />, title: 'Currency', desc: 'We only accept USD & PKR. Please deposit in these currencies.' },
    { icon: <GrGateway />, title: 'Gateway', desc: 'Choose a payment gateway for your convenience.' },
    { icon: <CgShoppingCart />, title: 'Deposit', desc: "Click 'Deposit' to proceed to the payment screen." },
  ];

  return (
    <motion.section
      className='Deposite'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isDeposited ? (
        <SendMoney
          currancy={selectedCurrency}
          paymentMethod={selectedPaymentMethod}
          amount={amount}
          setIsDeposited={setIsDeposited}
          onCancel={handleCancel}
        />
      ) : (
        <motion.form
          className="left"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Deposit Money
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            Add Funds Easily – Choose from a variety of methods and pick the one that suits you best!
          </motion.p>

          <div className="balance">
            <motion.input
              type="number"
              placeholder="Enter Amount"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            />
            <motion.select
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              required
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <option value="PKR">PKR</option>
              <option value="USD">USD</option>
            </motion.select>
          </div>

          <label htmlFor="paymentMethod">Deposit via</label>
          <motion.select
            id="paymentMethod"
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            required
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <option value="" disabled>Select Payment Gateway</option>
            {filteredMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </motion.select>

          <motion.button
            type="button"
            className="btn"
            onClick={handleDeposit}
            disabled={!amount.trim() || !selectedPaymentMethod}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Deposit
          </motion.button>
        </motion.form>
      )}

      <motion.div
        className="right"
        initial={{ x: 4200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3>How to Deposit</h3>
        <Card icons={instructions} />
      </motion.div>
    </motion.section>
  );
};

export default Deposit;
