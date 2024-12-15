import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

const AddAdmin = ({ isOpen, onClose, onUserPromoted }) => {
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
  });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promotingUserId, setPromotingUserId] = useState(null);
  const [isExemptFromRestriction, setIsExemptFromRestriction] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8000/api/auth/users', {
        withCredentials: true
      });
      console.log('User data:', response.data[0]);
      const filteredUsers = response.data.filter(user => user.role === 'User');
      setUsers(filteredUsers);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    try {
      setPromotingUserId(userId);
      const response = await axios.patch(`http://localhost:8000/api/auth/users/${userId}/promote`, {}, {
        withCredentials: true
      });
      
      if (response.data.updatedUser) {
        // Remove the promoted user from the users list
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        
        // Notify parent component about the promotion
        if (onUserPromoted) {
          onUserPromoted(response.data.updatedUser);
        }
        
        // Show success message
        alert('User promoted to admin successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to promote user to admin');
      console.error('Error promoting user:', err);
    } finally {
      setPromotingUserId(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const columns = [
    {
      name: 'Image',
      cell: row => (
        <div className="py-2">
          {row.image ? (
            <img
              src={row.image}
              alt={`${row.displayName}'s profile`}
              className="h-10 w-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
                e.target.onerror = null;
              }}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">
                {row.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>
      ),
      width: '80px',
    },
    {
      name: 'Name',
      selector: row => row.displayName,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <button
          onClick={() => handlePromoteToAdmin(row._id)}
          disabled={promotingUserId === row._id}
          className="px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors"
          aria-label={`Promote ${row.displayName} to admin`}
          aria-live="polite"
        >
          {promotingUserId === row._id ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin" />
              Promoting...
            </span>
          ) : (
            'Promote to Admin'
          )}
        </button>
      ),
      width: '200px',
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full"
          aria-label="Close modal"
        >
          <FaTimes className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Admin</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            pagination
            highlightOnHover
            responsive
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: '#F9FAFB',
                  borderBottom: '1px solid #E5E7EB',
                },
              },
              headCells: {
                style: {
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  padding: '12px 16px',
                },
              },
              cells: {
                style: {
                  fontSize: '0.875rem',
                  color: '#1F2937',
                  padding: '12px 16px',
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AddAdmin;