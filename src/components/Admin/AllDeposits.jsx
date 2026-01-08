import React, { useEffect, useState } from 'react';
import '../../styles/admin/AllWithdraws.scss';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AllDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkUserIsLogin = async () => {
      const response = await fetch('http://localhost:3000/api/v1/isAdmin', {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();

      if (!result.success) {
        toast.error(result.error);
        navigate('/');
      }
    };

    checkUserIsLogin();
  }, [navigate]);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/admin/all/deposits', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch deposits');

        const result = await response.json();
        setDeposits(result || []);
      } catch (error) {
        console.error(error);
        toast.error('Internal Server Error. Contact Faheem.');
      }
    };

    fetchDeposits();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/admin/all/deposits/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setDeposits((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  return (
    <section className="AllWithdraws">
      <h3>All Deposits</h3>

      <div className="contant">
        {deposits.length === 0 ? (
          <p>No deposits found.</p>
        ) : (
          deposits.map((item) => (
            <div className="card" key={item._id}>
              <div className="card-header">
                <FaTrash className="delete-icon" onClick={() => confirmDelete(item._id)} />
              </div>

              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Email:</strong> {item.email}</p>
              <p><strong>Amount:</strong> {item.amount} {item.currancy}</p>
              <p><strong>Status:</strong> {item.status}</p>
              <p><strong>Activity Type:</strong> {item.activitytype}</p>
              <p><strong>Payment Method:</strong> {item.paymentMethod}</p>
              <p><strong>Transaction ID:</strong> {item.transitionId}</p>
              <p><strong>Date:</strong> {new Date(item.data).toLocaleString()}</p>

              {item.accountHolderName && (
                <p><strong>Account Holder Name:</strong> {item.accountHolderName}</p>
              )}
              {item.bankName && (
                <p><strong>Bank Name:</strong> {item.bankName}</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* ✅ Confirmation Modal */}
      {showModal && (
        <div className="confirm-modal">
          <div className="modal-box">
            <p>Are you sure you want to delete this deposit?</p>
            <div className="modal-actions">
              <button className="yes" onClick={() => handleDelete(deleteId)}>Yes, Delete</button>
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AllDeposits;
