import React, { useEffect, useState } from 'react';
import '../../styles/admin/users.scss';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const usersPerPage = 10;


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

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/users', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error('Failed to load users');
      }
    } catch (err) {
      toast.error('Error fetching users');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmDelete = (id) => {
    setSelectedUserId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/users/${selectedUserId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        const updatedUsers = users.filter(user => user._id !== selectedUserId);
        setUsers(updatedUsers);
        const newTotalPages = Math.ceil(updatedUsers.length / usersPerPage);
        setCurrentPage(prev => Math.min(prev, newTotalPages || 1));
      } else {
        toast.error(data.error || 'Deletion failed');
      }
    } catch (err) {
      toast.error('Error deleting user');
      console.error(err);
    } finally {
      setShowModal(false);
      setSelectedUserId(null);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <section className="users">
      <h3>All Users</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Country</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.country}</td>
                <td>{user.role}</td>
                <td>
                  <MdDelete
                    onClick={() => confirmDelete(user._id)}
                    style={{ color: '#ff4d4f', cursor: 'pointer', fontSize: '1.2rem' }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5">No users found.</td></tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {users.length > usersPerPage && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}

      {/* Custom Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h4>Confirm Deletion</h4>
            <p>Are you sure you want to delete this user?</p>
            <div className="modal-actions">
              <button onClick={handleDelete} className="confirm">Yes, Delete</button>
              <button onClick={() => setShowModal(false)} className="cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Users;
