import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Loading from './components/layout/Loading';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Direct components
import ForgotPassword from './components/Auth/ForgotPassword';
import SettingsAdmin from './components/Admin/SettingsAdmin';
import Rates from './components/Admin/Rates';
import Messages from './components/Admin/Messages';
import Accounts from './components/Admin/Accounts';

// Lazy loaded components
const Login = lazy(() => import('./components/Auth/Login'));
const Registration = lazy(() => import('./components/Auth/Registration'));
const Withdraw = lazy(() => import('./components/withdraw/Withdraw'));
const Deposit = lazy(() => import('./components/Deposite/Deposit'));
const Header = lazy(() => import('./components/layout/Header'));
const Exchange = lazy(() => import('./components/exchanger/Exchanger'));
const Dashbord = lazy(() => import('./components/dashbord/Dashbord'));
const Settings = lazy(() => import('./components/settings/Settings'));
const ContactForm = lazy(() => import('./components/contact/ContactForm'));
const SendMoney = lazy(() => import('./components/sendmoney/SendMoney'));
const NotFound = lazy(() => import('./components/NotFound/NotFound'));
const AdminHeader = lazy(() => import('./components/Admin/AdminHeader'));
const Admin = lazy(() => import('./components/Admin/Admin'));
const Users = lazy(() => import('./components/Admin/Users'));
const Depositadmin = lazy(() => import('./components/Admin/Deposit-admin'));
const WithdrawAdmin = lazy(() => import('./components/Admin/WithdrawAdmin'));
const AllDeposits = lazy(() => import('./components/Admin/AllDeposits'));
const AllWithdraws = lazy(() => import('./components/Admin/AllWithdraws'));

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  return (
    <>
      {/* Show header based on route */}
      {isAdminRoute && <AdminHeader />}
      {!isAdminRoute && isLoggedIn && <Header />}

      {/* Main Routes */}
      <Routes>
        {/* Public/User Routes */}
        <Route path="/" element={<Dashbord />} />
        <Route path="/login" element={<Login />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/sendmony" element={<SendMoney />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {!isAdminRoute && <Route path="*" element={<NotFound />} />}

        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/deposits" element={<Depositadmin />} />
        <Route path="/admin/withdraws" element={<WithdrawAdmin />} />
        <Route path="/admin/settings" element={<SettingsAdmin />} />
        <Route path="/admin/rates" element={<Rates />} />
        <Route path="/admin/all/withdraws" element={<AllWithdraws />} />
        <Route path="/admin/all/deposits" element={<AllDeposits />} />
        <Route path="/admin/helps" element={<Messages />} />
        <Route path="/admin/accounts" element={<Accounts />} />
        {isAdminRoute && <Route path="*" element={<NotFound />} />}
      </Routes>

      {/* Toast Notification Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <AppContent />
      </Suspense>
    </Router>
  );
};

export default App;
