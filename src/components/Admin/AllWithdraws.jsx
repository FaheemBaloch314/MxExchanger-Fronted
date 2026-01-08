import React, { useEffect, useState } from 'react';
import '../../styles/admin/AllWithdraws.scss';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AllWithdraws = () => {
  const [allData, setAllData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkUserIsLogin = async () => {
      const response = await fetch('http://localhost:3000/api/v1/isAdmin', {
        method: 'GET',
        credentials: 'include'
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
    const getAllData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/admin/all/withdraws', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) throw new Error("Failed to fetch withdraws");

        const result = await response.json();
        setAllData(result || []);
      } catch (error) {
        toast.error("Internal Server Error. Contact Faheem.");
      }
    };

    getAllData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/admin/all/withdraws/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setAllData((prevData) => prevData.filter(item => item._id !== id));
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
    <section className='AllWithdraws'>
      <h3>All Withdraws</h3>

      <div className="contant">
        {allData.length === 0 ? (
          <p>No withdrawal found.</p>
        ) : (
          allData.map((item) => (
            <div className="card" key={item._id}>
              <div className="card-header">
                <FaTrash className="delete-icon" onClick={() => confirmDelete(item._id)} />
              </div>

              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Email:</strong> {item.email}</p>
              <p><strong>Account Number:</strong> {item.account}</p>
              <p><strong>Amount:</strong> {item.amount} PKR</p>
              <p><strong>Total Amount:</strong> {item.totalAmount} PKR</p>
              <p><strong>Payment Via:</strong> {item.gateway}</p>
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

      {/* ✅ Custom Confirmation Modal */}
      {showModal && (
        <div className="confirm-modal">
          <div className="modal-box">
            <p>Are you sure you want to delete this withdrawal?</p>
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

export default AllWithdraws;
