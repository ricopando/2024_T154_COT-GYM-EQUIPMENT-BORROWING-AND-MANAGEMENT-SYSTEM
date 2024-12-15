  import React, { useState, useEffect } from 'react';
  import { useLocation, useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faChevronLeft, faChevronRight, faHome, faUser, faMoneyBill, faBook,  faBox, faFile, faPlus } from '@fortawesome/free-solid-svg-icons';
  import { CgGym } from "react-icons/cg";       

  const ErrorDialog = ({ isVisible, message, onClose }) => {
    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-black">
          <h2 className="text-lg font-bold mb-4">Error</h2>
          <p>{message}</p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SuccessDialog = ({ isVisible, message, onClose }) => {
    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-black">
          <h2 className="text-lg font-bold mb-4">Success</h2>
          <p>{message}</p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(() => {
      // Initialize sidebar state from localStorage
      const savedState = localStorage.getItem('sidebarOpen');
      return savedState !== null ? JSON.parse(savedState) : true;
    });
    const [admin, setAdmin] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [error, setError] = useState({ message: '', isVisible: false });
    const [success, setSuccess] = useState({ message: '', isVisible: false });

    const handleToggle = () => {
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);
      // Save the new state to localStorage
      localStorage.setItem('sidebarOpen', JSON.stringify(newIsOpen));
    };

    const handleError = (message) => {
      setError({ message, isVisible: true });
    };

    const handleCloseError = () => {
      setError({ message: '', isVisible: false });
    };

    const handleCloseSuccess = () => {
      setSuccess({ message: '', isVisible: false });
    };

    useEffect(() => {
      const fetchAdminData = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/auth/status', { withCredentials: true });
          if (response.data?.user) {
            setAdmin(response.data.user);
          }
        } catch (error) {
          console.error('Error fetching admin data:', error);
          handleError('Failed to fetch admin data. Please try again later.');
        }
      };
      fetchAdminData();
    }, []);

    const handleLogout = async () => {
      try {
        await axios.get('http://localhost:8000/api/auth/logout', { withCredentials: true });
        setAdmin(null);
        navigate('/');
      } catch (error) {
        console.error('Error during logout:', error);
        handleError('Failed to log out. Please try again.');
      }
    };

    const handleOpenChangePassword = () => {
      setIsChangePasswordOpen(true);
    };

    const handleCloseChangePassword = () => {
      setIsChangePasswordOpen(false);
    };

    const handleOpenLogout = () => {
      setIsLogoutOpen(true);
    };

    const handleCloseLogout = () => {
      setIsLogoutOpen(false);
    };

    const handleChangePassword = async (e) => {
      e.preventDefault();
      if (newPassword !== verifyPassword) {
        handleError('Passwords do not match');
        return;
      }
      try {
        await axios.post(
          'http://localhost:8000/api/auth/change-password',
          { newPassword },
          { withCredentials: true }
        );
        setSuccess({ message: 'Password changed successfully', isVisible: true });
        setNewPassword('');
        setVerifyPassword('');
        setIsChangePasswordOpen(false);
      } catch (error) {
        console.error('Error changing password:', error);
        handleError('Error changing password. Please try again later.');
      }
    };

    if (!admin) return null;

    const isActive = (path) => location.pathname === path;

    return (
      <div className={`h-screen ${isOpen ? 'w-64' : 'w-16'} bg-primary text-white flex flex-col transition-width duration-300 relative z-10`}>
        <div className="flex items-center justify-between p-2 border-b border-secondary">
          <div className="text-lg font-bold flex items-center">
            {isOpen && (
              <>
                <CgGym size="50" className="ml-2" />
                <span>GEMS</span>
              </>
            )}
          </div>
          <button
            onClick={handleToggle}
            className="p-3 focus:outline-none focus:bg-gray-700 z-10"
            aria-label="Toggle Sidebar"
            aria-expanded={isOpen}
          >
            <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} />
          </button>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a href="/dashboard" className={`flex items-center p-2 rounded hover:bg-secondary focus:outline-none focus:bg-secondary ${isActive('/dashboard') ? 'bg-secondary' : ''}`} aria-label="Home">
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                {isOpen && 'Dashboard'}
              </a>
            </li>
            <li>
              <a href="/userManagement" className={`flex items-center p-2 rounded hover:bg-secondary focus:outline-none focus:bg-secondary ${isActive('/userManagement') ? 'bg-secondary' : ''}`} aria-label="User">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                {isOpen && 'User Management'}
              </a>
            </li> 
            <li>
              <a href="/inventory" className={`flex items-center p-2 rounded hover:bg-secondary focus:outline-none focus:bg-secondary ${isActive('/inventory') ? 'bg-secondary' : ''}`} aria-label="Inventory">
                <FontAwesomeIcon icon={faBox} className="mr-2" />
                {isOpen && 'Inventory'}
              </a>
            </li>
            <li>
              <a href="/transaction" className={`flex items-center p-2 rounded hover:bg-secondary focus:outline-none focus:bg-secondary ${isActive('/transaction') ? 'bg-secondary' : ''}`} aria-label="Transaction">
                <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
                {isOpen && 'Transaction'}
              </a>
            </li>
            <li>
              <a href="/addtransaction" className={`flex items-center p-2 rounded hover:bg-secondary focus:outline-none focus:bg-secondary ${isActive('/addtransaction') ? 'bg-secondary' : ''}`} aria-label="Add Transaction">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                {isOpen && 'Add Transaction'}
              </a>
            </li>
            <li>
              <a href="/borrowed" className={`flex items-center p-2 rounded hover:bg-secondary focus:outline-none focus:bg-secondary ${isActive('/borrowed') ? 'bg-secondary' : ''}`} aria-label="Borrowing">
                <FontAwesomeIcon icon={faBook} className="mr-2" />
                {isOpen && 'Borrowing'}
              </a>
            </li>
            <li>
              <a href="/report" className={`flex items-center p-2 rounded hover:bg-secondary focus:outline-none focus:bg-secondary ${isActive('/report') ? 'bg-secondary' : ''}`} aria-label="Report">
                <FontAwesomeIcon icon={faFile} className="mr-2" />
                {isOpen && 'Report'}
              </a>
            </li>
            
          </ul>
        </nav>
       


        {/* Error Dialog */}
        <ErrorDialog
          isVisible={error.isVisible}
          message={error.message}
          onClose={handleCloseError}
        />

        {/* Success Dialog */}
        <SuccessDialog
          isVisible={success.isVisible}
          message={success.message}
          onClose={handleCloseSuccess}
        />
      </div>
    );
  };

  export default Sidebar;
